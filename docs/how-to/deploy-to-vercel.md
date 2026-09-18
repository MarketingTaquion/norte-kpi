# Deployar a Vercel

Vercel es la plataforma de deploy **principal** de Norte-kpi (Netlify quedó
como secundaria — ver [nota abajo](#por-qué-vercel-es-la-plataforma-principal)).
El proyecto ya está conectado: `MarketingTaquion/norte-kpi` → Vercel team
**IGNITE** → cada push a `master` dispara un build y deploy automático.

## Deploy normal (ya conectado)

No hace falta nada manual: pusheá a `master` y Vercel buildea y publica solo,
usando [`vercel.json`](../../vercel.json) (`npm run build`, publica `dist/`,
rewrite de SPA que excluye `/api/*`). Mirá el progreso en
**Vercel → norte-kpi → Deployments**.

Los dos endpoints de `api/*.js` (`kpi-estimate.js`, `kpi-evaluate.js`) se
despliegan automáticamente como Vercel Functions — no hace falta ningún
rewrite adicional para que `/api/kpi-estimate` funcione, a diferencia de
Netlify. El wizard y el Evaluador no necesitan ninguna function: calculan
todo en el browser (ver [explanation: arquitectura](../explanation/architecture.md)).

## Conectar el proyecto desde cero

1. En Vercel: **Add New → Project → Import Git Repository → GitHub**.
2. Si `norte-kpi` no aparece en la lista aunque el repo exista y sea
   accesible, es el mismo problema que con Netlify: la GitHub App de Vercel
   tiene acceso restringido a repos específicos. Andá a
   `github.com/settings/installations` → **Vercel** → **Configure** →
   agregá el repo en "Repository access" → **Save**. Volvé a Vercel — puede
   tardar unos segundos en refrescar la lista (probá recargar la página del
   import si no aparece al toque).
3. Vercel detecta automáticamente el framework (**Vite**) y usa
   `vercel.json` para el build. No hace falta tocar nada del formulario de
   import salvo el nombre del proyecto.

## Cargar la API key (solo si vas a usar la API pública)

El wizard y el Evaluador funcionan de una, sin ninguna variable de entorno.
`NORTE_API_KEY` **no está en el repo** — solo hace falta si vas a integrar
la [API pública](../reference/api.md) con otra herramienta:

1. **Project → Settings → Environment Variables**.
2. Agregá `NORTE_API_KEY` (ver [reference: API pública](../reference/api.md)).
3. Marcá los entornos que correspondan (Production, Preview, Development).
4. Si el proyecto ya tenía un deploy antes de cargar la variable, hace
   falta un **Redeploy** (Deployments → ⋯ → Redeploy) para que la función la
   vea — las env vars no se inyectan en un deploy ya construido.

## Verificar que quedó bien

Después de un deploy, entrá a la URL del sitio y completá el wizard del
Seteador hasta "Generar estimación" — debería funcionar de una, sin ningún
`ErrorBox`, porque no depende de ninguna variable de entorno. Para la API
pública, un `curl` rápido:

```bash
curl -X POST https://<tu-proyecto>.vercel.app/api/kpi-estimate \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: TU_NORTE_API_KEY" \
  -d '{"cliente":"Test","pedidos":["quiero mas leads"]}'
```

## Por qué Vercel es la plataforma principal

Netlify cobra el build/deploy contra una cuota de créditos del plan; con
pushes frecuentes ese consumo se nota. Por eso, desde 2026-09-17: Vercel es el
deploy principal (auto-deploy en cada push), y **cualquier deploy a Netlify
necesita confirmación explícita antes de dispararse** — Netlify sigue
conectado pero no se lo usa por default. Ver
[deploy-to-netlify.md](deploy-to-netlify.md) para cuando sí haga falta.
