# ARGENTUM 2D — Online 3.1

Juego de política y sociedad con un servidor autoritativo, salas de hasta 12 participantes y chat de voz WebRTC integrado. Conserva la ciudad, interiores, economía, Congreso, justicia, armas y fútbol de la edición anterior.

**Estado de entrega:** servidor y cliente online implementados; conexiones reales probadas en la misma máquina. Sin publicación en Internet ni prueba acústica humana. La cuenta de Render propuesta no fue habilitada, por decisión del usuario. No hay una URL pública. Las configuraciones de alojamiento incluidas son preparativos, no servicios desplegados.

## Abrir el juego

Requisito: Node.js 24 o posterior. La dependencia de ejecución es `ws`; no se necesita Python para construir ni ejecutar.

En Windows, descomprimí el proyecto y abrí `INICIAR_ARGENTUM.cmd`. Dejá abierta la ventana del servidor y entrá a **http://localhost:3000** en tu navegador. El primer inicio instala las dependencias desde npm.

También podés usar una terminal dentro de la carpeta:

```sh
npm ci --omit=dev --ignore-scripts
npm run build
```

Copiá `.env.example` a `.env` (Windows: `copy .env.example .env`; macOS/Linux: `cp .env.example .env`). Después:

```sh
npm start
```

El HTML se sirve desde el mismo proceso que el servidor WebSocket. Abrir `ARGENTUM_2D.html` directamente no arranca un servidor. Dos copias desconectadas del HTML no forman una partida compartida.

## Crear y unirse

1. Primer jugador: escribe su nombre y pulsa **Crear partida**. Para pruebas con dos humanos, marca **Sala de prueba** antes de crearla.
2. Comparte la dirección del juego y el código de sala de 10 caracteres. El código permite entrar durante el lobby; no compartas la credencial de reconexión del navegador.
3. Segundo jugador: abre la misma dirección, escribe su nombre y el código, y pulsa **Unirse a partida**.
4. Un integrante crea un partido. Cada persona ocupa **su propio** lugar: candidato a Presidente o a Juez. Cada uno confirma **mi READY**. Nadie puede asignar a otra persona.
5. Se requieren dos partidos completos, cuatro candidatos. Con dos humanos, el anfitrión puede añadir **un partido de bots** en una sala marcada de prueba. Con cuatro humanos no hacen falta bots.
6. El anfitrión pulsa **Comenzar campaña compartida**. Al principio no hay Presidente ni Juez. Ambos cargos los decide la elección del servidor.

Para la primera prueba en un equipo, usá dos navegadores o perfiles separados. Cada pestaña conserva su sesión en `sessionStorage`; una pestaña duplicada puede copiar la credencial, por lo que **Unirse** crea un ciudadano distinto y **Reconectar** recupera el mismo. Una reconexión del mismo ciudadano cierra su conexión anterior.

Al cerrar la pestaña definitivamente se puede perder esa credencial. Todavía no hay cuentas ni recuperación de identidad por correo. Conservar el código de sala no recupera a un ciudadano perdido.

## Dos equipos en una red local

En el equipo del servidor, obtené su IPv4 con `ipconfig` (Windows) o la configuración de red. Ambos equipos deben abrir `http://IP_DEL_SERVIDOR:3000`. El cliente completa automáticamente `ws://IP_DEL_SERVIDOR:3000/ws`. Permití el puerto TCP 3000 en el firewall de esa red privada.

Esto permite probar el **juego** desde dos equipos. Para micrófono, `http://IP_PRIVADA` no es un contexto seguro: necesitás HTTPS confiable, o el túnel localhost descrito en `PRUEBA_DOS_JUGADORES.md`. No desactives la seguridad del navegador.

## Controles

WASD/flechas: caminar. Shift: correr. Clic: ruta; con arma equipada: atacar. E: interactuar con puertas, sillas, urna o muebles. I: inventario. P: teléfono. R: recargar. Espacio/Q: remate/pase. 1–5: consumir. V: mantener para hablar cuando el micrófono está activado.

**Los paneles no pausan el mundo compartido.** El reloj lo lleva el servidor: por defecto, un día cada 60 segundos. El anfitrión puede pausar el calendario o elegir 1×/2×/4×. La física continúa con el calendario pausado. Descansar y capacitarse no adelantan el día de los demás; descanso limitado a uno por día.

La campaña inicial dura siete días y las urnas abren dos días antes del escrutinio. Para votar, entrá físicamente al Congreso y acercate a la urna del hall. El Presidente y el Juez son las dos personas de la fórmula ganadora. El Congreso tiene bancas sistémicas, no 21 jugadores legisladores.

Las puertas e interiores son los mismos para todos. El mercado descuenta dinero y entrega productos en caja. Las armas generan proyectiles, daño y causas calculados en el servidor. En la cancha existe una pelota y un marcador compartidos; no se puede reiniciar un partido que está en juego. Los equipos humanos de fútbol todavía no tienen selector, sustituciones ni reglas completas de F5.

## Voz

Abrí el control 🎙, abajo a la derecha, y pulsá **Activar voz**. El permiso de micrófono se solicita en ese momento. Si se deniega, la partida sigue funcionando. Inicialmente el micrófono queda armado, pero transmite al mantener **V**. Se puede desactivar PTT, apagar el micrófono, ajustar el volumen recibido o silenciar a una persona.

Se transmite y escucha **un canal seleccionado a la vez**:

| Canal | Regla |
|---|---|
| PROXIMITY | Todo el lobby; durante el juego, mismo interior/exterior y menos de 10 metros |
| PARTY | Los dos integrantes del mismo partido, a cualquier distancia |
| CONGRESS | Ciudadanos libres dentro del Congreso; un turno de palabra concedido por servidor |
| POLICE | Rol POLICE |
| FIRE_SERVICE | Rol FIREFIGHTER |
| MEDICAL | Roles DOCTOR o NURSE |

El volumen de proximidad cae linealmente hasta cero. La escala inicial es **24 unidades de mundo por metro**: 10 metros = 240 unidades. El paneo izquierda/derecha acompaña la posición relativa. Se cierran las conexiones a personas que dejan de estar habilitadas. PTT admite V, B, T, U, Y o Z para evitar controles de juego; perder el foco deja de transmitir.

El indicador de voz local/remota lee el nivel de audio mediante un analizador. El estado “audio conectado” indica conexión WebRTC; no certifica por sí solo que una persona haya escuchado otra.

### Configuración de voz e Internet

No se eligió un servicio de pago: se usan `getUserMedia`, `RTCPeerConnection` y Web Audio del navegador, con señalización autenticada en `/ws`. Para salas pequeñas evita desplegar un servidor de medios completo. El límite de malla y su ancho de banda se deben medir con más jugadores antes de ampliar la escala.

Sin TURN, WebRTC puede conectar dentro de una red o a través de ciertos NAT, pero **no cubre todas las redes**. Para Internet confiable, configurá un relay coturn:

- `TURN_URLS`: URLs reales de tu servidor TURN.
- `TURN_SECRET`: secreto compartido entre el servidor ARGENTUM y coturn. Solo en el entorno/configuración privada.
- El backend entrega usuario temporal y HMAC, con vigencia de una hora. Renueva la configuración de clientes activos cada 30 minutos. El secreto principal nunca se envía al navegador.
- `VOICE_RELAY_ONLY=true` obliga a pasar por TURN y evita intercambiar direcciones IP directas entre participantes. No funciona sin un TURN accesible.

No hay un relay TURN desplegado ni credenciales de un proveedor cargadas en esta entrega. La integración y el ejemplo `deploy/coturn.conf.example` están incluidos. Consultá `DESPLIEGUE.md` y el protocolo humano de prueba.

## Arquitectura y seguridad

`server/index.cjs` sirve el cliente y administra una instancia de `Argentum.Engine` por sala. WebSocket transmite intenciones y comandos; el servidor actualiza la física a 20 Hz y envía estados a 10 Hz. El cliente interpola visualmente las posiciones durante 100 ms. Inventarios propios, proyectiles, pelota, puertas, economía y política salen de esa única instancia.

El identificador de actor se fija al conectar, con un token aleatorio de 256 bits para reconexión. El servidor guarda su hash. Los comandos no pueden elegir otro actor. Se rechazan cambios de saldo, daños declarados, importaciones, física enviada por cliente y adelantos de calendario arbitrarios. La velocidad se obtiene de entradas limitadas a vectores normalizados y del paso temporal del servidor; enviar más paquetes no aumenta la velocidad.

Permisos: acciones de anfitrión, candidaturas propias, READY individual, editor autor del proyecto, Presidente y Juez electos, roles profesionales, compras y acciones físicas de proximidad. Los comandos tienen identificador y una ventana de 512 respuestas deduplicadas por actor, conservada al reconectar y al guardar. No se garantiza deduplicación de identificadores expulsados de esa ventana.

El estado enviado oculta inventarios, carrito, munición y saldo de los otros ciudadanos, votos individuales ajenos, historial de votos identificables y comandos internos. La economía agregada, actos públicos, propiedades y causas judiciales siguen siendo visibles por diseño.

Hay control de origen WebSocket, tamaño de mensaje, tasa por conexión/IP, máximo de salas, límite de salida acumulada, ping/pong y reconexión con espera creciente. HTTPS/WSS debe proteger el despliegue público. Esta entrega no es una auditoría de seguridad ni incluye protección distribuida contra abuso, cuentas verificadas, moderación o cifrado de los archivos de estado.

La voz es P2P: el servidor autoriza señalización y el cliente oficial deja de enviar al perder permiso. No hay un SFU que inspeccione/revoque paquetes de medios ya negociados. Participantes modificados que colaboren pueden mantener un enlace externo; un destinatario puede grabar lo que escucha. No hay grabación implementada en ARGENTUM. Antes de abrir una comunidad pública, conviene evaluar un SFU y moderación.

## Guardado y continuidad

Con `STATE_DIR` configurado, el servidor escribe archivos privados de sala por reemplazo atómico: al conectar, en comandos confirmados, al cambiar de día y al cerrar ordenadamente. Posiciones entre esos puntos no tienen garantía de recuperación ante un cierre brusco. El lobby recuperado exige nuevos READY humanos. Las salas sin clientes no avanzan y se retiran tras 24 horas de inactividad del proceso.

Sin disco/volumen persistente del proveedor, reiniciar o redesplegar puede perder la sala. No importes JSON de clientes para “recuperarla”. El anfitrión necesita conservar su sesión para gestionar reloj/lobby; todavía no hay sucesión automática de anfitrión.

## Comprobaciones de esta entrega

```sh
npm ci
npm test
```

43 pruebas automatizadas: 25 anteriores, 9 de red real, 1 con dos interfaces fuente conectadas, 3 de integración de API de voz con dobles de medios y 5 de gobierno. `RESULTADOS_TESTS.txt` conserva el resultado.

Se probaron cuatro clientes WebSocket concurrentes por sala en loopback, además de una sala aislada. Algunas pruebas colocan actores o avanzan días **directamente en el servidor de prueba** para aislar compras, armas, leyes y justicia; ese acceso no se expone por red. No son cuatro navegadores con cuatro micrófonos.

No se hizo prueba manual de navegador ni escucha entre dos personas. Los controles de voz se comprobaron con dobles de API; su señalización y permisos se comprobaron por WebSocket real. Docker/Caddy/coturn no se ejecutaron en este entorno. La aceptación pendiente está en `PRUEBA_DOS_JUGADORES.md`.

## Fuentes técnicas consultadas

- [WebRTC: conexión entre pares, señalización, STUN y TURN](https://webrtc.org/getting-started/peer-connections).
- [ws: implementación WebSocket para Node.js](https://github.com/websockets/ws).
- [LiveKit: puertos e infraestructura de autoalojamiento](https://docs.livekit.io/transport/self-hosting/ports-firewall/). Alternativa valorada para una escala mayor; no instalada ni integrada.
- [Caddy: reverse proxy y soporte WebSocket](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy).
- [coturn: configuración oficial](https://github.com/coturn/coturn/blob/master/examples/etc/turnserver.conf).
- [Render: WebSockets](https://render.com/docs/websocket) y [límites del nivel gratuito](https://render.com/docs/free). Alternativa investigada, no utilizada.

El historial Git es local y se adjunta en `HISTORIAL.bundle`; no se publicó un repositorio en GitHub. El estado preciso para continuar está en `CONTINUAR_AQUI.md`.


## Gobierno y compromisos — 3.1

Abrir **Gobierno** en la barra superior o el teléfono. Sus tres pestañas muestran medidas, promesas y ejecución presupuestaria.

- Presidente electo: recorrer el Congreso hasta su escritorio, evaluar y confirmar una medida. Se cobra una sola vez, se implementa durante varios días y luego presta servicio durante un plazo definido. Catálogo inicial: hospital, policía, bomberos e infraestructura.
- Candidato presidencial: durante campaña, ir junto al micrófono de la plaza, abrir Gobierno → Promesas y registrar instrumento/objetivo. Si gana, presentar el proyecto correspondiente en el atril del Congreso, regresar al escritorio y vincularlo. La promulgación debe producir el objetivo para cumplir el compromiso.
- Las enmiendas registran versiones y borran apoyos de bloque al texto anterior. Un rechazo parlamentario, veto, abandono o vencimiento tienen estados y consecuencias diferentes. Un veto superado puede cumplir el compromiso.
- El presupuesto mostrado es el acumulado pagado por medidas; el gasto general diario sigue en Economía. No es todavía un presupuesto legislado integral.

Estado de publicación y pasos pendientes: **RAILWAY_DESPLIEGUE.md**. Railway conectado no equivale a juego publicado.
