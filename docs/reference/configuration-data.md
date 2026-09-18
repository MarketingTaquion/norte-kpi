# Datos de configuración

Cuatro archivos en `src/data/` alimentan las opciones del wizard y del
formulario del Evaluador. Son arrays estáticos en JS, sin backend ni base de
datos detrás — editarlos y redeployar es el único mecanismo para cambiarlos.

## `src/data/clients.js` — `DEFAULT_CLIENTS`

Lista base de clientes. Cada item: `{ value, label, description }`.

El usuario puede agregar clientes nuevos **en sesión** desde el wizard (Paso 1
del Seteador y el select del Evaluador), vía `addClient()` en
[`useSetterForm.js`](../../src/hooks/useSetterForm.js) — esos clientes
agregados a mano **no persisten**: viven solo en el estado de React y
desaparecen al refrescar la página. No hay persistencia de clientes hoy (ver
roadmap en [`docs/SPEC.md`](../SPEC.md)).

## `src/data/stages.js` — `STAGES`

7 etapas de proyecto, cada una con `{ value, label, description, group }`.
`group` es `"Setup"` (4 etapas) o `"Comunidad"` (3 etapas) — se usa para
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

10 lapsos predefinidos, cada uno `{ value, label, dias }`:

| value | label | días |
|---|---|---|
| `semana-1` | Semana 1 | 7 |
| `semana-2` | Semana 2 | 14 |
| `quincena` | Quincena | 15 |
| `mes-1` | Mes 1 | 30 |
| `mes-2` | Mes 2 | 60 |
| `mes-3` | Mes 3 (trimestre) | 90 |
| `semestre-1` | Semestre 1 | 180 |
| `semestre-2` | Semestre 2 | 180 |
| `q4` | Último trimestre | 90 |
| `anio-completo` | Año completo | 365 |

El campo `dias` **sí se usa** para calcular el pacing: `diasDelPeriodo()` en
`setterCalculator.js`/`evaluatorCalculator.js` lo lee para ubicar cada
bloque de 25/50/75/100% en un día concreto del período (ej. "Día 8" para el
25% de un `mes-1`).
