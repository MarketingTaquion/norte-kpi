# Variables de entorno

| Variable | Dónde se usa | Obligatoria | Notas |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | `netlify/functions/claude.js` | Sí | Nunca se lee del bundle del frontend. Local: `.env.local` (gitignoreado). Producción: Netlify → Project configuration → Environment variables. |

No hay más variables de entorno en el proyecto hoy — ni para el frontend
(Vite no expone ninguna variable `VITE_*` porque no las necesita: todo lo que
el frontend necesita es la URL relativa `/.netlify/functions/claude`) ni para
build.

Ver [`.env.example`](../../.env.example) para el formato exacto, y
[cómo cargarla en Netlify](../how-to/deploy-to-netlify.md#cargar-la-api-key).
