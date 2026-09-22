# Probar la API pública en local con Netlify Dev

`npm run dev` (Vite solo) alcanza para todo el wizard — no
necesitás esta guía para el uso normal de Norte-kpi (ver
[tutorial de inicio](../tutorials/getting-started.md)). Netlify Dev solo hace
falta si querés probar en local el endpoint de la
[API pública](../reference/api.md) (`/api/kpi-estimate`) tal como lo
llamaría una herramienta externa — `npm run dev` no levanta esa function.

## Pasos

1. Instalá Netlify CLI si no la tenés (una sola vez):

   ```bash
   npm install -g netlify-cli
   ```

2. Creá `.env.local` con una `NORTE_API_KEY` de prueba:

   ```bash
   echo "NORTE_API_KEY=test-key-123" > .env.local
   ```

3. Corré:

   ```bash
   netlify dev
   ```

   Esto levanta Vite y las functions juntas en `http://localhost:8888`, con
   `.env.local` inyectada como variable de entorno.

## Verificar que la API responde

```bash
curl -X POST http://localhost:8888/api/kpi-estimate \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: test-key-123" \
  -d '{"cliente":"Test","pedidos":["quiero mas leads"]}'
```

Una respuesta `200` con la matriz de KPIs confirma que todo está andando —
no hace falta ninguna otra key ni conexión externa, el cálculo es local. Un
`401` significa que el header `X-Api-Key` no matchea la `NORTE_API_KEY` de
`.env.local`.
