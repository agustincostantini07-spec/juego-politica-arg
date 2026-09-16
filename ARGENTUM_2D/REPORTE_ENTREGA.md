# Entrega ARGENTUM 2D 3.1.0 — 16/09/2026

VERSIÓN JUGABLE: SÍ, local y pública; dos pestañas de navegador reales verificadas.
BUILD/ZIP: ARGENTUM_2D_v3_online.zip; versión 3.1.0, fuentes/build/servidor/historial.
CÓMO EJECUTAR: Node 24; npm ci; npm run build; npm start; abrir http://localhost:3000. En Windows: INICIAR_ARGENTUM.cmd.
ÚLTIMO PUNTO FUNCIONAL: gobierno y promesas visibles/sincronizados; impuesto enmendado aplicado a compra.
TESTS: 43/43; build y npm start verificados.
MULTIPLAYER ONLINE: cuatro clientes locales más dos pestañas reales sobre WSS público; dos hogares pendientes.
SERVIDOR PÚBLICO: Railway activo, deployment SUCCESS 9c4fdcc4-b6a4-422a-8993-2ee45338aa1d.
ENDPOINT: https://argentum-2d-production.up.railway.app/ ; WSS /ws, salud /healthz.
CÓMO CREAR PARTIDA: Crear partida; nombre; modo de prueba si se necesitan fórmulas bot.
CÓMO UNIRSE: mismo servidor y código de sala en otro navegador/perfil; cada jugador confirma su candidatura/READY.
CHAT DE VOZ: WebRTC implementado; pruebas de API y señalización, sin escucha humana ni TURN real.
PROXIMITY VOICE: rango, atenuación y separación de escenas implementados; aceptación acústica pendiente.
POLÍTICA: partidos de dos, campaña, promesas, elecciones, Presidente/Juez separados y bancas sistémicas.
MEDIDAS DE GOBIERNO: cuatro medidas con costo, demora, duración y efectos sobre sistemas; UI y ejecución presupuestaria.
CONGRESO: proyecto, negociación/enmienda con versiones, voto, promulgación/veto. Apoyos anteriores se limpian al enmendar.
ECONOMÍA: transacciones y recaudación, actividad, empleo, precios, gasto, deuda y opinión; medidas integradas.
JUEZ/JUSTICIA: facultades separadas y loop penal existente; control constitucional pendiente.
MUNDO FÍSICO: ciudad y desplazamiento compartidos conservados.
INTERIORES: instituciones y casa+negocio físicos conservados.
ARMAS/CRIMEN: daño, causas, detención, juicio/celdas/liberación conservados y probados.
FÚTBOL: pelota, bots, goles, reloj y marcador compartidos; equipos humanos completos pendientes.
QUÉ QUEDÓ PARCIAL: persistencia tras reinicio, TURN/voz WAN, catálogo/presupuesto integral, justicia constitucional y expansión del mundo.
BUGS CONOCIDOS: sin recuperación de identidad al borrar sessionStorage ni sucesión del anfitrión; límites P2P de voz; no entrada tardía. Sin fallos críticos observados en pruebas.
QUÉ FALTA: autorizar reinicio para verificar persistencia; TURN y prueba humana de dos redes/micrófonos.
ÚLTIMO COMMIT: consultar COMMIT_ENTREGA.txt del ZIP; historial completo en HISTORIAL.bundle.
PRÓXIMA ACCIÓN EXACTA: autorizar un reinicio del servicio público para comprobar que la partida se recupera; revisión automática rechazó esa acción por posible interrupción de jugadores.

Detalle exacto, límites, archivos y pruebas: CONTINUAR_AQUI.md.

Código publicado en GitHub: de2c00deba98694e296d067bd885f83922f3af74. No se cambió el plan existente de Railway. Carpeta de datos observada; montaje persistente aún no certificado. Footer 3.0 pendiente cosmético en código 3.1.
