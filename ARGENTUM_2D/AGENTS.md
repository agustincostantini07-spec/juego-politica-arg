# ARGENTUM 2D: reglas permanentes del proyecto

Leer CONTINUAR_AQUI.md antes de modificar el juego. Conservar el proyecto existente y la última build recuperable.

## Cierre seguro obligatorio (pedido por Hernán)

Al terminar una ejecución, ante poco presupuesto de ejecución conocido o riesgo de corte:
1. No empezar features nuevas. Cerrar de forma segura lo que se está modificando.
2. Corregir errores críticos de build/ejecución sin arriesgar sistemas funcionales.
3. Guardar archivos y generar una build jugable si es seguro.
4. Ejecutar el juego y comprobar apertura/jugabilidad mediante las capacidades permitidas. Informar exactamente el método; no llamar prueba manual de navegador a un harness ni audio escuchado a una prueba de API. No rodear bloqueos de herramientas.
5. Crear commit/checkpoint en GitHub si está disponible; si no, Git local y respaldo recuperable. Nunca incluir secretos.
6. Actualizar CONTINUAR_AQUI.md durante el trabajo y al cierre: terminado, realmente funcional, pruebas, parcial, bugs, servidor/multiplayer/voz exactos, última versión jugable, archivos, última modificación, siguiente prioridad y PRIMERA ACCIÓN EXACTA.
7. Conservar cualquier deployment funcional y documentar acceso. No sustituir una URL real por una promesa de despliegue.
8. Guardar una copia durable del proyecto y reporte, siguiendo las herramientas disponibles. No afirmar que se guardó sin resultado exitoso.

Prioridad absoluta de cierre: versión jugable y recuperable + reporte exacto. No afirmar que se conoce el saldo de créditos si la plataforma no lo expone.

Finalizar siempre con estos campos textuales y respuestas honestas:
VERSIÓN JUGABLE: SÍ/NO
ÚLTIMO PUNTO FUNCIONAL: ...
MULTIPLAYER ONLINE: ...
SERVIDOR: ...
CHAT DE VOZ: ...
POLÍTICA: ...
QUÉ FALTA: ...
PRÓXIMA ACCIÓN EXACTA: ...

## Alcance pendiente

ONLINE_REQUISITOS_V4.txt y POLITICA_REQUISITOS_V4.txt contienen pedidos nuevos completos. No tratarlos como implementados por estar copiados. La build base sigue siendo 3.0.0 hasta implementar/probar cambios reales. El usuario declinó Render; no volver a sugerirlo para el pedido actual. Priorizar capacidades disponibles y pedir solo intervención imprescindible de cuenta/credenciales/pago.
