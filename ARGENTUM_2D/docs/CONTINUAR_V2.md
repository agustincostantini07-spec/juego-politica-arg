# ARGENTUM 2D — ESTADO

Actualizado: 15 de septiembre de 2026. Edición 2.0, vertical slice local. Se retomó el código existente; no se reinició el proyecto.

## TECNOLOGÍA

JavaScript sin framework de ejecución, Canvas 2D y CSS. HTML autosuficiente, sin recursos de red. Construcción con Python 3.12.14; pruebas con Node 24.19.0 y `@napi-rs/canvas` 0.1.100 como dependencia de desarrollo. No hay Unity, escenas `.unity` ni prefabs.

## CÓMO EJECUTAR

Extraer el ZIP y abrir `ARGENTUM_2D.html` en un navegador de escritorio. No instalar dependencias para jugar. Para reconstruir: `python3 build.py`. Para probar reglas: `node --test tests/v2.test.cjs tests/accessibility.test.cjs`. Para controles simulados: `node --test tests/controls.test.cjs` con la dependencia Canvas instalada. `npm test` ejecuta toda la suite.

## ESCENA/PUNTO DE ENTRADA

`ARGENTUM_2D.html` → `src/ui.js` → lobby. Escenario de prueba preparado con tres partidos y seis participantes: anfitrión, compañero local y cuatro bots. El selector superior alterna el personaje local controlado. No implica conexión online.

## QUÉ ES VISIBLE

Ciudad compacta continental, dos barrios con diez unidades cada uno, instituciones y cancha. Cada edificio dispone de geometría interior, paredes, puertas, muebles, personajes y puntos de interacción. Teléfono y paneles políticos complementan la vista Canvas.

## QUÉ ES JUGABLE

El código y los controles fueron ejercitados con un arnés automatizado de DOM y Canvas, sin navegador. Se verificó: formar tres partidos, comenzar campaña sin cargos, caminar al Congreso, entrar, abrir puerta y llegar al atril; campaña, urna, elección, cambio al Presidente electo, presentación y promulgación de ley, economía, guardado/carga; supermercado con góndolas y caja; cancha con conducción, remate y gol; equipo de prueba con disparo, daño y causa.

NO se completó una partida manual en navegador. La política del navegador remoto bloqueó localhost y el HTML local. No volver a insistir sobre esa vía ni describir pruebas del motor como pruebas manuales.

## SISTEMAS TERMINADOS

A nivel de vertical slice local y pruebas automatizadas: identidad y cuentas por actor; lobby y fórmulas exactas; flujo campaña/urna/escrutinio/gobierno; bancas proporcionales; ley tributaria con consecuencia; compras atómicas; guardado formato 2; física de puertas y mobiliario; impulso de pelota y gol; impacto, salud y causa judicial. No se declara terminado el producto completo ni su validación visual de navegador.

## SISTEMAS PARCIALES

| Sistema | Funciona | Falta / límite | Archivos | Siguiente acción |
|---|---|---|---|---|
| Multijugador | Varios actores, control local alternado, estado compartido, comandos con actor/revisión/id | Sin transporte, autenticación ni servidor | engine.js, lobby.js | Diseñar transporte solo tras aceptación del slice |
| Política | Fórmulas, bancas, enmiendas, orientación de bloque, ley/veto/insistencia | Diplomacia compleja, ministros, Senado | lobby.js, engine.js, ui.js | Revisar equilibrio de coaliciones |
| Justicia | Causas, prueba, juez independiente, sentencia y celdas | Procedimiento abstracto; sin apelación ni defensa libre | engine.js, physical.js | Revisar experiencia del juez humano |
| Economía | Cuentas, impuestos, salarios, stock, caja, consumo y sectores | Modelo agregado, inversión y banco central sin acciones propias | engine.js | Ajustar balance con partidas extensas |
| Mundo | Interiores, colisiones, puertas, asientos, muebles | Animaciones y arte simples, sin vehículos conducibles | interiors.js, world.js | QA manual de movimiento y cámara |
| Fútbol | Práctica, bots, pase/remate, goles, tiempo y final | IA y arquero básicos; sin atajadas manuales | physical.js, world.js | Probar sensaciones y balance |
| Salud / bomberos | Profesiones simplificadas, atención, eventos y extintores | Sin simulación clínica ni propagación de fuego | engine.js, physical.js | Ampliar actividades de servicio |
| Interfaz | Pantallas y acciones verificadas sin navegador | Layout CSS y compatibilidad real pendientes | ui.js, style.css | QA en navegador permitido |

## LOBBY

Crear/renombrar/retirar participantes; crear/eliminar fórmulas; asignar slots; READY validado. No comienza con participantes sin partido ni fórmulas incompletas. Permite añadir fórmulas completas con bots. Configura 5–100 bancas, 3–30 días de campaña y mandatos de 30–180 días.

## PARTIDOS

Exactamente dos miembros distintos al comenzar: candidatura presidencial y candidatura judicial. Nadie puede estar en dos fórmulas. Nombre, sigla, color y seis dimensiones de plataforma. No se crean partidos de un integrante durante la partida.

## CAMPAÑA

Se realiza junto al micrófono de Plaza, del Congreso o de un negocio. Tiene costo y límite diario por actor. Afecta alcance y votos junto con ideología, sociedad y gobierno. Los actos y debates usan un mecanismo común simplificado.

## ELECCIONES

Por defecto urnas días 8–9 y escrutinio día 10. Participantes locales votan una vez en urna física; bots aportan su voto. Electorado agregado completa padrón de 10.000, con abstenciones de participantes. Bancas por cuotas y mayores restos. Respeta límite de reelección para el candidato vigente. Encuestas con margen y variación, sin revelar el resultado.

## PRESIDENTE/JUEZ

Se asignan por fórmula ganadora tras escrutinio. Método `WINNING_TICKET` aislado en el sistema electoral; otros métodos todavía no implementados. Facultades verificadas por actor. El Presidente no puede resolver casos como juez; no se obtiene JUDGE mediante empleo. Recusación simplificada para la causa del propio juez.

## CONGRESO

Bancas NPC, configurables, con quórum y mayoría. El partido ganador puede quedar en minoría. Las enmiendas cambian posiciones; orientar el bloque influye, sin dar votos gratuitos. Los puestos de proyecto, promulgación y justicia exigen proximidad física.

## LEYES

Consumo, salud, seguridad, pena máxima y regulación de armas. Flujo comisión → voto nominal → Ejecutivo → vigencia. Veto y reconsideración por dos tercios. Las leyes cambian variables de juego; la regulación nivel 2 genera una causa por uso civil aun sin impacto.

## ECONOMÍA

100.000 Argentums iniciales por participante. Contabilidad entre cuentas, caja estatal, población, comercio y proveedores. Dinero conservado. Precios sensibles a índice general, escasez, impuesto y margen. Déficit/deuda, actividad, empleo, servicios y confianza evolucionan con el calendario.

## OPINIÓN PÚBLICA

Siete grupos con pesos y prioridades. La aprobación se deriva de empleo/precios, salud, seguridad y confianza. Puede aparecer protesta. Sin asignar bondad o maldad a ideologías reales.

## MUNDO FÍSICO

WASD, Shift, clic para recorrido y E para interacción. El calendario puede estar pausado mientras se recorre el mundo. Los paneles pausan física y calendario automático. Objetos soltados se recuperan cerca. Hay actores con salud e interacción breve; otros peatones y vehículos son ambientación.

## INTERIORES

Congreso, Tribunal, Comisaría, Cárcel, Hospital, Bomberos, Mercado, 20 viviendas/locales, Plaza y Cancha. Geometría data-driven y transiciones. Se validó por búsqueda de recorridos que los puestos requeridos son accesibles con puertas abiertas. Las celdas ocupadas permanecen bloqueadas. Los asientos se ocupan físicamente y restauran posición al levantarse.

## INVENTARIO

Cinco accesos rápidos de productos, armas adicionales, stacks, uso, soltar/recoger y depósito. Góndolas agregan al carrito y caja transfiere stock/dinero/impuesto de forma atómica. El local propio repone, vende según demanda, cobra y permite retirar caja.

## ARMAS

Kit de prueba una vez por actor en armario. Pistola: seis disparos por cargador, 18 de reserva, recarga, proyectil e impacto de 28. Arma corta: alcance limitado y daño de 18. Sin gore. Las armas se dibujan equipadas; soltar la equipada deja la mano vacía.

## CRIMEN/JUSTICIA

Impacto crea causa con víctima/autor/evidencia. Investigación, detención, juicio, absolución o condena. Traslados a espacios físicos; movimiento restringido a custodia/celda. Juez humano local resuelve en el Tribunal; bot resuelve al avanzar tiempo. Se libera al cumplir condena y desaparece del listado de detenidos actuales.

## FÚTBOL

Cancha transitable con pelota persistente, velocidad, fricción, rebote, controles de pase/remate y conducción por proximidad. Práctica o partido con bots. Equipos A/B, 120 segundos, gol, pausa de reinicio y final. Verificado gol mediante movimiento y controles, sin comando para sumar puntos.

## SAVE/LOAD

Formato 2 guarda todo el estado compartido, actores, cargos, partidos, bancas, leyes, economía, puertas, celdas, pelota y proyectiles. Importación valida versión, participantes, cuentas, inventarios, políticas, fases y estados. Rechaza archivos corruptos de los casos ensayados sin reemplazar la partida activa. No carga formato 1.

## ERRORES

25 pruebas actuales pasan; resultados en RESULTADOS_TESTS.txt. No hubo excepciones en los paneles ensayados con el arnés. No se verificó consola de navegador real ni layout CSS. No se declaran inexistentes errores no observados. El navegador de esta sesión rechazó archivos locales por política de seguridad. La compilación del HTML sí finalizó.

## ARCHIVOS IMPORTANTES

- ARGENTUM_2D.html: juego autosuficiente.
- src/data.js: contenido y reglas iniciales.
- src/lobby.js: parejas, preparación, escrutinio y cargos.
- src/engine.js: simulación, economía, política, acciones y guardado.
- src/interiors.js: espacios y colisiones.
- src/physical.js: movimiento, fútbol, combate y traslados.
- src/world.js: renderer Canvas y rutas.
- src/ui.js, src/style.css, src/shell.html: controles y presentación.
- tests/v2.test.cjs, controls.test.cjs, accessibility.test.cjs: validación.
- tests/source-runtime.cjs: arnés sin navegador; no confundir con QA manual.
- DISENO_OFICIAL_V2.txt / REANUDACION_OFICIAL_V2.txt: pedidos preservados.
- README.md / REPORTE_ENTREGA.md: ejecución, límites y evidencia.

## ÚLTIMO COMMIT

Checkpoint inicial: `6f6db51` — Playable local political slice with physical interiors and actor-based state. El hash exacto del commit de entrega se escribe en `COMMIT_ENTREGA.txt`, generado después del commit. El ZIP contiene `HISTORIAL.bundle` para recuperar la historia Git. No hay remoto GitHub conectado ni despliegue.

## PRÓXIMA PRIORIDAD

Validar manualmente en un navegador permitido el recorrido de la entrega, sin añadir sistemas nuevos antes de resolver defectos observados de interacción/layout.

## PRIMERA ACCIÓN DE LA PRÓXIMA SESIÓN

Leer este archivo, ejecutar `npm test` si cambiaron los archivos y abrir el HTML en un navegador cuyo acceso esté permitido. Elegir «Preparar prueba de 6 participantes» y seguir README. Si el navegador vuelve a bloquear archivos locales, documentar el límite y no insistir por rutas alternativas para evadirlo. El proyecto y las pruebas no requieren volver a construirse desde cero.
