# Datos de configuración

Cuatro archivos en `src/data/` alimentan las opciones del wizard del
Seteador. Son arrays estáticos en JS, sin backend ni base de
datos detrás — editarlos y redeployar es el único mecanismo para cambiarlos.

## `src/data/clients.js` — `DEFAULT_CLIENTS`

Lista base de clientes. Cada item: `{ value, label, description }`.

El usuario puede agregar clientes nuevos **en sesión** desde el wizard (Paso 1
del Seteador), vía `addClient()` en
[`useSetterForm.js`](../../src/hooks/useSetterForm.js) — esos clientes
agregados a mano **no persisten**: viven solo en el estado de React y
desaparecen al refrescar la página. No hay persistencia de clientes hoy (ver
roadmap en [`docs/SPEC.md`](../SPEC.md)).

## `src/data/stages.js` — `STAGES`

4 etapas de proyecto, cada una con `{ value, label, description, group }`.
`group` es `"Setup"` (3 etapas) o `"Comunidad"` (1 etapa) — se usa para
agrupar visualmente, y además **fuerza el SOP a "SOP Setup"** en la
calculadora si hay alguna etapa "Setup · ..." seleccionada (ver
`setupForzado` en
[`setterCalculator.js`](../../src/lib/calculator/setterCalculator.js)). El
routing por defecto, sin esa etapa, lo decide la categoría detectada en el
texto del pedido — ver [reference: calculadora](calculator.md).

## `src/data/platforms.js` — `PLATFORM_GROUPS`

3 grupos de plataformas, cada uno `{ group, sop, items: [{ value, label }] }`:

| Grupo | SOP asociado | Cantidad de plataformas |
|---|---|---|
| Paid / Ads | SOP Ignite | 7 |
| Orgánico / Social | SOP Comunidad | 6 |
| Otros | SOP Setup | 3 |

El campo `sop` de cada grupo es **documental** (para quien lee el código):
la calculadora no lo lee para decidir el SOP de un KPI — eso lo decide la
categoría del pedido (`kpiCatalog.js`) y la etapa Setup forzada, no qué
plataforma esté tildada. Las plataformas seleccionadas sí se usan para otra
cosa: elegir la `fuente_verdad` de cada KPI (`fuenteDeVerdad()` en
`kpiCatalog.js`).

## `src/data/lapsos.js` — `LAPSOS`

Un único lapso predefinido, `{ value, label, dias }`:

| value | label | días |
|---|---|---|
| `temporada-1` | 9 meses · Temporada 1 | 270 |

Representa la Temporada 1 del playbook de producto "Comunidad" (9 meses).
El campo `dias` **sí se usa** para calcular el pacing: `diasDelPeriodo()` en
`setterCalculator.js` lo lee para ubicar cada bloque de 25/50/75/100% en un
día concreto del período. El otro modo del selector de período ("Fechas
custom") sigue disponible para proyectar cualquier rango de fechas fuera de
este ciclo.

## `src/data/comunidadPlaybook.js` — `COMUNIDAD_PLAYBOOK_STAGES`

Las 5 etapas del recorrido del playbook de Comunidad dentro de la
Temporada 1 — Detectar → Entender → Diseñar → Activar → Crecer, cada una
`{ name, goal, dur }`. Se muestran como contexto informativo en el paso
"¿Qué período vamos a proyectar?" del wizard (`PeriodPicker.jsx`) — no
alimentan ningún cálculo, son puramente explicativas.
