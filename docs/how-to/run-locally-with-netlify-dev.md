# Correr el proxy de Claude en local con Netlify Dev

`npm run dev` (Vite solo) sirve el frontend, pero **no** levanta
`netlify/functions/claude.js` — el wizard va a completarse hasta "Generar
estimación" y ahí fallar con un error de red, porque `/.netlify/functions/claude`
no existe sin el runtime de Netlify.

## Pasos

1. Instalá Netlify CLI si no la tenés (una sola vez):

   ```bash
   npm install -g netlify-cli
   ```

2. Asegurate de tener `.env.local` con `ANTHROPIC_API_KEY` cargada (ver
   [tutorial de inicio](../tutorials/getting-started.md) si todavía no lo
   armaste).

3. Corré:

   ```bash
   netlify dev
   ```

   Esto levanta Vite y la function juntos en `http://localhost:8888`, con
   `.env.local` inyectada como variables de entorno de la function.

4. (Opcional) vinculá el proyecto local al sitio real de Netlify para que
   `netlify dev` también pueda usar las variables de entorno cargadas en el
   dashboard en vez de `.env.local`:

   ```bash
   netlify link
   ```

## Verificar que la function responde

```bash
curl -X POST http://localhost:8888/.netlify/functions/claude \
  -H "Content-Type: application/json" \
  -d '{"system":"Respondé solo con la palabra OK.","messages":[{"role":"user","content":"hola"}],"max_tokens":10}'
```

Una respuesta `200` con un JSON de Anthropic adentro confirma que la
`ANTHROPIC_API_KEY` está bien cargada y la function puede llegar a
`api.anthropic.com`. Un `500` con `"ANTHROPIC_API_KEY no está configurada en
Netlify."` significa que la variable no llegó al proceso — revisá `.env.local`
o las env vars del sitio si usaste `netlify link`.
