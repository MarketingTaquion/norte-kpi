# Variables de entorno

| Variable | Dónde se usa | Obligatoria | Notas |
|---|---|---|---|
| `NORTE_API_KEY` | `kpi-estimate.js`, en ambas plataformas (vía `src/lib/apiAuth.js`) | Solo si vas a usar la [API pública](api.md) | Key propia de Norte-kpi para autenticar herramientas externas. Sin ella cargada, el endpoint devuelve `500` (la API queda deshabilitada, no abierta). |

Es la **única** variable de entorno del proyecto. El wizard no necesita
ninguna: calcula todo en el browser, sin llamar a ningún servicio externo —
ver [explanation: motor de cálculo](../explanation/calculation-engine.md).
Tampoco hace falta ninguna variable `VITE_*` para el frontend, ni nada para
build.

Hay que cargar `NORTE_API_KEY` **por separado en cada plataforma** que
efectivamente uses para la API pública (Vercel y/o Netlify) — no se comparte
automáticamente entre ellas, aunque sea el mismo repo.

Ver [`.env.example`](../../.env.example) para el formato exacto, y
[cómo cargarla en Vercel](../how-to/deploy-to-vercel.md#cargar-las-api-keys)
o en [Netlify](../how-to/deploy-to-netlify.md#cargar-la-api-key).
