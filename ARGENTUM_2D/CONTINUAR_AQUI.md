# CONTINUAR ARGENTUM 2D — 3.1.0

Última modificación: 15/09/2026. Leer este archivo antes de tocar el proyecto. Instrucción vigente: REANUDACION_V5.txt (adjunto 10), junto con AGENTS.md y los requisitos conservados. No reiniciar. La base previa v3.0/checkpoint 371fc6c está conservada en el historial; esta entrega añade gobierno y compromisos. El detalle técnico anterior está en docs/CONTINUAR_V3_0_ARCHIVO.md y es histórico cuando contradice este estado.

## PRIMERA ACCIÓN EXACTA

GitHub y Railway conectados. El usuario confirmó agustincostantini07-spec/juego-politica-arg. Publicación autorizada en subcarpeta ARGENTUM_2D, conservando la aplicación Next.js existente. Hito en curso: subir este checkpoint y desplegar Railway con rootDirectory=/ARGENTUM_2D, una sola réplica, HTTPS/WSS y persistencia. Consultar estado real del proveedor antes de reintentar; no crear servicios duplicados.

Para ejecutar la entrega: Node 24, `npm ci`, `npm run build`, `npm start`; abrir http://localhost:3000. Windows: INICIAR_ARGENTUM.cmd. Para retomar validación: `npm test` (43 pruebas), después PRUEBA_DOS_JUGADORES.md. No repetir el acceso de navegador local bloqueado por política ni intentar rodearlo.

## Versión y checkpoint

- VERSIÓN JUGABLE: SÍ, build 3.1.0 ejecutable localmente; comprobación automatizada, no aceptación manual de navegador/WAN/audio.
- BUILD/ZIP: ARGENTUM_2D_v3_online.zip contiene fuentes, HTML construido, servidor, lockfile, instrucciones, pruebas e HISTORIAL.bundle. La versión exacta del commit figura en COMMIT_ENTREGA.txt dentro del ZIP. No incluye dependencias, partidas ni secretos; npm ci necesita acceso al registro de paquetes.
- ÚLTIMO PUNTO FUNCIONAL: crear/unirse, formar fórmula, READY individual, iniciar, mover actores compartidos, registrar promesa desde UI y sincronizarla; medidas ejecutivas con gasto y activación diferida compartidos. Regresiones de elecciones, leyes, compras, combate, justicia y fútbol conservadas.
- CÓMO CREAR PARTIDA: abrir el juego servido, elegir nombre y Crear partida; para probar sin doce personas, habilitar sala de prueba y usar fórmulas bot.
- CÓMO UNIRSE: en otro navegador/perfil abrir el mismo servidor, elegir nombre, copiar código de sala y Unirse. Asignar cada uno su candidatura, ambos READY. Al menos dos partidos; exactamente dos personas por fórmula en sala humana, bots solo para pruebas.

## Hosting / multiplayer / voz: estado exacto

- Railway: conectado y consultado con éxito; lista de proyectos vacía. No se crearon proyecto, servicio, dominio, volumen ni deployment. No hay endpoint público ni costo de infraestructura generado por esta ejecución. Render sigue declinado.
- GitHub confirmado: agustincostantini07-spec/juego-politica-arg, carpeta ARGENTUM_2D. Se publica mediante commit de la API conservando el historial remoto y todos los archivos existentes. El historial local anterior permanece en el ZIP/bundle. Deploy en curso; actualizar este estado al confirmar resultado.
- Endpoint disponible al ejecutar: http://localhost:3000, ws://localhost:3000/ws, salud /healthz. Localhost NO permite entrar desde otra casa.
- Servidor: Node 24 + ws; autoritativo, salas independientes, 20 Hz física/10 Hz snapshots, hasta 12 actores. Reloj compartido; paneles no pausan. Nunca aceptar MOVE absoluto, PHYSICS ni ADVANCE de un cliente. Compras, cargos, leyes, medidas, dinero, daño y pelota resueltos por servidor.
- Conexiones probadas: cuatro clientes WebSocket concurrentes en loopback y dos interfaces fuente con DOM simulado + Canvas y red real. No cuatro navegadores ni dos redes WAN.
- Persistencia local: archivos atómicos en STATE_DIR, recuperación de identidad y deduplicación tras reinicio probadas. En Railway requiere volumen y permisos correctos; no probado aún allí.
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

- No hay errores críticos observados en las 43 pruebas/build/arranque. Falta aceptación visual y de audio con navegadores humanos.
- Online público bloqueado por repositorio/acceso GitHub. HTTPS/WSS público, volumen y WAN aún no comprobados. Dockerfile preparado pero no ejecutado en este entorno.
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

Próxima prioridad: publicar checkpoint en repositorio confirmado, desplegar Railway y certificar dos redes + TURN. Después ampliar gobierno y justicia constitucional. No empezar una feature grande al cerrar; preservar ZIP y reporte actualizado.
