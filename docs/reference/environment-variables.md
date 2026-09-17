# Variables de entorno

| Variable | Dónde se usa | Obligatoria | Notas |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | `api/claude.js`, `kpi-estimate.js`, `kpi-evaluate.js` (Vercel) y sus equivalentes en `netlify/functions/` — vía `src/lib/anthropic.js` en los dos endpoints de la API pública | Sí | Nunca se lee del bundle del frontend. Local: `.env.local` (gitignoreado). Producción: cargarla en el proyecto de la plataforma que estés usando (Vercel o Netlify) — ver [deploy-to-vercel.md](../how-to/deploy-to-vercel.md). |
| `NORTE_API_KEY` | `kpi-estimate.js`, `kpi-evaluate.js`, en ambas plataformas (vía `src/lib/apiAuth.js`) | Solo si vas a usar la [API pública](api.md) | Key propia de Norte-kpi para autenticar herramientas externas — **no es la de Anthropic**, no se usa para llamar a `api.anthropic.com`. Sin ella cargada, ambos endpoints devuelven `500` (la API queda deshabilitada, no abierta). |

Hay que cargar ambas variables **por separado en cada plataforma** que
efectivamente uses (Vercel y/o Netlify) — no se comparten automáticamente
entre ellas, aunque sea el mismo repo.

No hay más variables de entorno en el proyecto hoy — ni para el frontend
(Vite no expone ninguna variable `VITE_*` porque no las necesita: todo lo que
el frontend necesita es la URL relativa `/api/claude`) ni para build.

Ver [`.env.example`](../../.env.example) para el formato exacto, y
[cómo cargarlas en Vercel](../how-to/deploy-to-vercel.md#cargar-las-api-keys)
o en [Netlify](../how-to/deploy-to-netlify.md#cargar-la-api-key).
