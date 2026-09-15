const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,'src',f),'utf8');
const scripts=['data','interiors','lobby','physical','governance','engine','world','network','voice','ui'].map(f=>read(f+'.js')).join('\n');
const html=read('shell.html').replace('<!--STYLE-->','<style>\n'+read('style.css')+'\n</style>').replace('<!--SCRIPTS-->','<script>\n'+scripts+'\n</script>');
fs.writeFileSync(path.join(root,'ARGENTUM_2D.html'),html);console.log('Cliente online construido:',Buffer.byteLength(html),'bytes');
