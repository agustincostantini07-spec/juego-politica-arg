(function(G){
const products=[{id:'water',name:'Agua mineral',symbol:'◈',base:120,hydration:32},{id:'food',name:'Vianda casera',symbol:'◒',base:380,hunger:35},{id:'medicine',name:'Botiquín',symbol:'✚',base:850,health:25},{id:'mate',name:'Mate y bizcochos',symbol:'♨',base:210,energy:15,hunger:8},{id:'extinguisher',name:'Extintor',symbol:'▥',base:2400}];
const parties=[
{id:'civic',name:'Acuerdo Cívico',short:'AC',color:'#6dc6d6',leader:'Emilia Lagos',ideology:[.48,.55,.5,.8,.9,.55],platform:'Equilibrio fiscal, acuerdos e instituciones.',tax:.21,health:1.1,security:1,penalty:5},
{id:'social',name:'Horizonte Social',short:'HS',color:'#e79c8e',leader:'Damián Ferreyra',ideology:[.25,.85,.4,.75,.75,.9],platform:'Servicios públicos y protección social.',tax:.27,health:1.4,security:.9,penalty:3},
{id:'free',name:'Ciudad Abierta',short:'CA',color:'#deb96e',leader:'Lucía Costa',ideology:[.85,.25,.5,.9,.8,.4],platform:'Inversión, autonomía y menos impuestos.',tax:.13,health:.9,security:1,penalty:4},
{id:'order',name:'Unión Vecinal',short:'UV',color:'#b5a0dc',leader:'Bruno Acuña',ideology:[.55,.5,.9,.4,.7,.55],platform:'Seguridad, barrios e infraestructura.',tax:.20,health:1,security:1.4,penalty:8}];
const sectors=[
{name:'Trabajadores',weight:.25,priorities:[.35,.25,.15,.25],ideology:[.4,.6,.5,.7,.7,.7]},
{name:'Comerciantes',weight:.12,priorities:[.5,.1,.25,.15],ideology:[.7,.35,.65,.7,.8,.4]},
{name:'Jóvenes',weight:.18,priorities:[.35,.3,.1,.25],ideology:[.5,.5,.4,.9,.8,.6]},
{name:'Jubilados',weight:.13,priorities:[.2,.45,.2,.15],ideology:[.4,.65,.6,.6,.8,.75]},
{name:'Sector público',weight:.1,priorities:[.2,.5,.1,.2],ideology:[.3,.8,.5,.7,.85,.75]},
{name:'Clase media',weight:.15,priorities:[.4,.2,.2,.2],ideology:[.6,.45,.6,.8,.9,.5]},
{name:'Hogares vulnerables',weight:.07,priorities:[.35,.4,.15,.1],ideology:[.35,.75,.55,.65,.7,.9]}];
const buildings=[
{id:'congress',name:'Congreso de la República',short:'CONGRESO',kind:'congress',x:620,y:80,w:300,h:160,color:'#c5b994'},
{id:'hospital',name:'Hospital San Martín',short:'HOSPITAL',kind:'hospital',x:1000,y:100,w:190,h:140,color:'#a4c3b5'},
{id:'police',name:'Comisaría Central',short:'COMISARÍA',kind:'police',x:1260,y:100,w:200,h:140,color:'#9aabc7'},
{id:'court',name:'Palacio de Justicia',short:'TRIBUNAL',kind:'court',x:620,y:365,w:230,h:140,color:'#c8b89d'},
{id:'jail',name:'Unidad Penitenciaria',short:'CÁRCEL',kind:'jail',x:1240,y:365,w:220,h:140,color:'#9da5b1'},
{id:'fire',name:'Cuartel de Bomberos',short:'BOMBEROS',kind:'fire',x:1000,y:365,w:165,h:140,color:'#ca8e78'},
{id:'market',name:'Mercado del Plata',short:'MERCADO',kind:'market',x:620,y:870,w:240,h:140,color:'#d7ba74'},
{id:'pitch',name:'El Potrero · Fútbol 5',short:'EL POTRERO · F5',kind:'pitch',x:1020,y:870,w:400,h:175,color:'#53957a'},
{id:'plaza',name:'Plaza de la República',short:'PLAZA DE LA REPÚBLICA',kind:'plaza',x:630,y:610,w:790,h:170,color:'#709a73'}];
for(const [prefix,y0] of [['N',60],['S',655]])for(let i=0;i<10;i++)buildings.push({id:prefix+String(i+1).padStart(2,'0'),name:(prefix==='N'?'Norte ':'Sur ')+String(i+1).padStart(2,'0'),short:prefix+String(i+1).padStart(2,'0'),kind:'property',x:60+(i%2)*265,y:y0+Math.floor(i/2)*92,w:170,h:65,color:['#c9ad95','#b8beb0','#d0b589','#bc9e90','#99b7b8'][Math.floor(i/2)]});
const laws={tax:{name:'Impuesto al consumo',min:5,max:35,step:1,unit:'%',factor:100,category:'Economía',description:'Cambia el precio final, la demanda y la recaudación.'},health:{name:'Presupuesto sanitario',min:60,max:160,step:10,unit:'%',factor:100,category:'Servicios',description:'Cambia el gasto diario y la capacidad del hospital.'},security:{name:'Presupuesto de seguridad',min:60,max:160,step:10,unit:'%',factor:100,category:'Seguridad',description:'Cambia el gasto, la prevención y la respuesta policial.'},penalty:{name:'Pena máxima',min:2,max:10,step:1,unit:' días',factor:1,category:'Justicia',description:'Límite para nuevas condenas; no modifica las existentes.'}};
laws.weapons={name:'Regulación de armas',min:0,max:2,step:1,unit:' · nivel',factor:1,category:'Seguridad',description:'0/1: agresiones siguen siendo delito. 2: uso civil de armas inicia una causa incluso sin impacto.'};for(const p of parties)p.weapons=p.id==='order'?2:1;
const jobs={employee:{name:'Empleado comercial',role:'CIVIL',pay:1700,at:'market'},doctor:{name:'Médico',role:'DOCTOR',pay:2400,at:'hospital'},nurse:{name:'Enfermero',role:'NURSE',pay:1900,at:'hospital'},police:{name:'Policía',role:'POLICE',pay:2100,at:'police'},fire:{name:'Bombero',role:'FIREFIGHTER',pay:2100,at:'fire'},judge:{name:'Juez',role:'JUDGE',pay:2600,at:'court'}};
const roles={CIVIL:'Ciudadano',PRESIDENT:'Presidente',LEGISLATOR:'Legislador',POLICE:'Policía',FIREFIGHTER:'Bombero',DOCTOR:'Médico',NURSE:'Enfermero',JUDGE:'Juez',PRISONER:'Preso',BUSINESS_OWNER:'Comerciante'};
G.ArgentumData={products,parties,sectors,buildings,laws,jobs,roles};if(typeof module!=='undefined')module.exports=G.ArgentumData;
})(globalThis);
