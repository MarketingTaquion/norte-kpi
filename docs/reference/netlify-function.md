# Función proxy interna `/api/claude` — contrato

Función serverless que usa el wizard del browser (Seteador y Evaluador vía
[`useClaude.js`](../../src/hooks/useClaude.js)), llamando siempre a la ruta
relativa `/api/claude`. No requiere API key propia — solo la llama el propio
frontend.

Existe **una implementación por plataforma de deploy**, con el mismo
contrato exacto — el frontend no sabe ni le importa cuál responde:

| Plataforma | Código fuente | Cómo resuelve la ruta |
|---|---|---|
| Vercel (principal) | [`api/claude.js`](../../api/claude.js) | Convención de Vercel: todo archivo en `/api/` se sirve en `/api/<nombre>` automáticamente |
| Netlify (secundaria) | [`netlify/functions/claude.js`](../../netlify/functions/claude.js) | Redirect `/api/* → /.netlify/functions/:splat` en [`netlify.toml`](../../netlify.toml) |

Es distinta de la [API pública](api.md) (`kpi-estimate` / `kpi-evaluate`):
esas sí requieren `X-Api-Key`, están pensadas para herramientas externas, y
devuelven JSON ya parseado y validado en vez del wrapper crudo de Anthropic
que devuelve esta.

- **Endpoint**: `/api/claude` (relativo — funciona igual en Vercel y Netlify)
- **Método**: `POST` únicamente. Cualquier otro método devuelve `405 Method Not Allowed`.
- **Runtime**: Node 20, `fetch` nativo (sin dependencia `node-fetch`).

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
| `405` | Método distinto de `POST` | `{ "error": "Method Not Allowed" }` |
| `500` | Falta `ANTHROPIC_API_KEY` en el entorno | `{ "error": "ANTHROPIC_API_KEY no está configurada..." }` |
| `502` | Falla el `fetch` a Anthropic (red, DNS, etc.) | `{ "error": "...", "detail": "<mensaje de la excepción>" }` |
| `200` (o el status que devuelva Anthropic) | Llamada exitosa | El JSON crudo de la Messages API — el texto generado está en `body.content[0].text` |

## Modelo usado

Hardcodeado por separado en cada implementación: `claude-sonnet-4-20250514`.
Si se cambia de modelo, hay que actualizarlo en **ambos** archivos
(`api/claude.js` y `netlify/functions/claude.js`) — es la única duplicación
real entre las dos plataformas; el resto de la lógica de negocio vive en
`src/lib/` y `src/prompts/`, compartida.

## Seguridad

La `ANTHROPIC_API_KEY` se lee de `process.env.ANTHROPIC_API_KEY` — nunca del
body de la request ni de ningún valor que venga del cliente. El frontend
llama siempre a `/api/claude`, nunca directo a `api.anthropic.com` — ver
[explanation: arquitectura](../explanation/architecture.md) para el porqué.
