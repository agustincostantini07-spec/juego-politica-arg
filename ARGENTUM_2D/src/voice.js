(function(G){'use strict';
const channels={PROXIMITY:'Proximidad / lobby',PARTY:'Partido',CONGRESS:'Congreso · turnos',POLICE:'Radio policial',FIRE_SERVICE:'Radio bomberos',MEDICAL:'Radio médica'};
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
class Voice {
 constructor(net){this.net=net;this.stream=null;this.peers=new Map();this.allowed=new Map();this.channel='PROXIMITY';this.enabled=false;this.mic=false;this.ptt=true;this.key='v';this.pressed=false;this.volume=.8;this.muted=new Set();this.speaking=false;this.status='Voz desactivada';this.turn=null;this.config={iceServers:[],range:10,units:24};this.captureEpoch=0;this.starting=false;this.signalChains=new Map();this.retryAt=new Map();this.outboundSpeaking=false;
  net.on('joined',m=>{this.config=m.voice;this.stop();this.mount();});
  net.on('voiceConfig',m=>{this.config=m.voice;for(const p of this.peers.values())p.pc.setConfiguration({iceServers:m.voice.iceServers,iceTransportPolicy:m.voice.iceTransportPolicy});});
  net.on('voicePeers',m=>{this.turn=m.turn;this.reconcile(m.peers);});
  net.on('signal',m=>{const old=this.signalChains.get(m.from)||Promise.resolve();const next=old.then(()=>this.signal(m)).catch(()=>{this.status='No se pudo negociar voz. Reconectá la voz.';this.refresh();});this.signalChains.set(m.from,next);next.finally(()=>{if(this.signalChains.get(m.from)===next)this.signalChains.delete(m.from)});});
  net.on('disconnect',()=>this.stop());
  document.addEventListener('keydown',e=>{if(e.key.toLowerCase()===this.key&&!e.repeat&&!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)){this.pressed=true;this.applyMic();}});
  document.addEventListener('keyup',e=>{if(e.key.toLowerCase()===this.key){this.pressed=false;this.applyMic();}});
  G.addEventListener('blur',()=>{this.pressed=false;this.applyMic();});
  this.interval=setInterval(()=>this.update(),100);
  this.refreshIce=setInterval(()=>{if(this.enabled)this.net.send({kind:'voiceConfig'})},1800000);
 }
 mount(){if(this.mounted)return;this.mounted=true;const box=document.createElement('section');box.id='voiceDock';box.innerHTML=`<details><summary>🎙 Voz <span id="voiceSummary">desactivada</span></summary><div class="voice-content"><div id="voiceStatus" role="status"></div><div class="row wrap"><button id="voiceConnect">Activar voz</button><button id="voiceMic" disabled>Mic OFF</button></div><label>Canal<select id="voiceChannel">${Object.entries(channels).map(([id,t])=>`<option value="${id}">${t}</option>`).join('')}</select></label><label><input id="voicePTT" type="checkbox" checked> Mantener tecla para hablar</label><label>Tecla PTT <input id="voiceKey" maxlength="1" value="v"></label><label>Volumen recibido <input id="voiceVolume" type="range" min="0" max="100" value="80"></label><div id="voicePeers"></div><small>La voz usa conexión entre participantes. TURN mejora la conexión en redes restrictivas.</small></div></details>`;document.body.appendChild(box);
  const $=id=>document.getElementById(id);$('voiceConnect').onclick=()=>this.enabled?this.stop():this.start();$('voiceMic').onclick=()=>{this.mic=!this.mic;this.applyMic();this.refresh()};$('voiceChannel').onchange=e=>this.changeChannel(e.target.value);$('voicePTT').onchange=e=>{this.ptt=e.target.checked;this.applyMic()};$('voiceKey').onchange=e=>{const key=e.target.value.toLowerCase();if(/^[vbtuyz]$/.test(key)){this.key=key;this.pressed=false;this.applyMic()}else{e.target.value=this.key;this.status='Teclas PTT disponibles: V, B, T, U, Y, Z.';this.refresh()}};$('voiceVolume').oninput=e=>this.volume=Number(e.target.value)/100;
  $('voicePeers').onclick=e=>{const id=e.target.dataset.mute;if(id){this.muted.has(id)?this.muted.delete(id):this.muted.add(id);this.refresh()}};this.refresh();
 }
 async start(){
  if(this.starting||this.enabled)return;
  if(!this.net.connected){this.status='Conectate a una sala primero.';this.refresh();return}
  const epoch=++this.captureEpoch;this.starting=true;
  try{
   if(!navigator.mediaDevices?.getUserMedia||!G.RTCPeerConnection)throw Error('El navegador requiere HTTPS o localhost y soporte WebRTC.');
   const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
   if(!this.net.connected||epoch!==this.captureEpoch){stream.getTracks().forEach(t=>t.stop());return}
   this.stream=stream;this.ctx=new(G.AudioContext||G.webkitAudioContext)();await this.ctx.resume();if(epoch!==this.captureEpoch){stream.getTracks().forEach(t=>t.stop());return;}
   this.meter=this.ctx.createAnalyser();this.meter.fftSize=256;this.ctx.createMediaStreamSource(stream).connect(this.meter);this.samples=new Uint8Array(this.meter.fftSize);
   this.enabled=true;this.mic=true;this.status='Voz conectándose · '+(this.config.hasTurn?'relay disponible':'sin TURN configurado');this.applyMic();this.announce();this.refresh();
   for(const track of stream.getAudioTracks())track.onended=()=>this.stop();
  }catch(e){if(epoch!==this.captureEpoch)return;this.stop();this.status=e.name==='NotAllowedError'?'Permiso de micrófono denegado. Podés seguir jugando.':e.message||'No se pudo activar el micrófono.';this.refresh();}finally{if(epoch===this.captureEpoch)this.starting=false;}
 }
 announce(){this.net.send({kind:'voiceState',enabled:this.enabled,channel:this.channel,speaking:this.outboundSpeaking});}
 applyMic(){const transmitting=this.enabled&&this.mic&&(!this.ptt||this.pressed);this.outboundSpeaking=transmitting&&(this.ptt||this.speaking||this.channel==='CONGRESS');
  // Congreso requests a server-granted floor before opening the audio track.
  const allowed=transmitting&&(this.channel!=='CONGRESS'||this.turn===this.net.identity?.actorId);
  this.stream?.getAudioTracks().forEach(t=>t.enabled=allowed);this.announce();
 }
 changeChannel(channel){this.channel=channel;this.pressed=false;this.outboundSpeaking=false;this.allowed.clear();for(const id of [...this.peers.keys()])this.drop(id);this.applyMic();this.refresh();}
 async makePeer(id,epoch){
  let peer=this.peers.get(id);if(peer?.epoch===epoch)return peer;
  if(peer)this.drop(id);
  if(!this.enabled||!this.allowed.has(id))return null;
  const pc=new RTCPeerConnection({iceServers:this.config.iceServers,iceTransportPolicy:this.config.iceTransportPolicy||'all'});
  peer={pc,epoch,pending:[],gain:null,audio:null,remote:null,failedAt:null};this.peers.set(id,peer);
  for(const track of this.stream.getAudioTracks())pc.addTrack(track,this.stream);
  pc.onicecandidate=e=>{if(e.candidate)this.net.send({kind:'signal',to:id,epoch,signal:{candidate:e.candidate.toJSON()}})};
  pc.ontrack=e=>{
    const stream=e.streams[0]||new MediaStream([e.track]);
    // Media element starts the remote stream on browsers that require playback to pull audio.
    const audio=new Audio();audio.srcObject=stream;audio.autoplay=true;audio.muted=true;audio.play().catch(()=>{});peer.audio=audio;
    peer.remote=this.ctx.createMediaStreamSource(stream);peer.gain=this.ctx.createGain();peer.gain.gain.value=0;peer.remote.connect(peer.gain);
    if(this.ctx.createStereoPanner){peer.pan=this.ctx.createStereoPanner();peer.gain.connect(peer.pan);peer.pan.connect(this.ctx.destination);}else peer.gain.connect(this.ctx.destination);
    peer.meter=this.ctx.createAnalyser();peer.meter.fftSize=256;peer.gain.connect(peer.meter);peer.samples=new Uint8Array(256);
  };
  pc.onconnectionstatechange=()=>{if(['failed','disconnected'].includes(pc.connectionState))peer.failedAt=Date.now();else peer.failedAt=null;this.refresh()};
  return peer;
 }
 reconcile(list){this.allowed=new Map(list.map(x=>[x.id,x]));
  for(const [id,p]of this.peers)if(!this.allowed.has(id)||this.allowed.get(id).epoch!==p.epoch)this.drop(id);
  if(this.enabled)for(const v of list){if(!this.peers.has(v.id)&&Date.now()>=(this.retryAt.get(v.id)||0)&&this.net.identity.actorId.localeCompare(v.id)<0)this.offer(v).catch(()=>{this.drop(v.id);this.retryAt.set(v.id,Date.now()+5000);});}
  const canTalk=this.enabled&&this.mic&&(!this.ptt||this.pressed)&&(this.channel!=='CONGRESS'||this.turn===this.net.identity?.actorId);this.stream?.getAudioTracks().forEach(t=>t.enabled=canTalk);this.refresh();
 }
 async offer(v){const peer=await this.makePeer(v.id,v.epoch);if(!peer)return;await peer.pc.setLocalDescription(await peer.pc.createOffer());this.net.send({kind:'signal',to:v.id,epoch:v.epoch,signal:{description:peer.pc.localDescription.toJSON()}});}
 async signal(m){const v=this.allowed.get(m.from);if(!this.enabled||!v||v.epoch!==m.epoch)return;const peer=await this.makePeer(m.from,m.epoch);if(!peer)return;const pc=peer.pc;
  if(m.signal.description){const d=m.signal.description;if(!['offer','answer'].includes(d.type))return;await pc.setRemoteDescription(d);for(const candidate of peer.pending)await pc.addIceCandidate(candidate);peer.pending=[];
   if(d.type==='offer'){await pc.setLocalDescription(await pc.createAnswer());this.net.send({kind:'signal',to:m.from,epoch:m.epoch,signal:{description:pc.localDescription.toJSON()}});}
  }else if(m.signal.candidate){if(pc.remoteDescription)await pc.addIceCandidate(m.signal.candidate);else if(peer.pending.length<100)peer.pending.push(m.signal.candidate);}
 }
 level(meter,samples){meter.getByteTimeDomainData(samples);return Math.sqrt(samples.reduce((a,v)=>a+((v-128)/128)**2,0)/samples.length)>.018;}
 update(){if(!this.enabled)return;
  const speaking=this.meter&&this.level(this.meter,this.samples)&&this.mic&&(!this.ptt||this.pressed);if(speaking!==this.speaking){this.speaking=speaking;this.applyMic();}
  const s=this.net.state,me=s.player,range=this.config.range*this.config.units;
  for(const [id,p]of this.peers){const q=s.players[id];let gain=this.volume,pan=0;
    if(!q||!this.allowed.has(id)||this.muted.has(id))gain=0;
    else if(this.channel==='CONGRESS'&&this.turn!==id)gain=0;
    else if(this.channel==='PROXIMITY'&&s.session.phase!=='LOBBY'){const dx=q.x-me.x;gain*=q.inside===me.inside?Math.max(0,1-Math.hypot(dx,q.y-me.y)/range):0;pan=Math.max(-.8,Math.min(.8,dx/range));}
    p.gain?.gain.setTargetAtTime(gain,this.ctx.currentTime,.06);p.pan?.pan.setTargetAtTime(pan,this.ctx.currentTime,.06);p.speaking=!!(p.meter&&gain>0&&this.level(p.meter,p.samples));
    if(p.failedAt&&Date.now()-p.failedAt>5000){this.drop(id);this.retryAt.set(id,Date.now()+5000);this.status='Conexión de voz interrumpida. Reintentando; revisá TURN si persiste.';}
  }
  this.refresh();
 }
 drop(id){const p=this.peers.get(id);if(!p)return;p.pc.onconnectionstatechange=null;p.pc.close();p.remote?.disconnect();p.gain?.disconnect();p.pan?.disconnect();if(p.audio){p.audio.pause();p.audio.srcObject=null}this.peers.delete(id);}
 stop(){this.captureEpoch++;this.starting=false;this.enabled=false;this.mic=false;this.pressed=false;this.outboundSpeaking=false;this.speaking=false;for(const id of [...this.peers.keys()])this.drop(id);this.stream?.getTracks().forEach(t=>{t.onended=null;t.stop()});this.stream=null;this.ctx?.close().catch(()=>{});this.ctx=null;this.status='Voz desactivada';this.announce();this.refresh();}
 refresh(){const $=id=>document.getElementById(id);if(!$('voiceStatus'))return;$('voiceStatus').textContent=this.enabled&&this.channel==='CONGRESS'?'Turno: '+(this.turn===this.net.identity?.actorId?'podés hablar':this.net.state.players[this.turn]?.name||'libre · pulsá PTT'):this.status;$('voiceSummary').textContent=this.enabled?(this.speaking?'● hablando':'· '+channels[this.channel]):'desactivada';$('voiceMic').disabled=!this.enabled;$('voiceMic').textContent=this.mic?'Mic ON':'Mic OFF';$('voiceConnect').textContent=this.enabled?'Desconectar voz':'Activar voz';
  const html=[...this.allowed.values()].map(v=>{const p=this.peers.get(v.id);return `<div class="row between"><span>${p?.speaking?'● ':''}${escape(v.name)} <small>${p?.pc.connectionState==='connected'?'audio conectado':'negociando…'}</small></span><button data-mute="${escape(v.id)}">${this.muted.has(v.id)?'Escuchar':'Silenciar'}</button></div>`}).join('')||'<small>Sin otros participantes habilitados en este canal.</small>';if($('voicePeers').innerHTML!==html)$('voicePeers').innerHTML=html;
 }
}
G.ArgentumVoice=Voice;
})(globalThis);
