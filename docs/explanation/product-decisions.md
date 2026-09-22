# Por qué el Seteador es un wizard

## Wizard de 7 pasos

El Seteador arranca cada estimación como un flujo guiado paso a paso
(cliente → etapa → período → presupuesto → plataformas → pedidos + NSM →
revisión), en vez de un formulario largo con todos los campos a la vista.

Cada estimación es, en la práctica, **una cotización nueva**: el Estratega o
AM la arma desde cero para un cliente y un momento específicos, y quiere
llegar al final con confianza de que no se saltó nada antes de pedirle a la
IA que genere el número. Un wizard con progreso visible y validación por paso
sirve mejor a esa necesidad que un formulario largo donde es fácil dejar un
campo relevante vacío sin darse cuenta.

Al terminar, la pantalla se reemplaza completamente por el resultado (ancho
completo, sin el formulario al lado) con un botón **+ Nueva estimación** que
resetea el wizard al paso 1 — ver
[`SetterTab.jsx`](../../src/components/setter/SetterTab.jsx). Esto también es
deliberado: la estimación anterior no queda "compitiendo" visualmente con la
posibilidad de armar una nueva.

Esta fue una decisión explícita tomada con el equipo al construir la v1, no
un default por falta de tiempo — si en algún momento el Seteador necesita
soportar un flujo distinto (por ejemplo, editar una estimación ya generada en
vez de arrancar siempre desde cero), vale la pena reabrir esta decisión.
