# Variables de entorno

| Variable | Dónde se usa | Obligatoria | Notas |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | `netlify/functions/claude.js`, `kpi-estimate.js`, `kpi-evaluate.js` (vía `src/lib/anthropic.js`) | Sí | Nunca se lee del bundle del frontend. Local: `.env.local` (gitignoreado). Producción: Netlify → Project configuration → Environment variables. |
| `NORTE_API_KEY` | `kpi-estimate.js`, `kpi-evaluate.js` (vía `src/lib/apiAuth.js`) | Solo si vas a usar la [API pública](api.md) | Key propia de Norte-kpi para autenticar herramientas externas — **no es la de Anthropic**, no se usa para llamar a `api.anthropic.com`. Sin ella cargada, ambos endpoints devuelven `500` (la API queda deshabilitada, no abierta). |

No hay más variables de entorno en el proyecto hoy — ni para el frontend
(Vite no expone ninguna variable `VITE_*` porque no las necesita: todo lo que
el frontend necesita es la URL relativa `/.netlify/functions/claude`) ni para
build.

Ver [`.env.example`](../../.env.example) para el formato exacto, y
[cómo cargarla en Netlify](../how-to/deploy-to-netlify.md#cargar-la-api-key).
