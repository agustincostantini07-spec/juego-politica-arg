from pathlib import Path
root=Path(__file__).resolve().parent
html=(root/'src/shell.html').read_text()
css=(root/'src/style.css').read_text()
scripts='\n'.join((root/'src'/p).read_text() for p in ['data.js','interiors.js','lobby.js','physical.js','governance.js','engine.js','world.js','network.js','voice.js','ui.js'])
html=html.replace('<!--STYLE-->','<style>\n'+css+'\n</style>').replace('<!--SCRIPTS-->','<script>\n'+scripts+'\n</script>')
(root/'ARGENTUM_2D.html').write_text(html)
print('Built',root/'ARGENTUM_2D.html',len(html),'characters')
