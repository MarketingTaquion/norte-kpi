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
`group` es `"Setup"` (4 etapas) o `"Comunidad"` (3 etapas) — se usa solo para
agrupar visualmente, el routing real por SOP lo decide la plataforma elegida,
no la etapa (ver [reference: schema de salida](prompts-output-schema.md),
campo `sop`).

## `src/data/platforms.js` — `PLATFORM_GROUPS`

3 grupos de plataformas, cada uno `{ group, sop, items: [{ value, label }] }`:

| Grupo | SOP asociado | Cantidad de plataformas |
|---|---|---|
| Paid / Ads | SOP Ignite | 7 |
| Orgánico / Social | SOP Comunidad | 6 |
| Otros | SOP Setup | 3 |

El campo `sop` de cada grupo es documental (para quien lee el código); el
routing real de SOP lo hace la IA dentro del prompt, no el frontend.

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

El campo `dias` no se usa hoy para ningún cálculo automático en el frontend
(el pacing en 4 bloques lo calcula la IA a partir de la etiqueta) — queda
disponible para cuando se implemente pacing calculado en cliente.
