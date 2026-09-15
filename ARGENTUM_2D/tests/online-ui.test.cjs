const {test}=require('node:test'),assert=require('node:assert/strict'),{runtime}=require('./source-runtime.cjs'),{createServer}=require('../server/index.cjs');
const delay=ms=>new Promise(r=>setTimeout(r,ms));async function until(f,label){for(let i=0;i<250;i++){if(f())return;await delay(15)}throw Error('Timeout '+label)}
test('two online UI source runtimes create/join, self-assign, start, render peers and send movement (not browser)',async t=>{
 const server=createServer({env:{DAY_SECONDS:'3600',STUN_URLS:''}}),addr=await server.listen(0,'127.0.0.1'),url='http://127.0.0.1:'+addr.port;
 const a=runtime(1200,780,{online:true,url}),b=runtime(1200,780,{online:true,url});t.after(async()=>{a.cleanup();b.cleanup();await server.close()});
 a.elements.netName.value='Ana UI';a.elements.netTest.checked=true;a.click('netcreate');await until(()=>a.app.engine.connected,'A joined');
 b.elements.netName.value='Bruno UI';b.elements.netRoom.value=a.app.engine.identity.room;b.click('netjoin');await until(()=>b.app.engine.connected&&Object.keys(a.app.engine.state.players).length===2,'B joined');
 assert.equal(a.elements.actorSelect.disabled,true);assert.ok(a.elements.dialogBody.innerHTML.includes('Bruno UI'));
 a.elements.newParty.value='Partido UI';a.click('createlobby');await until(()=>b.app.engine.state.politics.parties.length===1,'party');
 const party=a.app.engine.state.politics.parties[0].id; a.click('command',{type:'LOBBY_ASSIGN',args:{party,slot:'president',player:a.app.engine.identity.actorId}});await until(()=>a.app.engine.state.player.party,'A candidate');
 b.click('command',{type:'LOBBY_ASSIGN',args:{party,slot:'judge',player:b.app.engine.identity.actorId}});await until(()=>b.app.engine.state.player.party,'B candidate');
 a.click('command',{type:'LOBBY_READY',args:{party}});await delay(30);assert.equal(a.app.engine.state.politics.parties[0].ready,false);b.click('command',{type:'LOBBY_READY',args:{party}});await until(()=>a.app.engine.state.politics.parties[0].ready,'two consent');
 a.click('command',{type:'LOBBY_BOTS'});await until(()=>a.app.engine.state.politics.parties.length===2,'test bots');a.click('start');await until(()=>a.app.panel===null&&b.app.panel===null,'both entered world');
 const id=a.app.engine.identity.actorId,x=b.app.engine.state.players[id].x;
 a.handlers.keydown({key:'a',target:{tagName:'BODY'},preventDefault(){}});for(let i=0;i<12;i++){a.frame(100+i*30);b.frame(100+i*30);await delay(30)}a.handlers.keyup({key:'a',target:{tagName:'BODY'}});a.frame(600);await until(()=>b.app.engine.state.players[id].x<x-20,'B observes A');
 for(const page of ['government','congress','economy','society','politics','laws','inventory','player','save','help']){a.app.open(page);a.frame(700);assert.ok(a.elements.dialogBody.innerHTML.length>20)}
 a.app.open('government');a.click('tab',{tab:'promises'});assert.ok(a.elements.dialogBody.innerHTML.includes('Registrar compromiso público'));
 const room=server.rooms.get(a.app.engine.identity.room),mic=globalThis.ArgentumInteriors.get('plaza').objects.find(o=>o.kind==='campaign');Object.assign(room.engine.state.players[id],{inside:'plaza',x:mic.x+mic.w/2,y:mic.y+mic.h+25});a.elements.promiseKey.value='tax';a.elements.promiseValue.value='22';a.click('promisecreate');await until(()=>b.app.engine.state.governance.promises.length===1,'UI promise shared');assert.equal(b.app.engine.state.governance.promises[0].value,.22);
 a.click('tab',{tab:'budget'});assert.ok(a.elements.dialogBody.innerHTML.includes('Tesoro disponible'));
 assert.deepEqual(a.logs,[]);assert.deepEqual(b.logs,[]);
 await a.ctx.ARGENTUM_VOICE.start();assert.match(a.ctx.ARGENTUM_VOICE.status,/HTTPS|WebRTC/);assert.equal(a.app.engine.connected,true,'voice unavailable does not break game');
});
