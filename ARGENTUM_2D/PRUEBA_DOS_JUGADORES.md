# Prueba humana: dos jugadores y dos micrófonos

**Pendiente de ejecución humana.** No hay registro de escucha entre personas en esta entrega. Las pruebas automáticas validan red y llamadas a API de audio con dobles; no reemplazan este protocolo.

## Preparar dos clientes

Usá dos computadoras, auriculares en ambas y Chrome, Edge o Firefox recientes. Evitá altavoces para no confundir eco acústico con tráfico del juego.

Elegí uno de estos entornos:

- **HTTPS publicado:** ambos abren la misma dirección HTTPS del servidor que se haya desplegado según `DESPLIEGUE.md`.
- **Dos equipos sin publicar, por SSH:** levantá el servidor en A, abrí `http://localhost:3000` en A. Si A ya tiene un servicio SSH accesible, desde B ejecutá `ssh -N -L 3000:127.0.0.1:3000 USUARIO@IP_DE_A` y abrí `http://localhost:3000` en B. Ambos se conectan al mismo servidor; localhost permite solicitar micrófono. El túnel lleva HTTP y señalización; la voz WebRTC sigue negociando su propia ruta directa/relay. No hay un SSH instalado/configurado por esta entrega.
- **Solo para comprobación preliminar en un equipo:** dos perfiles de navegador en `http://localhost:3000`. Esto prueba dos clientes, pero el micrófono y la salida compartidos impiden considerarlo aceptación acústica final.

No abras `http://IP_DE_A:3000` para certificar voz: ese origen HTTP normalmente no habilita micrófono. No cambies flags ni permisos de seguridad del navegador para evitar HTTPS.

## Lobby y conexión básica

1. A crea una **sala de prueba** como “Jugador A”. Copia el código de 10 caracteres.
2. B pulsa **Unirse a partida** como “Jugador B”, usando ese código. No debe pulsar “Reconectar” al ciudadano de A.
3. A debe ver a B en participantes y B debe ver a A, ambos conectados.
4. A y B abren el control 🎙 y pulsan **Activar voz**. Aceptan el permiso de micrófono en cada equipo.
5. Ambos seleccionan **Proximidad / lobby**. Mantienen activado **Mantener tecla para hablar**. El botón debe indicar **Mic ON**.
6. A mantiene **V** y dice “Argentum, prueba A, uno dos tres”. B debe escuchar esa frase. B confirma con otra frase manteniendo V. Debe existir señal de “hablando” y estado de conexión de audio del otro.
7. Si “negociando…” permanece, comprobar HTTPS/localhost, micrófono del sistema, dispositivo de salida, firewall y TURN. No registrar “pasó” solo por ver el botón o la conexión.

## Entrar al mundo

8. A crea “Partido de prueba”. A ocupa candidato a Presidente y B candidato a Juez.
9. A confirma **mi READY**: el partido todavía no debe quedar READY hasta que B confirme el suyo.
10. A agrega **un partido de bots** y pulsa **Comenzar campaña compartida**. Esto permite arrancar con dos personas y cuatro candidatos; los bots no tienen voz.
11. Ambos deben aparecer en la misma ciudad y verse. A camina: B observa el movimiento. Después B camina y A lo observa. Ninguno puede cambiar el ciudadano controlado desde el selector superior.

## Proximidad, interiores y partido

12. Cerca del otro, repetir una frase en V: se debe escuchar. Mantener una conversación alternada, sin dos micrófonos abiertos simultáneamente.
13. B se aleja mientras A repite palabras. La voz debe bajar. Superados 10 metros (240 unidades iniciales; aproximadamente un segundo corriendo en línea recta), deja de escucharse. La distancia exacta se verifica desde posiciones de estado si se instrumenta una prueba técnica.
14. B vuelve hacia A: la conexión puede renegociarse y tardar un momento; la voz vuelve a escucharse.
15. A entra al Congreso y B permanece afuera. En PROXIMITY no deben escucharse. B entra al mismo Congreso y se acerca a A: vuelven a oírse. No basta con coordenadas internas similares de edificios distintos.
16. Ambos seleccionan **Partido**. Separarse ampliamente o entrar a edificios diferentes: deben escucharse por PARTY. Una persona del otro partido no debe aparecer como par habilitado.
17. Ambos vuelven a PROXIMITY: se restaura la restricción de distancia e interior. No se transmite a ambos canales simultáneamente.

## Controles de audio

18. En B, pulsar **Silenciar** junto a A: B deja de oírlo. A puede seguir oyendo a B si B habla. Pulsar **Escuchar** restaura recepción.
19. En A, pulsar **Mic OFF**: B deja de recibir su voz aunque A mantenga V. Volver a Mic ON.
20. En B, volumen 0: silencio. Volumen 50 y 100: niveles diferentes.
21. Cambiar PTT de V a B. V ya no transmite; B sí. Escribir esa letra dentro de un campo de texto no debe activar PTT.
22. Mientras A mantiene PTT, cambiar de ventana: debe dejar de transmitir. Soltar la tecla y volver a probar.
23. Desactivar PTT: probar micrófono abierto. Volver a activarlo al terminar.
24. En una sesión nueva de B, denegar permiso de micrófono. Debe aparecer aviso y continuar el juego sin bloquear movimiento ni acciones.

## Congreso y radios

25. Ambos entran al Congreso, ciudadanos libres, y eligen **Congreso · turnos**. A mantiene PTT: el servidor le concede el turno. Mientras A lo mantiene, B no debe abrir su audio al intentar hablar. Al soltar A, B vuelve a pulsar PTT y obtiene el turno. Es una base de turnos; todavía no hay presidencia de sesión, cola ni moderador.
26. Un civil que selecciona radio policial/bomberos/médica debe recibir rechazo; no debe permanecer transmitiendo en el canal anterior por error.
27. Para probar radios autorizadas, dos ciudadanos deben obtener el rol correspondiente mediante capacitación y empleo en el juego. Ambos eligen la radio; deben oírse a distancia. Médico y enfermero comparten MEDICAL. No probar dos roles distintos como si fueran el mismo canal.

## Política y mundo compartidos

28. Durante campaña, A y B realizan actos acercándose al micrófono físico de la plaza/Congreso. Comparan el alcance y calendario en Elecciones.
29. En días de urnas, ambos se acercan a la urna del hall del Congreso y votan. Un segundo voto del mismo ciudadano debe rechazarse.
30. Tras el escrutinio, ambos comparan Presidente, Juez, resultados y composición del Congreso: deben coincidir.
31. El autor presenta una ley junto al atril. Tras comisión/votación, el Presidente electo se acerca a su escritorio y promulga o veta. Si gana una fórmula bot, esa decisión es del bot; no se puede tomar su identidad.
32. Ambos revisan la misma ley y política. En el mercado, A agrega un producto al carrito y paga junto a caja: pierde dinero y recibe producto una vez. B ve el stock compartido, no el inventario privado de A.
33. Ambos entran a El Potrero. A inicia práctica. B ve la misma pelota. A remata: ambos ven el mismo gol y marcador. B no puede reiniciar el partido en marcha.
34. **Solo sala de prueba:** A obtiene equipo en el armario de la comisaría y equipa pistola. En un lugar despejado, dispara hacia B. Ambos deben observar el mismo daño y causa; no usar esta prueba para certificar equilibrio competitivo.
35. **Prueba ampliada con suficientes participantes/roles:** un policía detiene al acusado de una causa fundada desde el puesto policial; el Juez electo, distinto del acusado, acude al Tribunal y resuelve. Proximidad permite oírse en la audiencia si están cerca. Una condena coloca al acusado en una celda compartida hasta que cumpla la pena.

## Recuperación y redes distintas

36. Recargar la pestaña de A y pulsar **Reconectar a mi ciudadano**: recupera el mismo actor, no dinero inicial nuevo. B ve su vuelta. No cerrar definitivamente la sesión/pestaña si es necesario conservar la credencial.
37. Reiniciar ordenadamente el servidor con `STATE_DIR` en disco persistente; reconectar desde ambas pestañas conservadas y comprobar economía y cargos. En lobby deberán confirmar READY nuevamente.
38. Con TURN configurado, repetir lobby, proximidad y micrófono usando dos redes diferentes (por ejemplo, una conexión móvil). Con `VOICE_RELAY_ONLY=true`, comprobar en el diagnóstico WebRTC del navegador que el candidato seleccionado es `relay` y que se escucha audio en ambos sentidos.

## Registro de aceptación

Crear una copia y completar; todos los casilleros comienzan pendientes.

| Área | A / B / evidencia | Resultado |
|---|---|---|
| Fecha, URL, navegadores, equipos y redes | — | Pendiente |
| Lobby: voz A→B y B→A escuchada | — | Pendiente |
| Mundo: movimiento mutuo | — | Pendiente |
| Cerca / lejos / distinto interior | — | Pendiente |
| PARTY a distancia | — | Pendiente |
| Mute, mic off, volumen, PTT y permiso denegado | — | Pendiente |
| Congreso: turno de palabra | — | Pendiente |
| Radios: permiso por rol | — | Pendiente |
| Resultado electoral y ley iguales | — | Pendiente |
| Mercado, daño, justicia y gol compartidos | — | Pendiente |
| Reconexión y reinicio con disco | — | Pendiente |
| Audio por TURN entre redes diferentes | — | Pendiente |

No adjuntar tokens, credenciales, contenido de `.env` ni secretos TURN al registro de prueba.
