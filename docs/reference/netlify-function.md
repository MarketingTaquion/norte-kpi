# Netlify Function `claude.js` — contrato de la API interna

Función serverless que usa el wizard del browser (Seteador y Evaluador vía
[`useClaude.js`](../../src/hooks/useClaude.js)). Código fuente:
[`netlify/functions/claude.js`](../../netlify/functions/claude.js). No
requiere API key propia — solo la llama el propio frontend, igual que el
primer día de este proyecto.

Es distinta de la [API pública](api.md) (`kpi-estimate.js` / `kpi-evaluate.js`):
esas sí requieren `X-Api-Key`, están pensadas para herramientas externas, y
devuelven JSON ya parseado y validado en vez del wrapper crudo de Anthropic
que devuelve esta.

- **Endpoint (local con `netlify dev`)**: `http://localhost:8888/.netlify/functions/claude`
- **Endpoint (producción)**: `https://<tu-sitio>.netlify.app/.netlify/functions/claude`
- **Método**: `POST` únicamente. Cualquier otro método devuelve `405 Method Not Allowed`.
- **Runtime**: Node 20 (usa `fetch` nativo, sin dependencia `node-fetch`).

## Request

`Content-Type: application/json`, body:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `system` | `string` | Sí | El system prompt completo (ver [schema de salida](prompts-output-schema.md)) |
| `messages` | `array` | Sí | Array de mensajes estilo Anthropic Messages API, ej. `[{ "role": "user", "content": "..." }]` |
| `max_tokens` | `number` | No | Default `8000` si se omite |

## Response

Reenvía tal cual el `status` y el body JSON que devuelve `api.anthropic.com/v1/messages`,
excepto en estos casos de error propios de la function:

| Status | Cuándo | Body |
|---|---|---|
| `405` | Método distinto de `POST` | texto plano `"Method Not Allowed"` |
| `500` | Falta `ANTHROPIC_API_KEY` en el entorno | `{ "error": "ANTHROPIC_API_KEY no está configurada en Netlify." }` |
| `400` | El body no es JSON válido | `{ "error": "Body inválido." }` |
| `502` | Falla el `fetch` a Anthropic (red, DNS, etc.) | `{ "error": "...", "detail": "<mensaje de la excepción>" }` |
| `200` (o el status que devuelva Anthropic) | Llamada exitosa | El JSON crudo de la Messages API — el texto generado está en `body.content[0].text` |

## Modelo usado

Hardcodeado en la function: `claude-sonnet-4-20250514`. Para cambiar de
modelo, es el único lugar del repo donde está el nombre — no hay variable de
entorno para esto hoy.

## Seguridad

La `ANTHROPIC_API_KEY` se lee de `process.env.ANTHROPIC_API_KEY` — nunca del
body de la request ni de ningún valor que venga del cliente. El frontend
(`src/hooks/useClaude.js`) llama siempre a `/.netlify/functions/claude`, nunca
directo a `api.anthropic.com` — ver [explanation: arquitectura](../explanation/architecture.md)
para el porqué.
