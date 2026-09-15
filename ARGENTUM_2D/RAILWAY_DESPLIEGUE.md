# Publicación de ARGENTUM 2D en Railway

Estado comprobado el 15/09/2026: conexión Railway operativa; consulta de proyectos devolvió lista vacía. No hay deployment, dominio ni volumen creados. No se generaron gastos de infraestructura en esta ejecución. Git local sin remoto. La herramienta disponible para desplegar fuentes exige un repositorio GitHub confirmado por el usuario, en formato `propietario/repositorio`, accesible desde su cuenta Railway. No admite subir directamente este ZIP.

## Desbloqueo necesario

Conectar GitHub en ChatGPT y confirmar el repositorio de destino. Si todavía no existe, crearlo en GitHub y compartir `propietario/repositorio`; otorgar a Railway acceso a ese repositorio. No pegar tokens en el chat. El proyecto preparado contiene fuentes, Dockerfile, lockfile, tests y build. No subir datos de partidas ni archivos privados de configuración.

## Secuencia del próximo despliegue

1. Publicar el checkpoint de esta entrega en el repositorio confirmado, conservando el historial Git. No adivinar propietario ni usar otro repositorio.
2. Crear proyecto ARGENTUM 2D y servicio desde ese repositorio/rama main. Railway detecta el Dockerfile. El contenedor instala dependencias de producción, compila el cliente y ejecuta `node server/index.cjs`.
3. Configurar una sola réplica. El estado de salas reside en una instancia: no habilitar escalado horizontal. Healthcheck `/healthz` con timeout 60 segundos; reinicio ante fallo. No habilitar suspensión para una partida que deba permanecer disponible.
4. Para conservar partidas, agregar volumen montado en `/data`, `STATE_DIR=/data/rooms`. Los volúmenes Railway se montan como root; el Dockerfile usa el usuario node. Configurar `RAILWAY_RUN_UID=0` según la documentación de permisos del proveedor, o preparar propiedad del volumen antes de usar node. No declarar persistencia hasta probar un reinicio con una sala real. La disponibilidad/precio del volumen se debe comprobar en la cuenta.
5. Variables: `NODE_ENV=production`, `HOST=0.0.0.0`, `PORT=3000`, `DAY_SECONDS=60`, `MAX_ROOMS=20`, `ALLOW_TEST_BOTS=true` para aceptación. Generar dominio Railway con destino puerto 3000; configurar `ALLOWED_ORIGINS=https://DOMINIO_REAL`. No incluir el texto DOMINIO_REAL literalmente en producción.
6. Consultar estado y logs de build/ejecución hasta SUCCESS. Verificar GET `/healthz`, GET `/`, dos conexiones WSS, crear/unirse, movimiento, compras y ley compartida. Guardar IDs reales del proyecto, entorno, servicio y dominio en CONTINUAR_AQUI.md.
7. Conectar TURN real: `TURN_URLS` y `TURN_SECRET` privados y juntos. Usar servidor compatible con credenciales efímeras coturn HMAC. No inventar credenciales ni instalar coturn dentro del servicio web sin validar sus necesidades de UDP/TCP. `VOICE_RELAY_ONLY=true` solo al verificar un relay operativo. Sin TURN, ciertas redes no podrán intercambiar audio.
8. Ejecutar PRUEBA_DOS_JUGADORES.md con dos personas/redes; confirmar escucha, proximidad y canales. Registrar resultados acústicos reales antes de dar voz por terminada.

## Referencias del proveedor consultadas

- [Dockerfile y fuentes desde GitHub](https://docs.railway.com/guides/docker-compose#services-with-a-dockerfile-or-build-context).
- [Permisos de volúmenes](https://docs.railway.com/volumes#permissions).
- [Configuración de despliegue](https://docs.railway.com/config-as-code/reference). La página consultada declara obsoleto Config as Code y recomienda Infrastructure as Code; no se agregó un railway.json nuevo. Configurar el servicio con las herramientas disponibles y consultar su esquema vigente al desplegar.

No hay un enlace público de juego en esta entrega. El endpoint local de prueba es http://localhost:3000; no permite conectar desde otra casa por sí solo.
