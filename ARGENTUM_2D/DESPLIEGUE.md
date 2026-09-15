# Despliegue de ARGENTUM 2D Online

No se ha desplegado un servidor público. Render fue investigado, ofrecido y declinado; no hace falta conectarlo para usar esta entrega. No se crearon recursos de pago ni cuentas. No se publicó GitHub.

## Opción ejecutada: servidor Node local

Ver README. Rutas reales del proceso: `/` cliente, `/ws` WebSocket, `/healthz` estado de servicio. Puerto por defecto 3000; escucha en todas las interfaces. `npm start` carga `.env` si existe. El servidor local se utilizó en pruebas automatizadas con puertos asignados por el sistema, no como un servicio de hosting permanente.

En una LAN, los equipos pueden compartir el proceso por su IP. Para audio, ver las alternativas HTTPS o SSH del protocolo humano. Esta ruta no requiere pagar infraestructura.

## Opción portátil para Internet: servidor Linux + Docker + Caddy

Archivos preparados: `Dockerfile`, `deploy/compose.yaml`, `deploy/Caddyfile`. No se ejecutaron Docker ni el despliegue en este entorno.

Necesitás un servidor Linux con IP pública y Docker Compose, más un nombre DNS que apunte a él. Elegirlo no implica haberlo contratado. Puede ser un servidor propio o una VM disponible; no se presupone una cuenta externa.

1. Copiá el proyecto a ese servidor.
2. Copiá `.env.example` a `.env` y editá `ALLOWED_ORIGINS=https://TU_DOMINIO`. Usá exactamente el origen visible en el navegador, sin barra final.
3. Establecé `ALLOW_TEST_BOTS=false` para salas públicas sin equipo de prueba. El inventario inicial normal no entrega armas; falta un circuito de aprovisionamiento de armas de producción.
4. Guardá en `.env` `GAME_DOMAIN=TU_DOMINIO`. No es un secreto. No pongas `http://` ni una ruta.
5. Abrí puertos TCP 80 y 443 para Caddy. No expongas 3000 directamente a Internet.
6. Desde la raíz del proyecto:

```sh
docker compose --env-file .env -f deploy/compose.yaml up -d --build
```

7. Abrí `https://TU_DOMINIO/`. WebSocket se completa como `wss://TU_DOMINIO/ws`. Confirmá `https://TU_DOMINIO/healthz` y ejecutá todo el protocolo de dos jugadores.

El volumen `rooms` conserva datos entre reinicios de contenedores; no lo elimines al actualizar. Copialo mediante backups del servidor. Caddy mantiene certificados en sus propios volúmenes. Ejecutá una sola instancia del proceso de juego: este diseño no reparte una sala entre múltiples procesos ni contiene Redis/SQL distribuido.

[Caddy soporta el upgrade de WebSocket desde reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy).

## Relay TURN para la voz

La voz usa conexión directa cuando puede. Para cubrir redes restrictivas, prepará un coturn accesible desde ambos clientes. No se ha instalado ni probado un relay externo.

1. Instalá coturn en un servidor con IP pública. Usá su gestor de paquetes o imagen oficial según tu plataforma.
2. Copiá `deploy/coturn.conf.example` a una ubicación privada; sustituí dominio, IP y certificados reales.
3. Generá un secreto aleatorio privado. Un procedimiento sin imprimirlo:

```sh
node -e "require('fs').writeFileSync('turn-secret.private',require('crypto').randomBytes(32).toString('hex'),{mode:0o600})"
```

Ese archivo es temporal y confidencial; no lo subas al repositorio ni lo compartas. Colocá su valor en `TURN_SECRET` del entorno de ARGENTUM y `static-auth-secret` de la configuración privada de coturn. Eliminá la copia temporal cuando ambas configuraciones estén guardadas.

4. En ARGENTUM, establecé `TURN_URLS=turn:TU_TURN:3478?transport=udp,turns:TU_TURN:5349?transport=tcp`. TURN/TLS requiere certificado válido.
5. Habilitá 3478 UDP/TCP, 5349 TCP y el rango UDP 49160–49200 configurado en el ejemplo. En redes que solo admitan 443 podría requerirse un relay TURN/TLS en 443 con IP/proxy apropiado, separado del HTTPS del juego.
6. Reiniciá ARGENTUM. Activá temporalmente `VOICE_RELAY_ONLY=true` y verificá que ambos clientes negocien un candidato `relay` y se escuchen. Volvé a `false` si preferís usar conexión directa cuando sea posible.

El secreto principal no aparece en el cliente. `/ws` lo utiliza solo del lado servidor para emitir credenciales de una hora. Nunca configures coturn como relay abierto o sin autenticación. Adaptá rangos, cuotas y firewall a la capacidad real del servidor. [Configuración oficial de coturn](https://github.com/coturn/coturn/blob/master/examples/etc/turnserver.conf).

## Variables

| Variable | Valor inicial / función |
|---|---|
| PORT | 3000 |
| HOST | 0.0.0.0 |
| NODE_ENV | development local; production con HTTPS/proxy |
| ALLOWED_ORIGINS | Lista separada por coma; si falta, se exige origen correspondiente al host recibido |
| DAY_SECONDS | 60; de 1 a 3600 |
| MAX_ROOMS | 20; capacidad configurada, no carga validada |
| ALLOW_TEST_BOTS | true; habilita opción de salas de prueba |
| STATE_DIR | Directorio privado de guardados; ejemplo `./var/rooms` |
| VOICE_PROXIMITY_RANGE | 10 metros |
| WORLD_UNITS_PER_METER | 24 |
| STUN_URLS | `stun:stun.l.google.com:19302`; vacío para pruebas sin STUN |
| TURN_URLS | URLs de relay; sin valor por defecto |
| TURN_SECRET | Secreto principal; solo servidor |
| VOICE_RELAY_ONLY | false; true requiere TURN configurado |
| GAME_DOMAIN | Solo Docker Compose/Caddy; dominio HTTPS |

## Alternativa investigada, no elegida por el usuario

`render.yaml` deja una configuración portable para un servicio Node. No se llamó a APIs de Render ni se creó un servicio. Su nivel gratuito admite WebSockets, pero puede suspenderse por inactividad y no conserva archivos locales tras reinicios. Por eso no es una promesa de hosting permanente ni de guardado durable. [WebSockets en Render](https://render.com/docs/websocket), [restricciones del nivel gratuito](https://render.com/docs/free).

No se pagó infraestructura. Los costos de una VM, un dominio o ancho de banda TURN dependen del proveedor que se habilite más adelante.
