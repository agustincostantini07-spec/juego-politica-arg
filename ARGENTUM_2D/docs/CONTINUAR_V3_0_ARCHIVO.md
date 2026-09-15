# ARCHIVO HISTÓRICO — SUPERADO POR CONTINUAR_AQUI.md

# CIERRE SEGURO — 15/09/2026

Regla permanente incorporada a `AGENTS.md`. Este cierre no incorpora features de juego: conserva la build 3.0.0 y registra los nuevos requisitos online y políticos.

- Última versión jugable recuperable: `ARGENTUM_2D_v3_online.zip`, actualizado con protocolo de cierre, nuevos requisitos, fuentes, cliente construido, servidor e historial. La revisión exacta está en `COMMIT_ENTREGA.txt` dentro del ZIP.
- Última modificación: documentación de cierre permanente, estados políticos y primera acción exacta; copia íntegra de los dos adjuntos. Sin cambios en lógica, física o voz.
- Verificado en este cierre: `npm run build`, 37/37 pruebas; `npm start` realmente ejecutado, cliente HTTP 200 y `/healthz` OK. Las pruebas incluyen dos interfaces fuente que crean/join, forman fórmula, inician y mueven actores conectados.
- Límite de verificación: no se abrió una sesión manual de navegador ni se escucharon dos micrófonos. El rechazo previo del navegador a rutas locales impide certificar esa prueba; no se intentó rodearlo. No afirmar aceptación WAN completa.
- Servidor: ejecutable local comprobado; el proceso temporal de comprobación se cerró ordenadamente. No hay servicio público activo ni URL pública. Ningún deployment fue eliminado/modificado.
- GitHub: no hay remoto configurado ni publicación. Checkpoint Git local y bundle incluidos.
- Bugs críticos observados en este cierre: ninguno en build/pruebas/arranque. Pendientes conocidos: sin recuperación de identidad al perder sessionStorage, sin sucesión del anfitrión, TURN no desplegado, audio/navegador/WAN sin aceptación humana.
- Próxima prioridad: certificar dos navegadores/jugadores y conseguir acceso público con infraestructura habilitada, antes de declarar online completo. Después ampliar medidas de gobierno según el nuevo documento.

## PRIMERA ACCIÓN EXACTA PARA CONTINUAR

Abrir esta carpeta conservada, leer AGENTS.md y ejecutar `npm start` con Node 24 (si faltan dependencias: `npm ci`; luego `npm run build`). Abrir `http://localhost:3000` en dos perfiles de navegador, crear una sala de prueba, unir el segundo ciudadano, formar una fórmula Presidente/Juez, confirmar ambos READY, añadir una fórmula bot y comenzar. Verificar movimiento mutuo y seguir `PRUEBA_DOS_JUGADORES.md` para voz. Si el agente no puede acceder al navegador por política, registrar esa limitación y no repetir accesos bloqueados; el usuario puede realizar los pasos en su equipo. Para WAN hace falta un alojamiento accesible habilitado, HTTPS y TURN probado; ninguna cuenta nueva fue habilitada en este cierre.

## NUEVOS REQUISITOS REGISTRADOS, NO IMPLEMENTADOS COMPLETAMENTE

`ONLINE_REQUISITOS_V4.txt`: conserva el adjunto 8, que exige infraestructura pública comprobada desde redes distintas. Los sockets locales existentes no completan ese hito.

`POLITICA_REQUISITOS_V4.txt`: conserva el adjunto Texto pegado (2), con 74 apartados sobre gobierno, oposición, medidas, presupuesto, promesas, instituciones y consecuencias. No se inició una feature durante este cierre. A continuación se separa la base real de sus ampliaciones pendientes.

## POLITICAL SYSTEM
Base real: elecciones → cargos → proyectos/enmiendas → voto de bancas → promulgación/veto → impuestos/servicios → economía/opinión → siguientes elecciones. No es todavía todo el sistema ampliado.
## PARTIES
Dos candidatos distintos, nombre/sigla/color e ideología de seis dimensiones; READY individual online.
## CAMPAIGN
Actos físicos, costo/energía y alcance por partido; encuestas. Pendientes debates estructurados y efectos por asistencia real.
## PROMISES
Pendiente: registro de promesas y evaluación de cumplimiento/bloqueo parlamentario.
## ELECTIONS
Autoritativas y compartidas, voto único, reparto de bancas y renovación. Probadas con clientes de red.
## PRESIDENT
Actor electo, puede proponer leyes y promulgar/vetar dentro del Congreso; no dispone aún del catálogo ejecutivo ampliado.
## JUDGE
Actor electo distinto, resuelve causas con evidencia y restricciones. Pendiente control de constitucionalidad mediante casos.
## CONGRESS
Recinto físico y cámara sistémica compartida; posiciones de bloque y contenido influyen en votación.
## SEATS
Configurables de 5 a 100; build inicial 21. Test previo de configuración valida 100. No afirmar que el nuevo recorrido completo de tres partidos/100 bancas ya se verificó con personas por Internet.
## BILLS
Propuestas con autor, instrumento, valor, comisión y plazos.
## AMENDMENTS
Autor cambia texto/valor antes de votar, incluido artículo sanitario. Pendiente historial formal de versiones y acuerdos condicionados.
## VOTING
Sí/no/abstención, quórum/conteo y resultado. Bancas sistémicas; falta ampliar reglas por instrumento y disciplina humana explícita.
## LAWS
Registro de leyes, efecto sobre políticas reales, veto e insistencia; pendientes reforma constitucional y veto parcial.
## POLICIES / GOVERNMENT MEASURES
Funcionales mediante ley: consumo, salud, seguridad, penas y regulación simple de armas. Pendiente catálogo extensible de medidas ejecutivas con requisitos, costo, demora, áreas afectadas y evaluación previa; subsidios, infraestructura, salarios, deuda elegida y programas sociales.
## CONSTITUTION
Mandatos, límite de reelección y reglas básicas de cámara. Pendiente procedimiento de reforma e impugnación judicial.
## ECONOMY
Actividad, empleo, inflación, precios, pobreza, confianza, deuda, reservas, ingresos/gastos/balance y comercio agregado.
## TAXES
Consumo aplicado en compras; ingresos/salarios y propiedad según reglas. No todos los tipos tienen procedimiento político editable.
## BUDGET
Ingresos/gasto/balance y áreas básicas de salud/seguridad. Pendiente presupuesto legislado por todas las áreas solicitadas y ejecución progresiva de medidas administrativas.
## PUBLIC OPINION
Siete sectores con prioridades, satisfacción, aprobación y efectos de economía/políticas. Falta incorporar promesas, crisis institucionales y todos los nuevos instrumentos.
## POLITICAL EVENTS
Emergencias y protesta básica; pendiente catálogo de crisis con condiciones, opciones presidenciales y efectos duraderos.
## NEWS
Acontecimientos del motor generan noticias. Pendiente medios con credibilidad/línea editorial/audiencia.
## POLITICAL MULTIPLAYER SYNC
Resultados, cargos, cámara, proyectos, ley y economía salen del mismo servidor. Pendiente sincronizar los sistemas nuevos cuando se implementen y validación WAN humana.

---
Detalle de implementación conservado:

# CONTINUAR ARGENTUM 2D — V3 ONLINE

Último trabajo: 15/09/2026. Proyecto activo: `ARGENTUM_2D/`. No reiniciar desde cero. Usuario: Hernán. Instrucción vigente: `MULTIPLAYER_OFICIAL_V3.txt` (texto adjunto 7). Reemplaza la prioridad offline; conservar reglas y mundo anteriores.

## ESTADO ACTUAL

V3 online implementada sobre v2. Servidor Node, cliente WebSocket y voz WebRTC integrada. No hay despliegue público ni audio humano verificado. No confundir pruebas de API con escucha real. El usuario **declinó Render** en esta sesión: continuar sin esa conexión y no volver a sugerirla para este pedido.

Ejecutar Node 24: copiar `.env.example` a `.env`, `npm ci`, `npm run build`, `npm start`; abrir `http://localhost:3000`. Windows: `INICIAR_ARGENTUM.cmd`. No funciona como partida compartida abriendo solamente el HTML.

## MULTIPLAYER

- Tecnología elegida: Node.js 24 + `ws`, WebSocket nativo en navegador; protocolo 3.
- Arquitectura: una instancia del motor por sala; física a 20 Hz, snapshots a 10 Hz, interpolación visual de actores 100 ms.
- Host/servidor: servidor dedicado autoritativo; anfitrión es un ciudadano con permisos de lobby y reloj. No existe motor autoritativo en el cliente online.
- Lobby: crear/unirse por código de 10 caracteres, nombres, partidos, candidaturas propias y exactamente dos consentimientos READY. Mínimo dos partidos. Hasta 12 actores, seis partidos. Bots y armario de equipo solo en salas explícitas de prueba.
- Identidad: token aleatorio de 256 bits, hash almacenado en servidor; credencial en sessionStorage. Reconexión reemplaza conexión del mismo actor; no genera dinero nuevo. No hay cuentas/recuperación si se pierde la credencial ni sucesión automática del anfitrión.
- Relay de estado: no hace falta; clientes conectan directamente por WSS al servidor dedicado.
- Estado de sincronización: posiciones/dirección, interiores/puertas/asientos, inventario propio, transacciones, propiedades, armas/proyectiles/daño, causas/custodia/celdas, pelota/marcador, campaña, elecciones, gobierno, bancas, proyectos, leyes y economía comparten el mismo motor.
- Política: misma fuente de resultados para todos; votos individuales ajenos se ocultan. Bancas NPC sistémicas. Las candidaturas Presidente/Juez ganadoras recaen en dos actores diferentes.
- Reloj: un día/60s inicial; solo anfitrión cambia 0/1/2/4×. Los paneles no pausan. REST/TRAIN no adelantan el mundo; REST uno por día online. Física continúa con calendario pausado; salas sin conexiones no avanzan.
- Número de clientes probado: **4 clientes WebSocket reales concurrentes por sala en loopback**, más una sala aislada; **2 runtimes de interfaz fuente conectados**. No navegadores reales ni equipos separados.
- Problemas/límites: no pruebas bajo latencia/pérdida WAN, carga máxima ni reconexión móvil real. No selector de equipos humanos/reglas completas F5. No incorporación tardía después del inicio, salvo recuperar una identidad. No sharding ni servidor distribuido.

## HOSTING

- Proveedor: ninguno contratado/conectado para esta versión.
- Qué está alojado: se ejecutó el proceso local para pruebas; no servicio público permanente.
- URL/endpoint: local previsto `http://localhost:3000/`, `ws://localhost:3000/ws`; salud `/healthz`. No URL pública.
- Estado: Dockerfile + Compose/Caddy + ejemplo coturn preparados, sin ejecutar en este entorno. `render.yaml` conservado como configuración opcional, sin despliegue. Usuario declinó Render.
- Costos/free tier: no gastos ni recursos creados. Local no necesita servicio de pago. Render free investigado: WebSocket permitido pero efímero; no asumir guardado durable. VM/dominio/TURN requieren infraestructura real si se publican.
- Variables: PORT, HOST, NODE_ENV, ALLOWED_ORIGINS, DAY_SECONDS, MAX_ROOMS, ALLOW_TEST_BOTS, STATE_DIR, VOICE_PROXIMITY_RANGE, WORLD_UNITS_PER_METER, STUN_URLS, TURN_URLS, TURN_SECRET, VOICE_RELAY_ONLY; GAME_DOMAIN para Caddy.
- Guardado: archivos privados atómicos en STATE_DIR al conectar, confirmar comandos, cambiar día y cerrar. Probada recuperación al reiniciar. Usar volumen persistente; disco efímero no sirve para continuidad. Movimiento posterior al último punto de guardado puede perderse en cierre abrupto. Retiro de salas sin clientes tras 24h de inactividad del proceso.
- Documentación completa: `DESPLIEGUE.md`.

## VOICE CHAT

- Tecnología/servicio: WebRTC nativo en malla pequeña; señalización autenticada sobre `/ws`. No SDK SaaS ni cuenta externa necesaria para conexión directa. LiveKit evaluado, no integrado.
- SDK/APIs: getUserMedia, RTCPeerConnection, Web Audio, reproducción de flujo remoto, ICE/SDP. No es solo un botón.
- Configuración: STUN público inicial; TURN_URLS + TURN_SECRET opcionales y obligatorios juntos. Credenciales efímeras HMAC de una hora; renovación de configuración cada 30 minutos. Ningún TURN desplegado/probado. Relay-only exige TURN.
- Proximity: lobby completo; en mundo, mismo interior o exterior y distancia menor al rango. Volumen lineal; paneo estéreo. Servidor limita pares de señalización; cliente oficial cierra enlaces que pierden permiso.
- Rango: 10 metros configurables, 24 unidades/metro, total 240 unidades.
- Party channel: dos integrantes del partido, independiente de distancia/escena.
- Congress channel: ciudadanos libres dentro del Congreso; concesión de un turno de palabra por servidor, apertura de micrófono del cliente oficial después de concesión. Sin cola/moderador formal.
- Police channel: rol POLICE.
- Fire channel: rol FIREFIGHTER, canal FIRE_SERVICE.
- Medical channel: DOCTOR o NURSE.
- Canales: se selecciona uno a la vez; no mezcla simultánea proximity + party.
- Push-to-talk: V inicial; configurable a V/B/T/U/Y/Z; perder foco suelta transmisión. Micrófono abierto opcional.
- Mute: silencio individual local; volumen general de recepción; indicador de audio basado en analizador.
- Mic on/off: control de pista; desconectar detiene captura y conexiones. Denegación de permiso no rompe juego. Capturas tardías tras salir se cancelan; doble clic no abre dos capturas.
- Número de clientes probado: señalización entre dos clientes WebSocket reales. Tres pruebas con dobles de medios cubren captura, SDP/ICE, audio remoto, atenuación, escena, mute, PTT, turno y cancelación. **Cero pares de micrófonos reales escuchados**.
- Problemas: pendiente negociación WebRTC en navegador y aceptación acústica con dos equipos; redes restrictivas necesitan TURN. P2P no es un SFU: el servidor no controla paquetes de medios ya negociados entre clientes modificados. Posible intercambio de IP entre pares; relay-only evita ruta directa. Sin grabación en juego, sin moderación de comunidad.
- Protocolo exacto pendiente: `PRUEBA_DOS_JUGADORES.md`.

## SEGURIDAD

- Server-authoritative: dinero, inventario, compras, velocidad/colisión, daño, elecciones, cargos, bancas, leyes, justicia, propiedades, pelota, reglas de lobby/reloj.
- Client-side: dibujo e interpolación, inputs/intenciones, interfaz, ajustes/atenuación/captura/reproducción de voz. Alterar JS local no cambia la sala del servidor.
- Validaciones: actor fijado por conexión; lista permitida de comandos; se rechazan actorId en comandos, PHYSICS, MOVE absoluto y ADVANCE arbitrarios; roles, proximidad, autoría y candidaturas. READY individual. Reintentos deduplicados en ventana de 512 IDs por actor, persistida.
- Transporte: control de Origin, límites de payload/tasa/salas/conexiones, control de backpressure y heartbeat. Producción exige HTTPS/WSS a nivel proxy.
- Privacidad de snapshots: ocultos inventario/carrito/munición/saldo ajenos, votos individuales ajenos, comandos internos y actas identificables. Estado agregado y actos públicos visibles.
- Secret management: env privados e ignorados por Git; tokens guardados como hash en servidor; secreto TURN nunca al cliente. Configuraciones ejemplo no contienen credenciales reales. No serializar .env, .private, .pem, .key ni var/rooms en entregas.
- Problemas conocidos: sin cuentas verificadas, migración de anfitrión, protección distribuida contra abuso, auditoría de seguridad ni almacenamiento cifrado. El límite MAX_ROOMS es configuración, no capacidad demostrada. Voz P2P no permite garantizar permisos de medios contra pares coludidos.

## ARCHIVOS PRINCIPALES

- `server/index.cjs`: HTTP, WebSocket, salas, autenticación de sesión, permisos, ticks, snapshots, guardado y señalización/turnos de voz.
- `src/network.js`: conexión/reconexión, solicitudes con confirmación, inputs y posiciones interpoladas.
- `src/voice.js`: captura, WebRTC/ICE/SDP, nodos de reproducción y controles.
- `src/ui.js`: interfaz principal online cuando Network está cargado; rama local conservada exclusivamente para regresión de fuentes anteriores. El build principal siempre incluye Network y Voice.
- `src/engine.js`, `lobby.js`, `physical.js`, `interiors.js`, `data.js`, `world.js`: motor y mundo v2 preservados. Cambios adicionales: descanso/capacitación no adelantan calendario online; Juez no combina empleo; arresto físico inmediato del acusado; recogida de arma inicializa cantidad.
- `scripts/build.cjs`: build portable Node. `build.py` equivalente, no requerido para ejecutar.
- `tests/network.test.cjs`: ocho pruebas de sockets reales. Algunas colocan actores/avanzan calendario dentro del servidor de prueba, nunca a través de una puerta trasera de red.
- `tests/online-ui.test.cjs`: dos interfaces fuente con red real; harness DOM + Canvas, **no navegador**.
- `tests/voice.test.cjs`: tres pruebas API con dobles de medios, **no escucha acústica**.
- `tests/v2.test.cjs`, `controls.test.cjs`, `accessibility.test.cjs`: 25 regresiones conservadas.

## VALIDACIÓN Y REANUDACIÓN

`npm test`: 37 pruebas aprobadas. `RESULTADOS_TESTS.txt` conserva salida. Ejecutar build después de modificar fuentes y actualizar resultados solo con pruebas realmente ejecutadas. No afirmar hosting, navegador manual ni audio acústico aprobados.

Próximo trabajo concreto: ejecutar protocolo humano de dos equipos en HTTPS/localhost, configurar y comprobar TURN real entre redes diferentes, corregir cualquier fallo de audio/navegador observado; después medir latencia y carga y ampliar moderación/equipos de fútbol. Para publicar, hace falta infraestructura habilitada por el usuario; seguir con alternativas locales si no se habilita una cuenta. No rehacer el juego ni cambiar de proveedor por inercia.

El navegador integrado rechazó las rutas local/archivo durante la etapa v2; no intentar rodear esa política con otros navegadores, CDP o transferencias. Se utilizó un harness de fuentes explícitamente identificado. Las configuraciones de hosting no se publicaron para eludir ese rechazo.

Git local: la revisión exacta figura en `COMMIT_ENTREGA.txt`. Se adjunta `HISTORIAL.bundle` con historial. No existe remoto de GitHub. Documentos de continuidad v2 preservados en `docs/`; respaldo v2 y checkpoint v3 previos guardados.
