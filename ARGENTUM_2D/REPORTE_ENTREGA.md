# Entrega ARGENTUM 2D 3.1.0 — 15/09/2026

VERSIÓN JUGABLE: SÍ, ejecución local verificada automáticamente; no certificación manual de navegador.
BUILD/ZIP: ARGENTUM_2D_v3_online.zip; versión 3.1.0, fuentes/build/servidor/historial.
CÓMO EJECUTAR: Node 24; npm ci; npm run build; npm start; abrir http://localhost:3000. En Windows: INICIAR_ARGENTUM.cmd.
ÚLTIMO PUNTO FUNCIONAL: gobierno y promesas visibles/sincronizados; impuesto enmendado aplicado a compra.
TESTS: 43/43; build y npm start verificados.
MULTIPLAYER ONLINE: cuatro clientes reales por WebSocket en loopback; dos interfaces fuente conectadas. WAN pendiente.
SERVIDOR PÚBLICO: no desplegado. Railway conectado, sin proyectos; necesita repositorio GitHub confirmado.
ENDPOINT: local http://localhost:3000, /ws, /healthz. Sin URL pública.
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
QUÉ QUEDÓ PARCIAL: hosting, TURN/voz WAN, catálogo/presupuesto integral, justicia constitucional y expansión del mundo.
BUGS CONOCIDOS: sin recuperación de identidad al borrar sessionStorage ni sucesión del anfitrión; límites P2P de voz; no entrada tardía. Sin fallos críticos observados en pruebas.
QUÉ FALTA: repositorio GitHub accesible para Railway; despliegue/persistencia pública y prueba humana de dos redes/micrófonos.
ÚLTIMO COMMIT: consultar COMMIT_ENTREGA.txt del ZIP; historial completo en HISTORIAL.bundle.
PRÓXIMA ACCIÓN EXACTA: conectar GitHub y confirmar propietario/repositorio; publicar este checkpoint y ejecutar RAILWAY_DESPLIEGUE.md.

Detalle exacto, límites, archivos y pruebas: CONTINUAR_AQUI.md.
