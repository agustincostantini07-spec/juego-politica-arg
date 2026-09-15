(function(G){'use strict';
class Network {
 constructor(){this.online=true;this.state=Argentum.newGame('Sin conexión');this.state.session.mode='ONLINE';this.connected=false;this.pending=new Map();this.nextId=0;this.positions={};this.handlers={};this.status='Sin conexión';this.identity=null;this.intent=null;this.lastInput=0;this.ws=null;this.retries=0;this.latency=null;}
 emit(type,data){for(const f of this.handlers[type]||[])f(data)}
 on(type,f){(this.handlers[type]||=[]).push(f)}
 credentials(){try{return JSON.parse(sessionStorage.getItem('argentum-online-session'))}catch{return null}}
 connect(kind,options={}){
  if(this.ws){this.ws.onclose=null;this.ws.close()}
  this.cancelPending('Conexión reemplazada');this.status='Conectando…';this.emit('status',this.status);
  let url=options.endpoint||this.identity?.endpoint||((location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/ws');
  try{const u=new URL(url);if(!['ws:','wss:'].includes(u.protocol))throw Error();if(location.protocol==='https:'&&u.protocol!=='wss:')throw Error();url=u.href;}catch{this.status='Usá un endpoint ws:// o wss:// válido';this.emit('error',this.status);return;}
  const ws=this.ws=new WebSocket(url);let joined=false;
  ws.onopen=()=>this.send({kind,...options,endpoint:undefined});
  ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}
    if(m.kind==='joined'){joined=true;this.connected=true;this.retries=0;this.identity={room:m.room,actorId:m.actorId,token:m.token,endpoint:url};try{sessionStorage.setItem('argentum-online-session',JSON.stringify(this.identity))}catch{}this.status='Conectado · sala '+m.room;this.accept(m.state);this.emit('joined',m);this.emit('status',this.status);}
    else if(m.kind==='state')this.accept(m.state);
    else if(m.kind==='ack'){const task=this.pending.get(m.commandId);if(task){clearTimeout(task.timer);this.pending.delete(m.commandId);task.resolve(m);}}
    else if(m.kind==='error'){this.emit('error',m.error);if(!joined&&kind==='resume'){this.identity=null;try{sessionStorage.removeItem('argentum-online-session')}catch{}}}
    else if(m.kind==='pong')this.latency=Date.now()-m.at;
    else this.emit(m.kind,m);
  };
  ws.onerror=()=>this.emit('error','No se pudo conectar al servidor. Revisá la dirección y que esté encendido.');
  ws.onclose=e=>{this.connected=false;this.cancelPending('Conexión interrumpida; comprobá el resultado antes de repetir.');this.status='Desconectado';this.emit('status',this.status);this.emit('disconnect',{});if(this.identity&&e.code!==4001&&this.retries<8){const wait=Math.min(10000,750*2**this.retries++);this.status='Reconectando…';this.emit('status',this.status);setTimeout(()=>this.connect('resume',this.identity),wait)}else if(e.code===4001){this.identity=null;this.emit('error','Tu ciudadano se abrió en otra conexión.');}};
 }
 send(m){if(this.ws?.readyState===WebSocket.OPEN){this.ws.send(JSON.stringify(m));return true}return false}
 accept(s){
  const now=performance.now();for(const [id,p]of Object.entries(s.players)){const old=this.state.players[id];const current=this.visual(id,now);this.positions[id]={from:old&&old.inside===p.inside?current:{x:p.x,y:p.y},to:{x:p.x,y:p.y},at:now};}
  const previous=this.state;s.player=s.players[s.session.activeId];s.settings.sound=previous.settings.sound;this.state=s;this.emit('state',{state:s,previous});
 }
 visual(id,now=performance.now()){const v=this.positions[id];if(!v){const p=this.state.players[id];return {x:p?.x||0,y:p?.y||0}}const t=Math.max(0,Math.min(1,(now-v.at)/100));return{x:v.from.x+(v.to.x-v.from.x)*t,y:v.from.y+(v.to.y-v.from.y)*t};}
 request(type,args={}){
  if(!this.connected)return Promise.resolve({ok:false,error:'No estás conectado.'});
  const commandId=(G.crypto?.randomUUID?.()||Date.now()+'-'+Math.random())+'-'+(++this.nextId);
  return new Promise(resolve=>{const timer=setTimeout(()=>{this.pending.delete(commandId);resolve({ok:false,error:'Sin confirmación. Comprobá el estado antes de repetir.'})},6000);this.pending.set(commandId,{resolve,timer});this.send({kind:'command',commandId,type,args});});
 }
 cancelPending(error){for(const p of this.pending.values()){clearTimeout(p.timer);p.resolve({ok:false,error})}this.pending.clear()}
 dispatch(type,args={}){
  if(type==='MOVE'){const p=this.state.player,dx=args.x-p.x,dy=args.y-p.y,n=Math.hypot(dx,dy);this.intent=n?{x:dx/n,y:dy/n,run:!!args.run}:{x:0,y:0};return{ok:this.connected};}
  if(type==='PHYSICS')return{ok:true};
  return{ok:false,error:'Usá una solicitud al servidor.'};
 }
 flushInput(t){if(t-this.lastInput<50)return;this.lastInput=t;this.send({kind:'input',...(this.intent||{x:0,y:0,run:false})});}
 switchActor(){return{ok:false,error:'Cada conexión controla su propio ciudadano.'}}
 load(){return{ok:false,error:'La partida pertenece al servidor.'}}
 save(){throw Error('La partida se conserva en el servidor; usá Reconectar.')}
 leave(){this.identity=null;this.connected=false;if(this.ws){this.ws.onclose=null;this.ws.close()}this.cancelPending('Saliste de la sala');this.emit('disconnect',{});this.status='Sin conexión';this.emit('status',this.status)}
}
G.ArgentumNetwork=Network;
})(globalThis);
