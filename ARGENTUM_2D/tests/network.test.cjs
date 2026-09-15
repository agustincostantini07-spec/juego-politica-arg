'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {WebSocket}=require('ws');
const {createServer}=require('../server/index.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(f,label='condition',timeout=4000){const start=Date.now();while(!f()){if(Date.now()-start>timeout)throw Error('Timed out: '+label);await delay(15)}return f()}
async function client(url,hello){const ws=new WebSocket(url),c={ws,messages:[],state:null,id:null,seq:0};ws.on('message',d=>{const m=JSON.parse(d);c.messages.push(m);if(m.kind==='joined'){c.id=m.actorId;c.token=m.token;c.room=m.room;c.voice=m.voice;c.state=m.state;}if(m.kind==='state')c.state=m.state;});await new Promise((r,j)=>{ws.once('open',r);ws.once('error',j)});ws.send(JSON.stringify(hello));await until(()=>c.id||c.messages.some(m=>m.kind==='error'),'join response');
c.send=m=>ws.send(JSON.stringify(m));c.cmd=async(type,args={},extra={})=>{const commandId=extra.commandId||'cmd'+(++c.seq);const start=c.messages.length;c.send({kind:'command',type,args,commandId,...extra});return until(()=>c.messages.slice(start).find(m=>m.kind==='ack'&&m.commandId===commandId||m.kind==='error'),'ack '+type)};return c;}
async function setup(t,n=4,env={}){const app=createServer({env:{...env,STUN_URLS:'',DAY_SECONDS:'3600'}});const address=await app.listen(0,'127.0.0.1'),url='ws://127.0.0.1:'+address.port+'/ws';const a=await client(url,{kind:'create',name:'Ana',testMode:true});const clients=[a];for(let i=1;i<n;i++)clients.push(await client(url,{kind:'join',room:a.room,name:['','Bruno','Carla','Diego'][i]||'Otro'}));t.after(async()=>{for(const c of clients)c.ws.terminate();await app.close()});return{app,url,clients,room:app.rooms.get(a.room),a};}
async function ok(c,type,args={},extra={}){const r=await c.cmd(type,args,extra);assert.equal(r.ok,true,JSON.stringify(r));return r}
async function startFour(x){const [a,b,c,d]=x.clients;await ok(a,'LOBBY_CREATE',{name:'Acuerdo A'});let party=x.room.engine.state.politics.parties[0];await ok(a,'LOBBY_ASSIGN',{party:party.id,slot:'president',player:a.id});await ok(b,'LOBBY_ASSIGN',{party:party.id,slot:'judge',player:b.id});await ok(c,'LOBBY_CREATE',{name:'Acuerdo B'});const other=x.room.engine.state.politics.parties[1];await ok(c,'LOBBY_ASSIGN',{party:other.id,slot:'president',player:c.id});await ok(d,'LOBBY_ASSIGN',{party:other.id,slot:'judge',player:d.id});for(const p of [a,b])await ok(p,'LOBBY_READY',{party:party.id});for(const p of [c,d])await ok(p,'LOBBY_READY',{party:other.id});await ok(a,'START');await ok(a,'SET_SPEED',{speed:0});await until(()=>x.clients.every(c=>c.state.session.phase==='CAMPAIGN'));}
function place(x,c,inside,xp,yp){const p=x.room.engine.state.players[c.id];globalThis.ArgentumPhysical.warp(x.room.engine.state,p,inside,{x:xp,y:yp});}

test('four actual WebSocket clients: consent lobby, mutual movement, identity, speed limits and isolation',async t=>{const x=await setup(t);const [a,b]=x.clients;await until(()=>Object.keys(a.state.players).length===4&&Object.keys(b.state.players).length===4);
 assert.equal((await a.cmd('LOBBY_ASSIGN',{party:'bad',slot:'judge',player:b.id})).ok,false);
 await startFour(x);assert.deepEqual(a.state.politics,b.state.politics);
 const ax=x.room.engine.state.players[a.id].x,bx=x.room.engine.state.players[b.id].x;
 const refresh=setInterval(()=>{a.send({kind:'input',x:-1,y:0});b.send({kind:'input',x:1,y:0})},40);await delay(300);clearInterval(refresh);a.send({kind:'input',x:0,y:0});b.send({kind:'input',x:0,y:0});
 await until(()=>a.state.players[b.id].x>bx+18&&b.state.players[a.id].x<ax-18,'mutual movement');
 assert.ok(ax-b.state.players[a.id].x<=75,'server speed bound');
 assert.equal((await a.cmd('MOVE',{x:1500,y:1000})).ok,false);assert.equal((await a.cmd('PHYSICS',{dt:100})).ok,false);assert.equal((await a.cmd('ADVANCE',{days:120})).ok,false);assert.equal((await b.cmd('SET_SPEED',{speed:4})).ok,false);
 assert.equal((await a.cmd('USE',{id:'water'},{actorId:b.id})).kind,'error');
 const first=await client(x.url,{kind:'create',name:'Isolated'});t.after(()=>first.ws.terminate());assert.equal(Object.keys(first.state.players).length,1);assert.notEqual(first.room,a.room);
 const health=await fetch('http://127.0.0.1:'+x.app.server.address().port+'/healthz').then(r=>r.json());assert.equal(health.rooms,2);
});

test('real clients share market transactions, inventory privacy and retry idempotency',async t=>{const x=await setup(t);await startFour(x);const[a,b]=x.clients;
 place(x,a,'market',155,250);await ok(a,'CART_ADD',{id:globalThis.ArgentumInteriors.get('market').objects.find(o=>o.kind==='shelf'&&o.product==='water').id});place(x,a,'market',520,500);
 const before=x.room.engine.state.accounts[a.id];await ok(a,'CHECKOUT',{}, {commandId:'purchase-once'});const after=x.room.engine.state.accounts[a.id];assert.ok(after<before);await ok(a,'CHECKOUT',{}, {commandId:'purchase-once'});assert.equal(x.room.engine.state.accounts[a.id],after);
 await until(()=>a.state.players[a.id].inventory.water===4);assert.deepEqual(b.state.players[a.id].inventory,{});assert.equal(b.state.accounts[a.id],undefined);
 const sum=Object.values(x.room.engine.state.accounts).reduce((a,b)=>a+b,0);assert.ok(Math.abs(sum-x.room.engine.state.economy.moneyTotal)<.1);
 const day=x.room.engine.state.time.day;place(x,a,'plaza',500,600);await ok(a,'REST');assert.equal(x.room.engine.state.time.day,day);assert.equal((await a.cmd('REST')).ok,false);
});

test('one authoritative election, secret ballots, shared offices, chamber and law',async t=>{const x=await setup(t);await startFour(x);const[a,b]=x.clients;place(x,a,'congress',790,680);place(x,b,'congress',790,680);
 assert.ok(x.room.engine.dispatch('ADVANCE',{days:7}).ok);await until(()=>a.state.session.phase==='BALLOT');
 await ok(a,'BALLOT',{party:x.room.engine.state.players[a.id].party});assert.equal((await a.cmd('BALLOT',{party:x.room.engine.state.players[a.id].party})).ok,false);
 assert.equal(b.state.politics.ballots[a.id],undefined);assert.equal(b.state.commands.length,0);
 assert.ok(x.room.engine.dispatch('ADVANCE',{days:2}).ok);await until(()=>a.state.politics.president.id&&b.state.politics.president.id);
 for(const c of x.clients){assert.deepEqual(c.state.politics.president,a.state.politics.president);assert.deepEqual(c.state.politics.judge,a.state.politics.judge);assert.equal(c.state.politics.legislators.length,21);assert.deepEqual(c.state.politics.elections[0].playerBallots,{})}
 place(x,a,'congress',500,260);await ok(a,'PROPOSE',{key:'tax',value:.25,title:'Ley online'});const bill=x.room.engine.state.politics.bills[0];place(x,b,'congress',500,260);assert.equal((await b.cmd('AMEND',{id:bill.id,value:.30})).ok,false);
 assert.ok(x.room.engine.dispatch('ADVANCE',{days:2}).ok);assert.equal(x.room.engine.state.politics.bills[0].status,'EXECUTIVE');const pres=x.clients.find(c=>c.id===x.room.engine.state.politics.president.id);place(x,pres,'congress',500,160);await ok(pres,'EXECUTIVE',{id:bill.id});await until(()=>x.clients.every(c=>c.state.policy.tax===.25));
});

test('server projectiles hit another client; elected judge detains, sentences and releases shared actor',async t=>{const x=await setup(t);await startFour(x);const[a,b]=x.clients;
 place(x,a,'police',175,455);await ok(a,'TEST_KIT');await ok(a,'EQUIP',{id:'pistol'});place(x,a,null,1100,820);place(x,b,null,1150,820);await ok(a,'ATTACK',{x:1150,y:820});
 await until(()=>b.state.players[b.id].health===72,'network projectile damage');assert.equal(a.state.players[b.id].health,72);assert.equal(x.room.engine.state.justice.cases[0].suspect,a.id);assert.equal(x.room.engine.state.justice.cases[0].victim,b.id);
 // Test fixture only: appoint a judge and police on server to isolate multiplayer justice.
 const judge=x.clients[2],police=x.clients[3],s=x.room.engine.state;s.players[judge.id].role='JUDGE';s.politics.judge={id:judge.id,party:s.players[judge.id].party,name:'Carla'};s.players[police.id].role='POLICE';place(x,police,'police',205,235);
 const cause=s.justice.cases[0];await ok(police,'ARREST',{id:cause.id});assert.equal(x.room.engine.state.players[a.id].legal,'DETAINED');assert.equal(x.room.engine.state.players[a.id].inside,'police');
 assert.ok(x.room.engine.dispatch('ADVANCE',{days:1}).ok);place(x,judge,'court',500,180);assert.equal((await b.cmd('VERDICT',{id:cause.id,decision:'CONVICT'})).ok,false);await ok(judge,'VERDICT',{id:cause.id,decision:'CONVICT'});
 await until(()=>a.state.players[a.id].legal==='PRISONER');assert.equal(b.state.players[a.id].inside,'jail');assert.equal((await a.cmd('EXIT')).ok,false);assert.ok(x.room.engine.dispatch('ADVANCE',{days:6}).ok);await until(()=>a.state.players[a.id].legal==='FREE');
});

test('one football and goal score shared by actual clients in the same interior',async t=>{const x=await setup(t);await startFour(x);const[a,b]=x.clients;place(x,a,'pitch',500,675);place(x,b,'pitch',650,400);await ok(a,'FOOTBALL_START',{mode:'practice'});assert.equal((await b.cmd('FOOTBALL_START')).ok,false);
 // Place close to goal on server; the real client supplies a kick, never a score.
 place(x,a,'pitch',1000,340);Object.assign(x.room.engine.state.football.ball,{x:1020,y:340,vx:0,vy:0});await ok(a,'KICK',{x:1100,y:340});await until(()=>a.state.football.score[0]===1&&b.state.football.score[0]===1,'shared goal');assert.deepEqual(a.state.football.score,b.state.football.score);assert.equal(a.state.players[b.id].inside,'pitch');
});

test('voice signaling enforces scene, distance, party and role channels; no acoustic claim',async t=>{const x=await setup(t);const[a,b]=x.clients;
 a.send({kind:'voiceState',enabled:true,channel:'PROXIMITY',speaking:false});b.send({kind:'voiceState',enabled:true,channel:'PROXIMITY',speaking:false});
 await until(()=>a.messages.some(m=>m.kind==='voicePeers'&&m.peers.some(p=>p.id===b.id)),'lobby voice peers');const pair=a.messages.filter(m=>m.kind==='voicePeers').at(-1).peers.find(p=>p.id===b.id);
 a.send({kind:'signal',to:b.id,epoch:pair.epoch,signal:{description:{type:'offer',sdp:'test fixture, not media'}}});await until(()=>b.messages.some(m=>m.kind==='signal'&&m.from===a.id));
 await startFour(x);place(x,a,'congress',500,600);place(x,b,'congress',550,600);await until(()=>a.messages.filter(m=>m.kind==='voicePeers').at(-1).peers.some(p=>p.id===b.id));place(x,b,'market',550,600);await until(()=>!a.messages.filter(m=>m.kind==='voicePeers').at(-1).peers.some(p=>p.id===b.id),'different interiors isolated');
 place(x,b,'congress',900,600);await until(()=>!x.app.canHear(x.room,x.room.clients.get(a.id).argentum,x.room.clients.get(b.id).argentum),'distance blocked');
 a.send({kind:'voiceState',enabled:true,channel:'PARTY',speaking:false});b.send({kind:'voiceState',enabled:true,channel:'PARTY',speaking:false});await until(()=>a.messages.filter(m=>m.kind==='voicePeers').at(-1).peers.some(p=>p.id===b.id),'party across distance');
 b.send({kind:'voiceState',enabled:true,channel:'POLICE',speaking:true});await until(()=>b.messages.some(m=>m.kind==='error'&&m.error.includes('Canal no habilitado')));assert.equal(x.room.clients.get(b.id).argentum.voice.enabled,false);
 const s=x.room.engine.state;for(const role of ['DOCTOR','NURSE'])assert.equal(x.app.voiceEligible(s,{...s.players[b.id],role},'MEDICAL'),true);assert.equal(x.app.voiceEligible(s,{...s.players[b.id],role:'CIVIL'},'MEDICAL'),false);
});

test('resume survives server restart with persistent state and command deduplication',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'argentum-'));
 let app=createServer({env:{STATE_DIR:dir,STUN_URLS:''}});let address=await app.listen(0,'127.0.0.1');let a=await client('ws://127.0.0.1:'+address.port+'/ws',{kind:'create',name:'Persistente'});await ok(a,'LOBBY_CREATE',{name:'Partido único'},{commandId:'fixed'});const saved={kind:'resume',room:a.room,actorId:a.id,token:a.token};await app.close();
 app=createServer({env:{STATE_DIR:dir,STUN_URLS:''}});t.after(async()=>{await app.close();fs.rmSync(dir,{recursive:true,force:true})});address=await app.listen(0,'127.0.0.1');a=await client('ws://127.0.0.1:'+address.port+'/ws',saved);t.after(()=>a.ws.terminate());assert.equal(a.state.politics.parties.length,1);await ok(a,'LOBBY_CREATE',{name:'Partido único'},{commandId:'fixed'});assert.equal(app.rooms.get(a.room).engine.state.politics.parties.length,1);
 const bad=await client('ws://127.0.0.1:'+address.port+'/ws',{...saved,token:'bad'});t.after(()=>bad.ws.terminate());assert.equal(bad.id,null);assert.ok(bad.messages.some(m=>m.error==='Sesión inválida'));
});
module.exports={until,client,setup,startFour,place};

test('removed lobby identity cannot resume; TURN secrets remain server-side with expiring credentials',async t=>{const x=await setup(t,2);const[a,b]=x.clients;b.ws.close();await until(()=>x.room.engine.state.players[b.id].connected===false,'disconnect');await ok(a,'LOBBY_REMOVE',{id:b.id});const bad=await client(x.url,{kind:'resume',room:b.room,actorId:b.id,token:b.token});t.after(()=>bad.ws.terminate());assert.equal(bad.id,null);assert.ok(bad.messages.some(m=>m.error==='Sesión inválida'));
 const secret=require('node:crypto').randomBytes(32).toString('hex'),app=createServer({env:{TURN_URLS:'turn:relay.example:3478',TURN_SECRET:secret,VOICE_RELAY_ONLY:'true',STUN_URLS:''}});t.after(()=>app.close());await app.listen(0,'127.0.0.1');const cfg=app.iceConfig('example-actor');assert.equal(cfg.hasTurn,true);assert.equal(cfg.iceTransportPolicy,'relay');assert.ok(Number(cfg.iceServers[0].username.split(':')[0])>Date.now()/1000+3500);assert.ok(!JSON.stringify(cfg).includes(secret));assert.throws(()=>createServer({env:{VOICE_RELAY_ONLY:'true'}}),/TURN/);
});

test('four clients share executive spending, delayed measures and public promises with independent authority',async t=>{
 const x=await setup(t);await startFour(x);const [a,b]=x.clients;
 place(x,a,'plaza',500,340);const mic=globalThis.ArgentumInteriors.get('plaza').objects.find(o=>o.kind==='campaign');place(x,a,'plaza',mic.x+mic.w/2,mic.y+mic.h+25);
 await ok(a,'PROMISE_CREATE',{key:'tax',value:.25});await until(()=>x.clients.every(c=>c.state.governance.promises.length===1),'shared campaign promise');assert.equal((await b.cmd('PROMISE_CREATE',{key:'tax',value:.25})).ok,false);
 x.room.engine.state.politics.campaign[x.room.engine.state.players[a.id].party]=45;
 assert.ok(x.room.engine.dispatch('ADVANCE',{days:9}).ok);await until(()=>x.clients.every(c=>c.state.politics.president.id),'election');const pres=x.clients.find(c=>c.id===x.room.engine.state.politics.president.id),other=x.clients.find(c=>c!==pres);
 place(x,other,'congress',500,160);assert.equal((await other.cmd('GOVERNMENT_MEASURE',{id:'hospital_equipment'})).ok,false);
 place(x,pres,'congress',500,160);const before=x.room.engine.state.accounts.treasury;await ok(pres,'GOVERNMENT_MEASURE',{id:'hospital_equipment'},{commandId:'one-measure'});await ok(pres,'GOVERNMENT_MEASURE',{id:'hospital_equipment'},{commandId:'one-measure'});
 assert.equal(x.room.engine.state.accounts.treasury,before-18000);await until(()=>x.clients.every(c=>c.state.governance.measures.length===1),'shared measure');for(const c of x.clients)assert.equal(c.state.governance.budget.totalCommitted,18000);
 assert.ok(x.room.engine.dispatch('ADVANCE',{days:3}).ok);await until(()=>x.clients.every(c=>c.state.governance.measures[0].status==='ACTIVE'),'shared delayed activation');
});
