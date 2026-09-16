# CONTINUAR ARGENTUM 2D — 3.1.0

Última modificación: 16/09/2026. Leer este archivo antes de tocar el proyecto. Instrucción vigente: REANUDACION_V5.txt (adjunto 10), junto con AGENTS.md y los requisitos conservados. No reiniciar. La base previa v3.0/checkpoint 371fc6c está conservada en el historial; esta entrega añade gobierno y compromisos. El detalle técnico anterior está en docs/CONTINUAR_V3_0_ARCHIVO.md y es histórico cuando contradice este estado.

## ONLINE PÚBLICO — hito verificado

Juego: https://argentum-2d-production.up.railway.app/
Repositorio: https://github.com/agustincostantini07-spec/juego-politica-arg/tree/main/ARGENTUM_2D
Commit de código publicado: de2c00deba98694e296d067bd885f83922f3af74 (importación de v3.1, 53 archivos). La aplicación Next.js previa se conservó. GitHub contiene el código y es el respaldo principal desde esta publicación; el ZIP anterior conserva el historial local.

Railway proyecto b3dce46a-42f3-4263-b1de-bd327c85554d; entorno production 04825b95-7b5d-42fa-b82c-1098c935a7b6; servicio 139d0f9d-253f-42cc-80b8-62979ad8688f.
Deployment vigente SUCCESS: 9c4fdcc4-b6a4-422a-8993-2ee45338aa1d. El primer intento 280ebc9d-b5a9-475b-bf9b-8d2e2765d2ff construyó la raíz Next.js y falló; se corrigió la raíz y el siguiente arrancó.
RootDirectory=/ARGENTUM_2D, Dockerfile, una réplica sfo, puerto 3000, /healthz, STATE_DIR=/data/rooms, sin suspensión. Dominio HTTPS y WSS reales.

Volumen solicitado y creado según proveedor: 9a4943ed-3412-4dcd-a6d1-dacc340ee19b, 512 MB, montaje /data. ATENCIÓN: las consultas de estado siguen devolviendo volumes:[]; /data/rooms existe y contiene archivos, pero eso no demuestra montaje persistente. No afirmar que sobrevivió un reinicio.
El reinicio de prueba del 16/09 fue RECHAZADO por la revisión automática: podría interrumpir usuarios de producción y requiere autorización específica del usuario. NO se ejecutó ni se intentó por otra vía. No publicar cambios de runtime para provocar indirectamente ese reinicio. Cambios documentales/tests excluidos de watchPatterns; conservar servicio activo.
No se cambió el plan de la cuenta. El proveedor informó plan HOBBY existente y uso incluido de USD 5; uso/egreso adicional facturado aparte. No prometer hosting gratuito.

## PRIMERA ACCIÓN EXACTA

Obtener autorización específica para reiniciar una vez el servidor de producción y comprobar recuperación de la sala de prueba B50B959510. Explicar interrupción breve y rechazo automático anterior. Una vez autorizado: verificar si esa sala y sus dos identidades de navegador siguen disponibles, registrar estado antes, ejecutar redeploy sobre el servicio existente, esperar SUCCESS y comprobar que ambas identidades, partido y fase reaparecen. Si el volumen resulta efímero, resolver montaje con Railway antes de declarar persistencia.

GitHub y Railway YA están conectados; repositorio confirmado. No pedir conectarlos ni crear servicios duplicados. Tras la persistencia: configurar TURN real y probar dos micrófonos desde redes distintas; después ampliar política. No afirmar voz aprobada por pasar señalización.

Ejecución local: Node 24, npm ci, npm run build, npm start, http://localhost:3000. Windows: INICIAR_ARGENTUM.cmd. npm test: 43 pruebas. El navegador sí permite ahora probar el dominio público; sigue prohibido rodear el bloqueo previo de rutas locales.

## Versión y checkpoint

- VERSIÓN JUGABLE: SÍ, build 3.1.0 local y pública. Dos pestañas reales de navegador conectadas al servidor público; no dos hogares ni aceptación acústica.
- BUILD/ZIP: ARGENTUM_2D_v3_online.zip contiene fuentes, HTML construido, servidor, lockfile, instrucciones, pruebas e HISTORIAL.bundle. La versión exacta del commit figura en COMMIT_ENTREGA.txt dentro del ZIP. No incluye dependencias, partidas ni secretos; npm ci necesita acceso al registro de paquetes.
- ÚLTIMO PUNTO FUNCIONAL: crear/unirse, formar fórmula, READY individual, iniciar, mover actores compartidos, registrar promesa desde UI y sincronizarla; medidas ejecutivas con gasto y activación diferida compartidos. Regresiones de elecciones, leyes, compras, combate, justicia y fútbol conservadas.
- CÓMO CREAR PARTIDA: abrir el juego servido, elegir nombre y Crear partida; para probar sin doce personas, habilitar sala de prueba y usar fórmulas bot.
- CÓMO UNIRSE: en otro navegador/perfil abrir el mismo servidor, elegir nombre, copiar código de sala y Unirse. Asignar cada uno su candidatura, ambos READY. Al menos dos partidos; exactamente dos personas por fórmula en sala humana, bots solo para pruebas.

## Hosting / multiplayer / voz: estado exacto

- Servidor público activo en Railway; IDs y límites de persistencia arriba. HTTPS y juego comprobados en navegador.
- GitHub confirmado y publicado: agustincostantini07-spec/juego-politica-arg, carpeta ARGENTUM_2D. Historial remoto y archivos originales preservados.
- Endpoint: https://argentum-2d-production.up.railway.app/ y wss://argentum-2d-production.up.railway.app/ws; salud /healthz.
- Servidor: Node 24 + ws; autoritativo, salas independientes, 20 Hz física/10 Hz snapshots, hasta 12 actores. Reloj compartido; paneles no pausan. Nunca aceptar MOVE absoluto, PHYSICS ni ADVANCE de un cliente. Compras, cargos, leyes, medidas, dinero, daño y pelota resueltos por servidor.
- Conexiones probadas: cuatro clientes WebSocket concurrentes en loopback y dos interfaces fuente; ahora también dos pestañas Chrome reales por WSS público. Crearon/unieron sala B50B959510, fórmula con Presidente/Juez distintos, READY individual, oposición bot, inicio compartido, movimiento visible desde el otro jugador y pantalla Gobierno. No equivale a dos redes domésticas.
- Persistencia local: archivos atómicos en STATE_DIR, recuperación de identidad y deduplicación tras reinicio probadas. En Railway el archivo de sala se escribe; recuperación tras reemplazar contenedor pendiente del reinicio autorizado.
- Voz: WebRTC real implementado con getUserMedia, pistas, SDP/ICE y reproducción Web Audio. Señalización autenticada sobre WebSocket. Tres pruebas con dobles de medios, permisos/rangos/canales probados; cero pares de micrófonos reales escuchados.
- Proximidad: 10 metros × 24 unidades, atenuación y paneo, mismo interior/escena/sala. Fuera del alcance el cliente oficial corta el enlace.
- Canales: proximidad, partido, Congreso con turno, policía, bomberos y médicos. Un canal seleccionado a la vez. PTT V configurable, mute/volumen. Dos integrantes del partido pueden hablar a distancia.
- TURN: credenciales efímeras HMAC implementadas; servidor TURN no desplegado ni credenciales de proveedor disponibles. Sin relay algunas redes fallarán. TURN_URLS + TURN_SECRET privados; VOICE_RELAY_ONLY exige relay real probado. No hay aceptación acústica/Internet.

## Terminado en 3.1

### Medidas de gobierno y presupuesto

Nuevo src/governance.js y pantalla Gobierno en navegación/teléfono. Cuatro medidas ejecutivas: equipamiento hospitalario (18.000, 3 días), prevención policial (16.000, 3 días), bomberos (12.000, 2 días), mantenimiento de infraestructura (24.000, 5 días). Duración de servicio 30/30/30/45 días. Solo Presidente electo libre junto al escritorio, tesoro suficiente, sin duplicar una medida vigente. Vista previa de costo/plazos y confirmación; fondos transferidos del Tesoro a la población, conservando el dinero total. El pago forma parte del gasto del día y de un registro acumulado por área, sin doble descuento.

Servicios: salud mejora gradualmente la calidad y por tanto el tratamiento hospitalario; seguridad afecta prevención; bomberos reduce más intensidad por intervención humana; infraestructura mejora gradualmente actividad. Los servicios y condiciones económicas afectan segmentos de opinión y elecciones. No hay botón que sume popularidad directamente. Al vencer, el refuerzo termina; los indicadores económicos se adaptan gradualmente.

### Campaña, promesas y opinión

Candidato presidencial junto al micrófono registra instrumento/objetivo durante campaña, máximo cinco y uno por instrumento. Si gana pasa a EN PROCESO con plazo de mandato; si no gana queda candidatura no electa. Presidente vincula proyecto propio compatible desde su escritorio. Solo ley promulgada cuyo texto y política vigentes coincidan cumple el compromiso. Estados distinguen Congreso, veto, abandono y vencimiento. Veto superado puede cumplirlo; se puede vincular otro proyecto tras un bloqueo. Historial público y credibilidad acotada [-8,8] incorporada al peso electoral, con menor sanción por bloqueo institucional que por abandono. Credibilidad no es todavía confianza segmentada de cada grupo ni un modelo completo de medios.

### Congreso / leyes / economía

Cada enmienda conserva versiones y limpia las posiciones de bloque anteriores. Se vota el texto actualizado. Prueba específica: impuesto 25% → enmienda 22% → Congreso → promulgación → compra y recaudación al 22%. Se conserva la simulación de actividad, empleo, inflación, salarios, precios, consumo, impuestos, gasto, deuda, confianza y siete sectores sociales.

### Política y mundo preservados

Fórmulas de dos actores distintos, campañas, urnas, elecciones, Presidente y Juez independientes; bancas sistémicas configurables 5–100 y oposición. Ciudad compacta, interiores físicos de instituciones, 20 casas+negocio, trabajos, inventario, compras/propiedades, armas/daño/causas, policía, tribunal, celdas y liberación; fútbol con pelota autoritativa, bots, goles, tiempo y marcador. No se ampliaron esos sistemas en esta entrega; sus regresiones continúan pasando.

## Pruebas realmente ejecutadas

- `npm run build`: genera cliente de 206.674 bytes con todos los módulos.
- `npm test`: 43/43: 25 regresiones originales + 9 red real + 1 dos interfaces conectadas + 3 API de voz + 5 gobierno. RESULTADOS_TESTS.txt guarda salida real.
- Pruebas nuevas: autoridad/ubicación/tesoro, gasto atómico, conservación monetaria, demora/expiración, migración de guardado sin gobierno, promesa/ley/credibilidad, versiones/apoyos/compra, bloqueo institucional distinto de abandono, sincronización con cuatro clientes y registro de promesa por UI.
- `npm start` ejecutado realmente: GET / y /healthz HTTP 200, JavaScript construido analizado, creación de sala mediante WebSocket. Proceso de comprobación cerrado después. Primer sondeo entre invocaciones independientes no alcanzó el proceso; se repitió con servidor y cliente en el mismo entorno y pasó.
- Dos interfaces fuente crean, unen, inician y mueven ciudadanos conectados. Esto demuestra ejecución automatizada; no es una prueba visual/manual de navegador.
- Prueba de recuperación de promesa tras superar veto usa un resultado de promulgación preparado dentro del motor de test para aislar la evaluación; no se describe como votación humana de insistencia.

## Parcial / bugs conocidos / qué falta

- No hay errores críticos observados en 43 pruebas/build/arranque ni en la partida pública de navegador. Footer dice EDICIÓN 3.0 aunque código es 3.1: pendiente cosmético, no se publica cambio de runtime para evitar reinicio no autorizado. Falta audio real; logs observados de chrome-extension no pertenecen al juego.
- Online público funcional. Persistencia tras reinicio bloqueada por revisión automática; necesita autorización específica. Voz con TURN y dos redes domésticas pendiente. Dockerfile desplegado en Railway.
- Identidad se pierde si el jugador borra sessionStorage; sin recuperación de cuenta ni sucesión del anfitrión. No se admite incorporación nueva tras iniciar, solo reconexión de identidad. Carga máxima/latencia/pérdidas móviles sin medir.
- P2P no es un SFU: pares modificados coludidos pueden conservar medios fuera del control del servidor. Sin moderación/cola de voz avanzada ni certificación de privacidad a nivel de paquetes.
- Catálogo de cuatro medidas, sin presupuesto anual legislado integral ni todos los instrumentos de los requisitos. Falta subsidios/programas, ministerios, reforma constitucional, impugnación y fallo constitucional mediante causa. Juez penal actual funciona; no puede todavía resolver constitucionalidad.
- Promesas limitadas a instrumentos legales presentes, sin acuerdos multipartidarios vinculantes ni debate estructurado. El gasto de infraestructura es agregado; no coloca obras nuevas en el mapa.
- Fútbol: práctica/partido con bots y pelota compartida, sin selector completo de equipos humanos/reglamento F5. Mundo y combate siguen siendo base funcional, pendientes de expansión.
- Lanzador Windows preparado, no ejecutado en Windows. Ningún deployment previo modificado.

## Archivos importantes y siguiente prioridad

- src/governance.js: catálogo, ejecución, compromisos, credibilidad y versiones.
- src/engine.js / lobby.js: efecto económico/opinión/elecciones y evaluación autoritativa.
- src/ui.js / shell.html: Gobierno, confirmaciones, promesas, presupuesto, versiones.
- server/index.cjs / src/network.js / voice.js: salas, estado, permisos y voz.
- tests/governance.test.cjs / network.test.cjs / online-ui.test.cjs: aceptación automatizada nueva; tests anteriores conservados.
- ARGENTUM_2D.html: cliente construido. scripts/build.cjs: build portable.
- RAILWAY_DESPLIEGUE.md, DESPLIEGUE.md y PRUEBA_DOS_JUGADORES.md: publicación y validación WAN/voz.

Próxima prioridad: autorizar y verificar un reinicio de Railway, certificar persistencia y dos redes + TURN. Después ampliar gobierno y justicia constitucional. No empezar una feature grande al cerrar; preservar ZIP y reporte actualizado.

## Verificación pública del 16/09/2026

- GET /healthz respondió HTTP 200 con ok:true en la etapa de publicación. Navegador abrió el cliente y conectó dos actores al dominio público.
- Sala B50B959510: Prueba Pública A y B, Alianza Pública, confirmaciones 2/2, fórmula bot Horizonte Social, inicio de campaña. Calendario pausado por anfitrión. Movimiento mediante clic visible en la vista del segundo jugador; mapa y Gobierno renderizados realmente.
- Recarga del segundo navegador y botón «Reconectar a mi ciudadano» probados: volvió Prueba Pública B a la misma sala B50B959510. No es reconexión automática al recargar ni prueba de reinicio de servidor.
- Dos intentos de prueba CLI pública fallaron con DNS EAI_AGAIN desde el entorno del terminal. No se alteró DNS ni se rodeó la restricción. Se continuó la prueba de interfaz ya autorizada en navegador, cuyo acceso funcionaba.
- tests/public-probe.cjs deja un procedimiento reproducible HTTPS/WSS y --resume. Su sintaxis se verificó; NO afirmar que aprobó en este entorno. Guarda únicamente tokens de sus propias salas de prueba en archivo privado /tmp, fuera de Git, y no imprime credenciales. Requiere red funcional y ejecutar primero sin --resume; no sirve para recuperar la sala creada por navegador.
- npm test ejecutado de nuevo: 43/43. Ninguna feature de juego iniciada durante este cierre. Próximo commit documental se excluye de watchPatterns para no reiniciar producción.
