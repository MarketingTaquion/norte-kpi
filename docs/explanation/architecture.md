# Arquitectura: por qué el cálculo es client-side y la API es opcional

## El cambio central: no hay secreto que proteger

La primera versión de este proyecto llamaba a la API de Anthropic desde una
función serverless, precisamente para que la API key nunca llegara al
browser — ver el historial en `docs/SPEC.md`. Desde que el cálculo se movió
a una calculadora determinística ([explanation: motor de
cálculo](calculation-engine.md)), **ya no hay ningún secreto que proteger en
el flujo principal**: no se llama a ningún servicio externo, no hay una API
key de por medio.

Esto simplifica la arquitectura de raíz:

```
[Browser] → React App → src/lib/calculator/ (mismo proceso, sin red)
                              ↓
                       Resultado inmediato → React state → UI
```

El Seteador y el Evaluador importan `calculateSetterResult` /
`calculateEvaluatorResult` directamente
([`SetterTab.jsx`](../../src/components/setter/SetterTab.jsx),
[`EvaluatorTab.jsx`](../../src/components/evaluator/EvaluatorTab.jsx)) y los
ejecutan en el mismo proceso del browser. No hay `fetch`, no hay loading
real, no hay forma de que "no funcione por falta de una API key" — que era
exactamente el problema que motivó este cambio.

## Entonces, ¿para qué sigue existiendo una API?

`api/kpi-estimate.js` y `api/kpi-evaluate.js` (más sus equivalentes en
`netlify/functions/`) siguen existiendo, pero por una razón distinta: **para
que herramientas externas** (n8n, un CRM, un backend propio) puedan invocar
el mismo cálculo por HTTP, sin tener el código de Norte-kpi corriendo en su
propio proceso. Es la misma lógica de `src/lib/calculator/`, expuesta como
endpoint — no un proxy a nada.

`NORTE_API_KEY` sigue siendo necesaria para esos dos endpoints, pero con un
propósito distinto al de la vieja `ANTHROPIC_API_KEY`: no protege una llamada
a un tercero, protege **el endpoint en sí** de ser invocado por cualquiera
que encuentre la URL — sin eso, cualquiera podría pegarle a la API pública y
consumir cómputo del sitio sin autorización.

## Por qué dos plataformas de deploy (Vercel + Netlify)

Vercel es la plataforma principal: auto-deploya en cada push a `master`, sin
fricción. Netlify se mantiene conectada como secundaria — pero cobra el
build/deploy contra una cuota de créditos del plan, y con pushes frecuentes
ese consumo se nota, así que un deploy ahí requiere confirmación explícita en
vez de ser automático (ver [deploy-to-vercel.md](../how-to/deploy-to-vercel.md)
y [deploy-to-netlify.md](../how-to/deploy-to-netlify.md)).

Esto obliga a que la lógica de negocio (`src/lib/calculator/`) sea
**independiente de qué runtime la sirve** — `api/*.js` (Vercel) y
`netlify/functions/*.js` (Netlify) son wrappers finitos alrededor de esa
misma lógica, no una reimplementación por plataforma.

## Por qué una función por endpoint, no una sola

A diferencia del proxy viejo (una sola función `claude.js` que servía tanto
al Seteador como al Evaluador, porque ambos hablaban el mismo protocolo con
Anthropic), la API pública tiene **dos** endpoints —
`kpi-estimate`/`kpi-evaluate` — porque acá sí hay lógica de negocio distinta
entre ambos: distintos campos obligatorios, distinta validación, distinto
shape de salida (ver [reference: API pública](../reference/api.md)). Fusionar
ambos en un único endpoint genérico hubiera obligado a un contrato más
confuso sin ninguna ganancia real.
