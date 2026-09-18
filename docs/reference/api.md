# API pública

Dos endpoints para que herramientas externas (n8n, un CRM, un backend propio)
generen una estimación o auditen un KPI sin pasar por el wizard del browser.
Corren la misma [calculadora determinística](calculator.md) que usa el
browser — nada de IA, nada de red hacia un tercero. Son públicos en el
sentido de "alcanzables desde internet", por eso requieren autenticación.

Cada endpoint tiene una implementación por plataforma de deploy, con
**contrato idéntico** (mismo request, misma response, mismos códigos de
error) — la diferencia es solo dónde vive el código:

| Plataforma | `kpi-estimate` | `kpi-evaluate` |
|---|---|---|
| Vercel (principal) | [`api/kpi-estimate.js`](../../api/kpi-estimate.js) | [`api/kpi-evaluate.js`](../../api/kpi-evaluate.js) |
| Netlify (secundaria) | [`netlify/functions/kpi-estimate.js`](../../netlify/functions/kpi-estimate.js) | [`netlify/functions/kpi-evaluate.js`](../../netlify/functions/kpi-evaluate.js) |

Ambas comparten la misma lógica de negocio desde
[`src/lib/calculator/`](../../src/lib/calculator/) — nada de esto está
duplicado entre plataformas, solo el archivo de entrada que Vercel/Netlify
esperan en su propia convención.

## Auth

Todas las requests necesitan el header:

```
X-Api-Key: <NORTE_API_KEY>
```

`NORTE_API_KEY` es una key propia de Norte-kpi, cargada en las Environment
Variables del proyecto en Vercel (o Netlify, si el deploy que estás llamando
es ese) — ver [deploy-to-vercel.md](../how-to/deploy-to-vercel.md). Protege
el endpoint de ser invocado por cualquiera que encuentre la URL — no protege
ninguna llamada a un tercero, porque no hay ninguna (ver
[explanation: arquitectura](../explanation/architecture.md)). Es una sola key
compartida para todas las integraciones en v1 — no hay keys por integración
todavía (ver `docs/SPEC.md`, roadmap).

Sin el header, o con un valor que no matchea: `401`.
Si `NORTE_API_KEY` no está configurada en el sitio: `500` (la API queda
deshabilitada hasta que se cargue, no falla en modo abierto).

## `POST /api/kpi-estimate`

Genera una estimación de KPIs — el mismo resultado que produce el wizard del
Seteador al llegar al paso 7, sin la interacción paso a paso.

Función real: [`api/kpi-estimate.js`](../../api/kpi-estimate.js) (Vercel) / [`netlify/functions/kpi-estimate.js`](../../netlify/functions/kpi-estimate.js) (Netlify).
Calcula con [`calculateSetterResult()`](../../src/lib/calculator/setterCalculator.js) — ver
[schema de salida completo](output-schema.md#seteador--calculatesetterresult).

### Request

```
POST /api/kpi-estimate
Content-Type: application/json
X-Api-Key: <NORTE_API_KEY>
```

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `cliente` | `string` | **Sí** | Nombre libre, no necesita matchear `src/data/clients.js` |
| `pedidos` | `string[]` \| `{ texto: string, categoria: string }[]` | **Sí** (mín. 1 no vacío) | Pedidos en lenguaje coloquial. El wizard siempre manda `{ texto, categoria }` — `categoria` es un value de [`CATEGORY_OPTIONS`](calculator.md) (ej. `"leads"`) y fija la fórmula/benchmark sin adivinar. Un string plano sigue soportado para integraciones que no manden `categoria` — se clasifica por keywords con `classifyText()` |
| `etapas` | `string[]` | No | Values de [`STAGES`](configuration-data.md#srcdatastagesjs--stages) (ej. `"comunidad-captacion"`) |
| `periodo` | `{ lapso: string }` \| `{ desde: string, hasta: string }` | No | `lapso` es un value de [`LAPSOS`](configuration-data.md#srcdatalapsosjs--lapsos) (ej. `"mes-1"`); `desde`/`hasta` son fechas `YYYY-MM-DD` |
| `presupuesto` | `number` | No | Bruto. Si se omite, se devuelven rangos de benchmark referenciales sin Tax Check |
| `moneda` | `"ARS"` \| `"USD"` | No | Default `"ARS"` |
| `plataformas` | `string[]` | No | Values de [`PLATFORM_GROUPS`](configuration-data.md#srcdataplatformsjs--platform_groups) (ej. `"meta-ads"`) |
| `nsm` | `string` | No | North Star Metric declarada; si se omite, se infiere del KPI técnico más repetido entre los pedidos |

Ejemplo:

```json
{
  "cliente": "Acme SRL",
  "pedidos": [{ "texto": "Quiero más leads calificados para el equipo comercial", "categoria": "leads" }],
  "etapas": ["comunidad-captacion"],
  "periodo": { "lapso": "mes-1" },
  "presupuesto": 1000000,
  "moneda": "ARS",
  "plataformas": ["meta-ads", "google-ads"]
}
```

### Response `200`

El mismo JSON que consume `SetterResult.jsx` — ver
[schema completo](output-schema.md#seteador--calculatesetterresult).

### Errores

| Status | Causa |
|---|---|
| `405` | Método distinto de `POST` |
| `401` / `500` | Ver sección Auth |
| `400` | Body no es JSON válido |
| `422` | Falta `cliente` o `pedidos` (o `pedidos` está vacío) |
| `500` | Excepción no esperada del cálculo (ej. un `periodo` malformado) — no debería pasar con input válido |

## `POST /api/kpi-evaluate`

Audita un KPI ya redactado — el mismo resultado que produce el formulario del
Evaluador.

Función real: [`api/kpi-evaluate.js`](../../api/kpi-evaluate.js) (Vercel) / [`netlify/functions/kpi-evaluate.js`](../../netlify/functions/kpi-evaluate.js) (Netlify).
Calcula con [`calculateEvaluatorResult()`](../../src/lib/calculator/evaluatorCalculator.js) — ver
[schema de salida completo](output-schema.md#evaluador--calculateevaluatorresult).

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
| `categoria` | `string` | No (recomendado) | Value de [`CATEGORY_OPTIONS`](calculator.md) (ej. `"leads"`) — el wizard siempre la manda como select obligatorio. Si se omite, se infiere por keywords con `classifyText()` sobre `accion` + `indicador` |
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
  "categoria": "leads",
  "periodo": { "lapso": "mes-1" },
  "presupuesto": 1000000,
  "plataformas": ["meta-ads"]
}
```

### Response `200`

El mismo JSON que consume `EvaluatorResult.jsx` — ver
[schema completo](output-schema.md#evaluador--calculateevaluatorresult).

### Errores

Mismos códigos que `/api/kpi-estimate`, salvo el `422`: acá dispara si falta
`accion`, `indicador` o `segmento`.

## Ver también

- [How-to: integrar una herramienta externa](../how-to/integrate-external-tool.md) — ejemplos con `curl` y n8n.
- [Variables de entorno](environment-variables.md) — cómo cargar `NORTE_API_KEY`.
