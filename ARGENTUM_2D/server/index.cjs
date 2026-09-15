'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { WebSocketServer, WebSocket } = require('ws');
const A = require('../src/engine.js');
const copy = x => JSON.parse(JSON.stringify(x));
const assert = (v, message) => { if (!v) throw Error(message); };
const token = () => crypto.randomBytes(32).toString('base64url');
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const CHANNELS = ['PROXIMITY','PARTY','CONGRESS','POLICE','FIRE_SERVICE','MEDICAL'];
const COMMANDS = new Set(('GOVERNMENT_MEASURE PROMISE_CREATE PROMISE_LINK PROMISE_ABANDON ENTER EXIT DOOR SIT CART_ADD CART_CLEAR EQUIP RELOAD ATTACK FOOTBALL_START KICK TALK BUY USE DROP PICKUP PROPOSE AMEND VOTE EXECUTIVE OVERRIDE CAMPAIGN BUY_PROPERTY SELL_PROPERTY BUSINESS RESTOCK TAKE_STOCK WITHDRAW STORAGE REST TRAIN JOB WORK TREAT CRIME ARREST VERDICT FIRE CHECKOUT BLOCK_STANCE LOBBY_CREATE LOBBY_ASSIGN LOBBY_READY LOBBY_DELETE_PARTY LOBBY_RENAME LOBBY_CONFIG LOBBY_BOTS LOBBY_REMOVE START BALLOT TEST_KIT').split(' '));
function envNumber(env, key, fallback, min, max) { const v = Number(env[key] ?? fallback); assert(Number.isFinite(v) && v >= min && v <= max, 'Configuración inválida: '+key); return v; }
function createServer(options = {}) {
  const env = options.env || process.env;
  const config = { daySeconds: envNumber(env,'DAY_SECONDS',60,1,3600), range:envNumber(env,'VOICE_PROXIMITY_RANGE',10,1,100), units:envNumber(env,'WORLD_UNITS_PER_METER',24,1,100), maxRooms:envNumber(env,'MAX_ROOMS',20,1,100), allowBots:env.ALLOW_TEST_BOTS !== 'false' };
  assert(!!env.TURN_URLS===!!env.TURN_SECRET,'Configurá TURN_URLS y TURN_SECRET juntos');
  assert(env.VOICE_RELAY_ONLY!=='true'||!!env.TURN_URLS,'VOICE_RELAY_ONLY necesita TURN configurado');
  const rooms = new Map(), root = path.resolve(__dirname,'..');
  const stateDir = env.STATE_DIR ? path.resolve(env.STATE_DIR) : null;
  if (stateDir) {
    fs.mkdirSync(stateDir,{recursive:true,mode:0o700});
    for (const file of fs.readdirSync(stateDir).filter(x=>/^[A-F0-9]{10}\.json$/.test(x))) {
      try {
        const x = JSON.parse(fs.readFileSync(path.join(stateDir,file),'utf8'));
        const engine = new A.Engine(); assert(engine.load(x.game).ok,'Partida inválida');
        const room = makeRoom(x.code,engine,x.testMode); room.owners = x.owners || {}; room.readies = {};
        room.identities = new Map(x.identities.map(([id,r])=>[id,{...r,seen:new Map(r.seen||[])}]));
        for (const p of Object.values(engine.state.players)) if (!p.isBot) p.connected=false;
        for (const p of engine.state.politics.parties) if(engine.state.session.phase==='LOBBY') p.ready=p.members.every(id=>engine.state.players[id].isBot);
        rooms.set(room.code,room);
      } catch { console.error('No se pudo recuperar una sala guardada:',file); }
    }
  }
  function makeRoom(code,engine,testMode) { engine.state.session.mode='ONLINE'; return {code,engine,testMode,clients:new Map(),identities:new Map(),owners:{},readies:{},dayClock:0,lastActive:Date.now(),voiceTurn:null,voiceEpoch:0,edges:new Map(),fault:null}; }
  function persist(room) { if (!stateDir) return; const dest=path.join(stateDir,room.code+'.json'); const body={code:room.code,game:room.engine.save(),testMode:room.testMode,owners:room.owners,identities:[...room.identities].map(([id,r])=>[id,{tokenHash:r.tokenHash,seen:[...r.seen]}])}; fs.writeFileSync(dest+'.tmp',JSON.stringify(body),{mode:0o600}); fs.renameSync(dest+'.tmp',dest); }
  const server = http.createServer((req,res)=>{
    const url = new URL(req.url,'http://localhost');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Permissions-Policy','microphone=(self), camera=()');
    if(url.pathname==='/healthz') {res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,protocol:3,rooms:rooms.size}));return;}
    const files = {'/':'ARGENTUM_2D.html','/ARGENTUM_2D.html':'ARGENTUM_2D.html','/favicon.ico':null};
    if(req.method!=='GET'||!Object.hasOwn(files,url.pathname)||!files[url.pathname]) {res.writeHead(404);res.end();return;}
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; media-src 'self' blob:; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    const stream=fs.createReadStream(path.join(root,files[url.pathname]));stream.on('error',()=>{res.statusCode=503;res.end('Construí el cliente: npm run build');});stream.pipe(res);
  });
  const wss=new WebSocketServer({noServer:true,maxPayload:32768,perMessageDeflate:false});
  const ipAttempts = new Map();
  server.on('upgrade',(req,socket,head)=>{
    const origin=req.headers.origin, host=req.headers.host;
    const allowed=(env.ALLOWED_ORIGINS||'').split(',').filter(Boolean);
    const validOrigin=!origin ? env.NODE_ENV!=='production' : allowed.length ? allowed.includes(origin) : ['http://'+host,'https://'+host].includes(origin);
    const ip=req.socket.remoteAddress, now=Date.now(), entry=ipAttempts.get(ip)||{n:0,at:now};
    if(now-entry.at>60000){entry.n=0;entry.at=now;}entry.n++;ipAttempts.set(ip,entry);
    if(req.url!=='/ws'||!validOrigin||entry.n>60||wss.clients.size>=config.maxRooms*12+20){socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');socket.destroy();return;}
    wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));
  });
  function send(ws,data) { if(ws.readyState===WebSocket.OPEN){if(ws.bufferedAmount>2e6){ws.close(1013,'Conexión lenta');return;}ws.send(JSON.stringify(data));} }
  function publicState(room,id){
    const s=copy(room.engine.state); delete s.player; s.session.activeId=id;s.session.received={};s.session.readyPlayers=copy(room.readies);s.session.testMode=room.testMode;s.session.roomCode=room.code;s.session.serverFault=room.fault;
    s.commands=[];s.politics.ballots=Object.hasOwn(s.politics.ballots,id)?{[id]:s.politics.ballots[id]}:{};
    s.politics.elections=s.politics.elections.slice(0,6).map(e=>({...e,playerBallots:{}}));
    for(const p of Object.values(s.players))if(p.id!==id){p.inventory={};p.cart={};p.ammo={magazine:0,reserve:0};delete p.money;delete s.accounts[p.id];}
    s.ledger=s.ledger.filter(l=>!Object.values(room.engine.state.players).some(p=>p.id!==id&&(l.from===p.id||l.to===p.id))).slice(-80);
    return s;
  }
  function snapshot(ws){const c=ws.argentum;if(c?.room)send(ws,{kind:'state',state:publicState(c.room,c.id),serverTime:Date.now()});}
  function broadcast(room){for(const ws of room.clients.values())snapshot(ws);}
  function iceConfig(id){
    const iceServers=[];if(env.STUN_URLS!== '') iceServers.push({urls:(env.STUN_URLS||'stun:stun.l.google.com:19302').split(',')});
    if(env.TURN_URLS && env.TURN_SECRET){const username=Math.floor(Date.now()/1000+3600)+':'+id;iceServers.push({urls:env.TURN_URLS.split(','),username,credential:crypto.createHmac('sha1',env.TURN_SECRET).update(username).digest('base64')});}
    return {iceServers,iceTransportPolicy:env.VOICE_RELAY_ONLY==='true'?'relay':'all',hasTurn:!!(env.TURN_URLS&&env.TURN_SECRET),range:config.range,units:config.units};
  }
  function voiceEligible(s,p,ch){if(!p||!p.connected)return false;switch(ch){case 'PROXIMITY':return true;case 'PARTY':return !!p.party;case 'CONGRESS':return p.inside==='congress'&&p.legal==='FREE';case 'POLICE':return p.role==='POLICE';case 'FIRE_SERVICE':return p.role==='FIREFIGHTER';case 'MEDICAL':return ['DOCTOR','NURSE'].includes(p.role);default:return false;}}
  function canHear(room,a,b){const s=room.engine.state,p=s.players[a.id],q=s.players[b.id],ch=a.voice.channel;if(!a.voice.enabled||!b.voice.enabled||ch!==b.voice.channel||!voiceEligible(s,p,ch)||!voiceEligible(s,q,ch))return false;
    if(ch==='PARTY')return p.party===q.party;
    if(ch==='PROXIMITY')return s.session.phase==='LOBBY'||p.inside===q.inside&&Math.hypot(p.x-q.x,p.y-q.y)<config.range*config.units;
    return true;
  }
  function voicePeers(room){
    const clients=[...room.clients.values()].map(ws=>ws.argentum),s=room.engine.state;
    for(const c of clients)if(!voiceEligible(s,s.players[c.id],c.voice.channel))c.voice.speaking=false;
    const turn=clients.find(c=>c.id===room.voiceTurn&&c.voice.enabled&&c.voice.channel==='CONGRESS'&&c.voice.speaking&&voiceEligible(s,s.players[c.id],'CONGRESS'));
    if(!turn)room.voiceTurn=null;
    const edges=new Map();for(let i=0;i<clients.length;i++)for(let j=i+1;j<clients.length;j++)if(canHear(room,clients[i],clients[j])){const key=[clients[i].id,clients[j].id].sort().join(':');edges.set(key,room.edges.get(key)||++room.voiceEpoch);}room.edges=edges;
    for(const c of clients){const peers=clients.filter(b=>b.id!==c.id&&canHear(room,c,b)).map(b=>({id:b.id,name:s.players[b.id].name,epoch:edges.get([c.id,b.id].sort().join(':')),speaking:b.voice.speaking,channel:b.voice.channel}));send(c.ws,{kind:'voicePeers',peers,turn:room.voiceTurn,channel:c.voice.channel});}
  }
  function attach(ws,room,id,newToken){const c=ws.argentum;c.room=room;c.id=id;c.input=null;room.clients.get(id)?.close(4001,'Sesión reconectada');room.clients.set(id,ws);room.engine.state.players[id].connected=true;room.lastActive=Date.now();room.engine.state.session.revision++;send(ws,{kind:'joined',room:room.code,actorId:id,token:newToken,voice:iceConfig(id),state:publicState(room,id)});broadcast(room);voicePeers(room);persist(room);}
  function dispatch(c,type,args){const r=c.room.engine.dispatch(type,args,c.id);assert(r.ok,r.error);return r;}
  function command(c,m){const room=c.room,s=room.engine.state,a=m.args||{},type=m.type,p=s.players[c.id];
    assert(typeof m.commandId==='string'&&m.commandId.length<=80&&m.commandId.length>0,'Identificador inválido');assert(!Object.hasOwn(m,'actorId'),'La identidad la determina la conexión');
    const identity=room.identities.get(c.id);if(identity.seen.has(m.commandId))return identity.seen.get(m.commandId);
    assert(a&&typeof a==='object'&&!Array.isArray(a),'Argumentos inválidos');
    let result;
    try {
      if(type==='SET_SPEED'){assert(c.id===s.session.hostId,'Solo el anfitrión controla el reloj');assert([0,1,2,4].includes(a.speed),'Velocidad inválida');s.time.speed=a.speed;s.session.revision++;result={ok:true};}
      else {
        assert(COMMANDS.has(type),'Comando no permitido en red');
        assert(s.session.phase!=='LOBBY'||type.startsWith('LOBBY_')||type==='START','La partida no empezó');
        if(['LOBBY_BOTS','LOBBY_REMOVE','LOBBY_CONFIG','START'].includes(type))assert(c.id===s.session.hostId,'Solo el anfitrión puede hacerlo');
        if(['LOBBY_BOTS','TEST_KIT'].includes(type))assert(room.testMode,'Equipo/bots disponibles solo en salas de prueba');
        if(type==='LOBBY_REMOVE')assert(s.players[a.id]?.isBot||s.players[a.id]?.connected===false,'Solo se puede retirar a un bot o participante desconectado');
        if(type==='LOBBY_RENAME')assert(a.id===c.id,'Solo podés cambiar tu nombre');
        if(type==='LOBBY_CREATE')assert(!Object.values(room.owners).includes(c.id),'Ya creaste una fórmula');
        if(type==='LOBBY_DELETE_PARTY')assert(room.owners[a.id]===c.id||c.id===s.session.hostId&&!(s.politics.parties.find(p=>p.id===a.id)?.members.length),'No podés eliminar esta fórmula');
        if(type==='LOBBY_ASSIGN'){
          const party=s.politics.parties.find(p=>p.id===a.party);assert(party&&['president','judge'].includes(a.slot),'Fórmula inválida');
          assert(a.player===c.id&&!party.candidates[a.slot]||!a.player&&party.candidates[a.slot]===c.id,'Cada persona ocupa o libera únicamente su propia candidatura');
        }
        if(type==='START')assert(Object.values(s.players).every(p=>p.isBot||p.connected),'Faltan participantes conectados');
        if(type==='AMEND')assert(s.politics.bills.find(b=>b.id===a.id)?.author===c.id,'Solo el autor modifica el proyecto');
        if(type==='FOOTBALL_START')assert(s.football.status!=='PLAYING','Ya hay un partido en juego');
        if(type==='LOBBY_READY'){
          const party=s.politics.parties.find(p=>p.id===a.party);assert(s.session.phase==='LOBBY'&&party?.members.includes(c.id),'Confirmá tu propio partido');assert(globalThis.ArgentumLobby.ready(party),'Faltan candidaturas');
          room.readies[c.id]=!room.readies[c.id];party.ready=party.members.every(id=>s.players[id].connected&&(s.players[id].isBot||room.readies[id]));s.session.revision++;result={ok:true};
        }else{
          result=dispatch(c,type,a);
          if(type==='LOBBY_CREATE')room.owners[room.engine.state.politics.parties.at(-1).id]=c.id;
          if(type==='LOBBY_DELETE_PARTY')delete room.owners[a.id];
          if(type==='LOBBY_REMOVE')room.identities.delete(a.id);
          if(type==='LOBBY_ASSIGN'){for(const party of room.engine.state.politics.parties){party.ready=party.members.every(id=>room.engine.state.players[id].isBot)&&globalThis.ArgentumLobby.ready(party);}room.readies={};}
          if(type==='START')room.engine.state.time.speed=1;
          if(['ENTER','EXIT','SIT'].includes(type))c.input=null;
        }
      }
    }catch(e){result={ok:false,error:e.message};}
    identity.seen.set(m.commandId,result);if(identity.seen.size>512)identity.seen.delete(identity.seen.keys().next().value);
    // Retry outcomes and economic mutations survive reconnect/restart on a persistent volume.
    persist(room);return result;
  }
  wss.on('connection',ws=>{
    const c=ws.argentum={ws,id:null,room:null,voice:{enabled:false,channel:'PROXIMITY',speaking:false},tokens:100,refill:Date.now(),alive:true};
    ws.on('pong',()=>c.alive=true);
    const authTimer=setTimeout(()=>{if(!c.room)ws.close(4000,'Tiempo de conexión agotado');},15000);
    ws.on('message',data=>{
      try{
        const now=Date.now();c.tokens=Math.min(100,c.tokens+(now-c.refill)*.06);c.refill=now;assert(c.tokens>=1,'Demasiadas solicitudes');c.tokens--;
        const m=JSON.parse(data.toString());assert(m&&typeof m==='object'&&!Array.isArray(m),'Mensaje inválido');
        if(!c.room){
          assert(['create','join','resume'].includes(m.kind),'Conectate a una sala primero');
          if(m.kind==='resume'){const room=rooms.get(m.room);assert(room&&typeof m.token==='string'&&typeof m.actorId==='string','Sesión inexistente');const r=room.identities.get(m.actorId);assert(r&&room.engine.state.players[m.actorId]&&hash(m.token)===r.tokenHash,'Sesión inválida');attach(ws,room,m.actorId,m.token);}
          else if(m.kind==='create'){assert(rooms.size<config.maxRooms,'Servidor completo');assert(typeof m.name==='string'&&m.name.trim(),'Escribí tu nombre');const code=crypto.randomBytes(5).toString('hex').toUpperCase(),room=makeRoom(code,new A.Engine(A.newGame(m.name)),!!m.testMode&&config.allowBots),t=token();room.identities.set('player',{tokenHash:hash(t),seen:new Map()});rooms.set(code,room);attach(ws,room,'player',t);}
          else {const room=rooms.get(String(m.room).toUpperCase());assert(room,'Sala inexistente');assert(room.engine.state.session.phase==='LOBBY','La sala ya comenzó; solo se admite reconexión');assert(typeof m.name==='string'&&m.name.trim(),'Escribí tu nombre');const before=Object.keys(room.engine.state.players);const r=room.engine.dispatch('LOBBY_ADD',{name:m.name},room.engine.state.session.hostId);assert(r.ok,r.error);const id=Object.keys(room.engine.state.players).find(id=>!before.includes(id)),t=token();room.identities.set(id,{tokenHash:hash(t),seen:new Map()});attach(ws,room,id,t);}
          clearTimeout(authTimer);return;
        }
        c.room.lastActive=now;
        if(m.kind==='command'){const result=command(c,m);send(ws,{kind:'ack',commandId:m.commandId,...result});broadcast(c.room);voicePeers(c.room);}
        else if(m.kind==='input'){assert(Number.isFinite(m.x)&&Number.isFinite(m.y)&&Math.abs(m.x)<=1&&Math.abs(m.y)<=1,'Entrada inválida');c.input={x:m.x,y:m.y,run:m.run===true,at:now};}
        else if(m.kind==='voiceConfig')send(ws,{kind:'voiceConfig',voice:iceConfig(c.id)});
        else if(m.kind==='voiceState'){
          assert(CHANNELS.includes(m.channel),'Canal inválido');if(m.enabled&&!voiceEligible(c.room.engine.state,c.room.engine.state.players[c.id],m.channel)){c.voice.enabled=false;c.voice.speaking=false;voicePeers(c.room);throw Error('Canal no habilitado para tu rol/lugar');}
          let speaking=m.speaking===true&&m.enabled===true;
          if(speaking&&m.channel==='CONGRESS'){assert(!c.room.voiceTurn||c.room.voiceTurn===c.id,'Esperá tu turno de palabra');c.room.voiceTurn=c.id;}
          c.voice={enabled:m.enabled===true,channel:m.channel,speaking};voicePeers(c.room);
        } else if(m.kind==='signal'){
          const peer=c.room.clients.get(m.to)?.argentum,key=[c.id,m.to].sort().join(':');
          assert(peer&&canHear(c.room,c,peer)&&c.room.edges.get(key)===m.epoch,'Destinatario de voz no habilitado');
          assert(m.signal&&typeof m.signal==='object'&&JSON.stringify(m.signal).length<24000,'Señal inválida');send(peer.ws,{kind:'signal',from:c.id,epoch:m.epoch,signal:m.signal});
        }else if(m.kind==='ping')send(ws,{kind:'pong',at:m.at});else throw Error('Mensaje desconocido');
      }catch(e){send(ws,{kind:'error',error:e.message});}
    });
    ws.on('error',()=>{});
    ws.on('close',()=>{clearTimeout(authTimer);const room=c.room;if(room&&room.clients.get(c.id)===ws){room.clients.delete(c.id);room.engine.state.players[c.id].connected=false;delete room.readies[c.id];const party=room.engine.state.politics.parties.find(p=>p.members.includes(c.id));if(party&&room.engine.state.session.phase==='LOBBY')party.ready=false;room.engine.state.session.revision++;broadcast(room);voicePeers(room);persist(room);}});
  });
  let n=0;
  const tick=setInterval(()=>{
    n++;
    for(const room of rooms.values()){
      if(!room.clients.size||room.fault)continue;
      if(room.engine.state.session.phase!=='LOBBY'){
        for(const [id,ws] of room.clients){const inp=ws.argentum.input,p=room.engine.state.players[id];if(!inp||Date.now()-inp.at>200)continue;const norm=Math.hypot(inp.x,inp.y);if(norm){const speed=inp.run&&p.energy>5?300:180,scale=Math.min(1,norm)/norm;room.engine.dispatch('MOVE',{x:p.x+inp.x*scale*speed*.05,y:p.y+inp.y*scale*speed*.05,run:inp.run},id);}}
        const r=room.engine.dispatch('PHYSICS',{dt:.05},room.engine.state.session.hostId);if(!r.ok){room.fault=r.error;console.error('Motor físico detenido:',r.error);}
        room.dayClock+=.05*room.engine.state.time.speed;
        if(room.dayClock>=config.daySeconds){room.dayClock=0;const r=room.engine.dispatch('ADVANCE',{days:1},room.engine.state.session.hostId);if(!r.ok)room.fault=r.error;persist(room);}
      }
      if(n%2===0)broadcast(room);if(n%2===0)voicePeers(room);
    }
  },50);
  const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.argentum.alive){ws.terminate();continue;}ws.argentum.alive=false;ws.ping();}for(const [ip,v] of ipAttempts)if(Date.now()-v.at>60000)ipAttempts.delete(ip);for(const [id,room] of rooms)if(!room.clients.size&&Date.now()-room.lastActive>86400000){rooms.delete(id);if(stateDir)fs.rmSync(path.join(stateDir,id+'.json'),{force:true});}},30000);
  return {server,rooms,config,voiceEligible,canHear,iceConfig,publicState,persist,
    listen:(port=Number(env.PORT||3000),host=env.HOST||'0.0.0.0')=>new Promise(resolve=>server.listen(port,host,()=>resolve(server.address()))),
    close:async()=>{clearInterval(tick);clearInterval(heartbeat);for(const room of rooms.values())persist(room);for(const ws of wss.clients)ws.terminate();await new Promise(resolve=>wss.close(resolve));await new Promise(resolve=>server.close(resolve));}
  };
}
module.exports={createServer};
if(require.main===module){const app=createServer();app.listen().then(a=>console.log('ARGENTUM online · puerto '+a.port));for(const sig of ['SIGTERM','SIGINT'])process.once(sig,async()=>{await app.close();process.exit(0);});}
