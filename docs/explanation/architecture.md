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
[Browser] → React App → fetch("/.netlify/functions/claude")
                              ↓
           [Netlify Function] claude.js
                              ↓
           [Anthropic API] → Claude Sonnet
                              ↓
           [JSON response] → React state → UI
```

El frontend nunca conoce la API key. Llama siempre a un endpoint de su propio
dominio (`/.netlify/functions/claude`), que corre server-side en la
infraestructura de Netlify, agrega la key desde una variable de entorno
(`process.env.ANTHROPIC_API_KEY`, invisible para cualquiera que inspeccione el
tráfico del browser) y recién ahí llama a Anthropic.

Si alguien abre las devtools de red en el browser, ve llamadas a su propio
dominio (`norte-kpi.netlify.app/.netlify/functions/claude`), nunca a
`api.anthropic.com` directamente.

## Por qué Netlify Functions y no un backend separado

El proyecto no tiene usuarios externos ni necesita un backend persistente:
es una única función stateless (recibe un prompt, reenvía, devuelve la
respuesta). Netlify Functions da eso sin tener que operar un servidor aparte,
y se deploya junto con el frontend desde el mismo repo y el mismo
`netlify.toml` — un solo lugar para buildear y un solo lugar para versionar.

## Por qué una sola función y no una por endpoint

Seteador y Evaluador usan el mismo contrato (system prompt + messages +
max_tokens → respuesta de Anthropic) — ver
[reference: Netlify Function](../reference/netlify-function.md). No hay
lógica de negocio distinta entre ambos casos de uso a nivel de la función: la
diferencia real está en qué prompt le manda cada tab
([`src/prompts/`](../../src/prompts/)), no en cómo se llama a Anthropic.
Separar en dos funciones hubiera duplicado el mismo código de proxy sin
ninguna ganancia.
