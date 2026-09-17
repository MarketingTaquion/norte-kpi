# API pública

Dos endpoints para que herramientas externas (n8n, un CRM, un backend propio)
generen una estimación o auditen un KPI sin pasar por el wizard del browser.
Son públicos en el sentido de "alcanzables desde internet", pero requieren
autenticación — no son lo mismo que la Netlify Function interna del wizard
(ver [reference: Netlify Function `claude.js`](netlify-function.md), que no
requiere key porque solo la llama el propio frontend).

## Auth

Todas las requests necesitan el header:

```
X-Api-Key: <NORTE_API_KEY>
```

`NORTE_API_KEY` es una key propia de Norte-kpi (no la de Anthropic), cargada
en Netlify → Project configuration → Environment variables. Es una sola key
compartida para todas las integraciones en v1 — no hay keys por integración
todavía (ver `docs/SPEC.md`, roadmap).

Sin el header, o con un valor que no matchea: `401`.
Si `NORTE_API_KEY` no está configurada en el sitio: `500` (la API queda
deshabilitada hasta que se cargue, no falla en modo abierto).

## `POST /api/kpi-estimate`

Genera una estimación de KPIs — el mismo resultado que produce el wizard del
Seteador al llegar al paso 7, sin la interacción paso a paso.

Función real: [`netlify/functions/kpi-estimate.js`](../../netlify/functions/kpi-estimate.js).
Prompt: [`SETTER_SYSTEM_PROMPT`](../../src/prompts/setter.js) — ver
[schema de salida completo](prompts-output-schema.md#seteador--setter_system_prompt).

### Request

```
POST /api/kpi-estimate
Content-Type: application/json
X-Api-Key: <NORTE_API_KEY>
```

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `cliente` | `string` | **Sí** | Nombre libre, no necesita matchear `src/data/clients.js` |
| `pedidos` | `string[]` | **Sí** (mín. 1 no vacío) | Pedidos en lenguaje coloquial |
| `etapas` | `string[]` | No | Values de [`STAGES`](configuration-data.md#srcdatastagesjs--stages) (ej. `"comunidad-captacion"`) |
| `periodo` | `{ lapso: string }` \| `{ desde: string, hasta: string }` | No | `lapso` es un value de [`LAPSOS`](configuration-data.md#srcdatalapsosjs--lapsos) (ej. `"mes-1"`); `desde`/`hasta` son fechas `YYYY-MM-DD` |
| `presupuesto` | `number` | No | Bruto. Si se omite, la IA genera rangos referenciales sin Tax Check |
| `moneda` | `"ARS"` \| `"USD"` | No | Default `"ARS"` |
| `plataformas` | `string[]` | No | Values de [`PLATFORM_GROUPS`](configuration-data.md#srcdataplatformsjs--platform_groups) (ej. `"meta-ads"`) |
| `nsm` | `string` | No | North Star Metric declarada; si se omite, la IA la infiere |

Ejemplo:

```json
{
  "cliente": "Acme SRL",
  "pedidos": ["Quiero más leads calificados para el equipo comercial"],
  "etapas": ["comunidad-captacion"],
  "periodo": { "lapso": "mes-1" },
  "presupuesto": 1000000,
  "moneda": "ARS",
  "plataformas": ["meta-ads", "google-ads"]
}
```

### Response `200`

El mismo JSON que consume `SetterResult.jsx` — ver
[schema completo](prompts-output-schema.md#seteador--setter_system_prompt).
`tax_check` viene **recalculado en código** a partir de `presupuesto` (no es
el número crudo que devolvió la IA — ver
[explanation: motor de cálculo](../explanation/calculation-engine.md)).

### Errores

| Status | Causa |
|---|---|
| `405` | Método distinto de `POST` |
| `401` / `500` | Ver sección Auth |
| `400` | Body no es JSON válido |
| `422` | Falta `cliente` o `pedidos` (o `pedidos` está vacío) |
| `502` | Falló la llamada a Anthropic, o la IA no devolvió JSON parseable (`raw` trae el texto crudo para debug) |

## `POST /api/kpi-evaluate`

Audita un KPI ya redactado — el mismo resultado que produce el formulario del
Evaluador.

Función real: [`netlify/functions/kpi-evaluate.js`](../../netlify/functions/kpi-evaluate.js).
Prompt: [`EVALUATOR_SYSTEM_PROMPT`](../../src/prompts/evaluator.js) — ver
[schema de salida completo](prompts-output-schema.md#evaluador--evaluator_system_prompt).

### Request

```
POST /api/kpi-evaluate
Content-Type: application/json
X-Api-Key: <NORTE_API_KEY>
```

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `accion` | `string` | **Sí** | El verbo del KPI (Captar, Lograr, Reducir, Mantener) |
| `indicador` | `string` | **Sí** | La métrica con número concreto (ej. "500 leads") |
| `segmento` | `string` | **Sí** | A quién apunta el KPI |
| `cliente` | `string` | No | Solo contexto, no afecta la lógica de auditoría |
| `plataformas` | `string[]` | No | Values de [`PLATFORM_GROUPS`](configuration-data.md#srcdataplatformsjs--platform_groups) |
| `alcanzable` | `string` | No | Evidencia de alcanzabilidad |
| `periodo` | `{ lapso: string }` \| `{ desde, hasta }` | No | Si se omite, el veredicto puede ser `CONDICIONADO` |
| `presupuesto` | `number` | No | Bruto. Sin esto, el veredicto no puede ser `RECHAZADO_INVIABILIDAD` |
| `moneda` | `"ARS"` \| `"USD"` | No | Default `"ARS"` |
| `cpcCpaRef` / `cpmRef` | `string` | No | Datos históricos para calibrar viabilidad |
| `contexto` | `string` | No | Estacionalidad, competencia, restricciones |

Ejemplo:

```json
{
  "accion": "Captar",
  "indicador": "500 leads calificados",
  "segmento": "Dueños de PyMEs, 35-55 años, CABA",
  "periodo": { "lapso": "mes-1" },
  "presupuesto": 1000000,
  "plataformas": ["meta-ads"]
}
```

### Response `200`

El mismo JSON que consume `EvaluatorResult.jsx` — ver
[schema completo](prompts-output-schema.md#evaluador--evaluator_system_prompt).
Si se envió `presupuesto`, `viabilidad.presupuesto_bruto`,
`viabilidad.presupuesto_neto` y `viabilidad.superavit_deficit` vienen
recalculados en código, no son el número crudo de la IA.

### Errores

Mismos códigos que `/api/kpi-estimate`, salvo el `422`: acá dispara si falta
`accion`, `indicador` o `segmento`.

## Ver también

- [How-to: integrar una herramienta externa](../how-to/integrate-external-tool.md) — ejemplos con `curl` y n8n.
- [Variables de entorno](environment-variables.md) — cómo cargar `NORTE_API_KEY`.
