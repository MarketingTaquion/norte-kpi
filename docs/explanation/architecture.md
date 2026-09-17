# Arquitectura: por qué un proxy serverless

## El problema que resuelve

Anthropic cobra por uso de API key. Si el frontend llamara directo a
`api.anthropic.com` con la key embebida en el bundle de JS, cualquier persona
con las devtools del browser abiertas podría copiarla y usarla por su cuenta
— no hay forma de ocultar un secreto dentro de código que corre en el
navegador del usuario, por más que esté minificado.

## La solución

Una única capa intermedia entre el browser y Anthropic:

```
[Browser] → React App → fetch("/api/claude")
                              ↓
           [Serverless Function] claude.js
                              ↓
           [Anthropic API] → Claude Sonnet
                              ↓
           [JSON response] → React state → UI
```

El frontend nunca conoce la API key. Llama siempre a un endpoint de su propio
dominio (`/api/claude`), que corre server-side (en Vercel o Netlify, según
cuál esté sirviendo ese deploy — ver más abajo), agrega la key desde una
variable de entorno (`process.env.ANTHROPIC_API_KEY`, invisible para
cualquiera que inspeccione el tráfico del browser) y recién ahí llama a
Anthropic.

Si alguien abre las devtools de red en el browser, ve llamadas a su propio
dominio (`norte-kpi.vercel.app/api/claude`), nunca a `api.anthropic.com`
directamente.

## Por qué serverless y no un backend separado

El proyecto no tiene usuarios externos ni necesita un backend persistente:
es una función stateless (recibe un prompt, reenvía, devuelve la respuesta).
Un backend serverless da eso sin tener que operar un servidor aparte, y se
deploya junto con el frontend desde el mismo repo — un solo lugar para
buildear y un solo lugar para versionar.

## Por qué dos plataformas de deploy (Vercel + Netlify)

Vercel es la plataforma principal: auto-deploya en cada push a `master`, sin
fricción. Netlify se mantiene conectada como secundaria — pero cobra el
build/deploy contra una cuota de créditos del plan, y con pushes frecuentes
ese consumo se nota, así que un deploy ahí requiere confirmación explícita en
vez de ser automático (ver [deploy-to-vercel.md](../how-to/deploy-to-vercel.md)
y [deploy-to-netlify.md](../how-to/deploy-to-netlify.md)).

Esto obliga a que la lógica de negocio (armado de prompts, llamada a
Anthropic, auth de la API pública) viva en `src/lib/` y `src/prompts/`,
**independiente de qué runtime la sirve** — `api/*.js` (Vercel) y
`netlify/functions/*.js` (Netlify) son wrappers finitos alrededor de esa
lógica compartida, no una reimplementación por plataforma.

## Por qué una sola función y no una por endpoint (por plataforma)

Seteador y Evaluador usan el mismo contrato (system prompt + messages +
max_tokens → respuesta de Anthropic) — ver
[reference: `/api/claude`](../reference/netlify-function.md). No hay lógica
de negocio distinta entre ambos casos de uso a nivel de la función: la
diferencia real está en qué prompt le manda cada tab
([`src/prompts/`](../../src/prompts/)), no en cómo se llama a Anthropic.
Separar en dos funciones hubiera duplicado el mismo código de proxy sin
ninguna ganancia.
