# Por qué el Seteador es un wizard y el Evaluador no

## El Seteador: wizard de 7 pasos

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

## El Evaluador: formulario de una sola pantalla

El Evaluador se mantiene como un formulario split (form a la izquierda,
resultado a la derecha) — ver
[`EvaluatorTab.jsx`](../../src/components/evaluator/EvaluatorTab.jsx).

La razón es el tipo de tarea: auditar un KPI ya redactado es **una consulta
puntual**, no una cotización progresiva. Quien lo usa (el Líder de Ignite) ya
sabe exactamente qué KPI quiere auditar y con qué datos — no hay una secuencia
natural de "primero esto, después esto otro" que un wizard aporte valor
guiando. Convertirlo en wizard hubiera agregado fricción (más clics para
llegar al mismo resultado) sin ninguna ganancia de claridad.

Esta fue una decisión explícita tomada con el equipo al construir la v1, no
un default por falta de tiempo — si en algún momento el Evaluador gana pasos
adicionales (por ejemplo, un flujo de aprobación de varios KPIs en batch), vale
la pena reabrir esta decisión.

<!-- TODO(humano): si se agrega batch de KPIs al Evaluador (ver roadmap en
docs/SPEC.md), ¿sigue teniendo sentido un formulario único, o pasa a
justificar un wizard también? -->
