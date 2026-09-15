# Entrega ARGENTUM 2D · 2.0

Se continuó la versión existente y se completó un vertical slice local con seis participantes de prueba. No se reinició el proyecto. La entrega contiene un HTML autosuficiente, fuentes, instrucciones, pruebas, estado de continuación e historial Git.

## Cadenas verificadas

1. Lobby → tres fórmulas exactas → READY → campaña física → urnas → resultado → Presidente/Juez → bancas → proyecto → votación → promulgación → impuesto → economía/opinión → guardar/cargar.
2. Ciudad → puerta → interior → puerta interna → atril → salida.
3. Mercado → góndola → carrito → caja → stock/inventario/dinero/impuesto.
4. Cancha → práctica → conducción → remate → gol.
5. Comisaría → equipo → inventario → disparo → daño → causa.
6. Delito → detención → Tribunal → celda bloqueada → cumplimiento → liberación.

## Evidencia y alcance de las pruebas

25 pruebas automatizadas aprobadas: 18 del motor, seis de controles con DOM simulado y una de accesibilidad física de interiores. Los controles usan los mismos manejadores y rutas del código entregado. Se inspeccionaron imágenes producidas por el renderer Canvas de ciudad, Congreso y cancha fuera del navegador. No son capturas de una partida manual.

No se completó QA manual ni de CSS en navegador real: la política de seguridad del navegador remoto bloqueó el HTML local. Los resultados no deben presentarse como una consola de navegador limpia o una partida manual terminada.

## Correcciones concretas

- Cargos y transacciones asociados al actor controlado, no a un ID fijo.
- Cargos vacantes antes de la elección y fórmulas de dos integrantes.
- Mandatos y bancas configurables; validación con 100 bancas.
- Proyectos, pagos y decisiones requieren puestos físicos.
- Supermercado integrado por carrito y caja.
- Puertas no se cierran sobre actores; asientos ocupables.
- Arma soltada se desequipa; cargador y reserva conservados.
- Carga corrupta rechazada sin perder la partida vigente.
- Pruebas obsoletas de v1 retiradas; se conserva respaldo independiente de v1.

## Parcial y no iniciado

Juego local alternado con bots; no es multijugador online. No hay servidor, autenticación, sincronización de red, conducción, Senado, ministros, reforma constitucional, diálogos libres ni audio ambiental. La economía y los procesos legales son modelos de juego simplificados. IA de fútbol y arte requieren más trabajo de producción. Método judicial alternativo preparado como punto de extensión, no implementado.

## Cómo continuar

La prioridad es una prueba manual en navegador permitido, siguiendo README, y corregir los problemas concretos encontrados. No volver a intentar accesos bloqueados por política. El estado técnico completo está en CONTINUAR_AQUI.md. Los commits locales se conservan en HISTORIAL.bundle y COMMIT_ENTREGA.txt; no se publicó en GitHub ni se desplegó un sitio.
