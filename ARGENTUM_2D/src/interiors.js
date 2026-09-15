(function(G){
const cache={};
const rect=(id,x,y,w,h,kind='wall',label='')=>({id,x,y,w,h,kind,label,solid:true});
function make(id){const b=ArgentumData.buildings.find(x=>x.id===id);if(!b)return null;const k=b.kind,s={id,width:1000,height:740,spawn:{x:500,y:675},walls:[],doors:[],objects:[],zones:[],actors:[]};
const wall=(x,y,w,h)=>s.walls.push(rect('wall'+s.walls.length,x,y,w,h));
const door=(name,x,y,w=70,h=14,locked=false)=>s.doors.push({...rect(name,x,y,w,h,'door',name),locked,open:false});
const obj=(name,x,y,w,h,type,label,extra={})=>s.objects.push({...rect(name,x,y,w,h,type,label),...extra});
const zone=(label,x,y,w,h)=>s.zones.push({label,x,y,w,h});
wall(0,0,1000,18);wall(0,0,18,740);wall(982,0,18,740);wall(0,722,460,18);wall(540,722,460,18);s.exit={x:460,y:700,w:80,h:40};
if(k==='pitch'){s.walls=[];s.width=1100;s.height=740;s.spawn={x:550,y:670};s.exit={x:510,y:697,w:80,h:43};obj('football',445,642,210,24,'football','Iniciar partido / práctica',{solid:false});return s;}
if(k==='plaza'){s.walls=[];s.spawn={x:500,y:670};zone('PLAZA DE LA REPÚBLICA',40,40,920,620);obj('rally',440,220,120,60,'campaign','Acto público');obj('fountain',175,250,100,100,'fountain','Fuente');obj('bench',655,260,95,25,'seat','Banco');obj('ballot',450,445,80,45,'ballot','Urna electoral');s.actors=[{id:'vecino-plaza',name:'Alma · vecina',x:630,y:480,health:100},{id:'vecino-2',name:'Julián · comerciante',x:335,y:430,health:100}];return s;}
// Entrance hall, door and navigation channels are all geometry, never modal transitions.
wall(18,535,395,14);wall(587,535,395,14);door('Acceso interior',430,535,140);
zone('HALL DE ENTRADA',30,555,940,155);obj('reception',95,601,165,45,'service','Recepción');obj('notice',750,590,110,24,'info','Cartelera');
if(k==='congress'){
zone('RECINTO · CÁMARA DE REPRESENTANTES',30,180,940,340);zone('AUTORIDADES',40,30,920,140);
obj('presidentDesk',402,62,196,52,'executive','Despacho presidencial');obj('lectern',450,188,100,42,'congress','Atril · proyectos y votaciones');obj('screen',300,24,400,18,'screen','Pantalla del recinto');obj('ballot',760,608,65,45,'ballot','Urna electoral');obj('debate',480,598,80,35,'campaign','Micrófono de debate');
for(let row=0;row<3;row++)for(let col=0;col<7;col++){const x=115+col*112,y=282+row*79;obj('desk'+row+'-'+col,x,y,66,28,'desk','Escritorio legislativo');obj('seat'+row+'-'+col,x+17,y+37,30,24,'seat','Banca legislativa')}
s.actors=[{id:'clerk',name:'Secretaria del Congreso',x:350,y:620,health:100}];
}else if(k==='court'){
zone('SALA DE AUDIENCIAS',30,180,940,340);zone('ESTRADO JUDICIAL',50,30,900,140);obj('benchJudge',330,100,340,40,'justice','Estrado · resolver causas');obj('judgeSeat',477,45,46,35,'seat','Sillón del juez');obj('witness',160,200,65,55,'seat','Testigo');obj('accused',740,200,65,55,'seat','Acusado');obj('clerkDesk',425,260,150,40,'justice','Expedientes');
for(let r=0;r<2;r++)for(let c=0;c<5;c++)obj('public'+r+c,140+c*156,374+r*74,100,25,'seat','Público');
}else if(k==='market'){
zone('GÓNDOLAS',50,80,900,400);for(let r=0;r<2;r++)for(let c=0;c<4;c++){const product=ArgentumData.products[(c+r)%5];obj('shelf'+r+c,110+c*205,135+r*210,95,76,'shelf',product.name,{product:product.id})}obj('checkout',445,443,150,42,'market','Caja · pagar carrito');obj('cold',22,40,54,360,'fridge','Heladeras');obj('storage',820,50,120,45,'stock','Depósito');obj('cart',295,608,45,45,'cart','Carrito');
s.actors=[{id:'cashier',name:'Cajera del Plata',x:650,y:480,health:100}];
}else if(k==='hospital'){
zone('INTERNACIÓN',30,30,940,310);wall(18,349,280,14);wall(400,349,200,14);wall(702,349,280,14);door('Sala oeste',307,349,82);door('Sala este',610,349,82);wall(493,18,14,290);
for(let i=0;i<4;i++)obj('bed'+i,100+(i%2)*245,80+Math.floor(i/2)*150,100,62,'bed','Cama hospitalaria');obj('bed4',625,90,100,62,'bed','Cama hospitalaria');obj('meddesk',690,403,185,45,'hospital','Consultorio · tratamiento');zone('CONSULTORIOS',25,367,950,150);
s.actors=[{id:'patient',name:'Paciente en espera',x:330,y:600,health:65}];
}else if(k==='police'){
zone('OPERACIONES POLICIALES',25,30,620,475);zone('DETENIDOS',690,30,275,475);wall(669,18,15,225);wall(669,330,15,200);door('Sector de detenidos',669,250,15,72);obj('pcPolice',120,128,175,65,'police','PC policial · detenidos actuales');obj('pc2',410,128,150,65,'desk','Escritorio de denuncias');obj('equipment',95,380,160,42,'armory','Armario de equipo de prueba');for(let i=0;i<3;i++)obj('holding'+i,742,85+i*128,135,45,'seat','Banco de detenidos');
}else if(k==='jail'){
zone('CELDAS',30,25,940,450);for(let i=0;i<4;i++){const x=30+i*238;wall(x,30,15,390);wall(x,420,58,14);wall(x+140,420,80,14);door('C'+(i+1),x+64,420,70,14,true);obj('bed'+i,x+40,85,140,65,'bed','Cama de celda');obj('toilet'+i,x+155,250,37,38,'toilet','Sanitario')}wall(967,30,15,400);obj('jailPC',90,588,170,40,'jail','Registro penitenciario');zone('PASILLO DE VIGILANCIA',30,445,940,77);
}else if(k==='fire'){
zone('GARAGE Y OPERACIONES',30,40,940,440);obj('truck',90,105,210,330,'vehicle','Autobomba');obj('equipment',450,80,195,48,'fire','Equipamiento y emergencias');obj('extinguishers',770,100,75,60,'armory','Equipo de práctica');obj('office',470,370,190,55,'service','Oficina del cuartel');
}else if(k==='property'){
// Left storefront; right home has living, bedroom, bathroom and kitchen.
wall(460,18,14,220);wall(460,325,14,208);door('Casa y local',460,245,14,72);wall(474,295,180,14);wall(740,295,242,14);door('Dormitorio',665,295,64);wall(780,18,14,218);door('Baño',780,240,14,55);
zone('LOCAL Y DEPÓSITO',30,35,410,480);zone('DORMITORIO',492,30,270,240);zone('BAÑO',806,30,150,240);zone('LIVING · COMEDOR · COCINA',490,335,470,175);
obj('shopdesk',170,410,150,45,'property','Caja · administrar propiedad');obj('stock',90,100,85,130,'stock','Stock del negocio');obj('stock2',275,100,90,130,'stock','Depósito');obj('bed',550,75,150,80,'bed','Descansar en casa');obj('toilet',850,110,50,45,'toilet','Sanitario');obj('sofa',790,379,140,40,'seat','Sofá');obj('table',545,395,90,70,'table','Mesa del comedor');obj('kitchen',725,467,190,42,'kitchen','Cocina');
}
return s;
}
function get(id){return cache[id]||(cache[id]=make(id))}
function doors(s,id){s.world.doors||={};s.world.doors[id]||={};return s.world.doors[id]}
function solid(s,id){const room=get(id);if(!room)return[];const ds=doors(s,id);return [...room.walls,...room.objects.filter(o=>o.solid),...room.doors.filter(d=>{if(id==='jail'&&/^C[1-4]$/.test(d.id)){const cell=s.justice.cells.find(c=>c.cellId===d.id);return cell?.locked||!(ds[d.id]??d.open)}return !(ds[d.id]??d.open)})]}
function blocked(s,id,x,y,r=10){const room=get(id);if(!room||x<r||y<r||x>room.width-r||y>room.height-r)return true;return solid(s,id).some(o=>x>o.x-r&&x<o.x+o.w+r&&y>o.y-r&&y<o.y+o.h+r)}
function near(p,o,range=75){return Math.hypot(p.x-(o.x+o.w/2),p.y-(o.y+o.h/2))<range+Math.max(o.w,o.h)*.3}
function nearest(s){const p=s.player;if(!p.inside)return null;const room=get(p.inside),list=[{...room.exit,id:'exit',kind:'exit',label:'Salir a la ciudad'},...room.doors,...room.objects.filter(o=>!['wall','table','toilet','fridge','vehicle','screen','desk'].includes(o.kind))];return list.filter(o=>near(p,o)).sort((a,b)=>Math.hypot(p.x-a.x-a.w/2,p.y-a.y-a.h/2)-Math.hypot(p.x-b.x-b.w/2,p.y-b.y-b.h/2))[0]||null}
G.ArgentumInteriors={get,solid,blocked,near,nearest};if(typeof module!=='undefined')module.exports=G.ArgentumInteriors;
})(globalThis);
