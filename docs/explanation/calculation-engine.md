# Motor de cálculo: qué es determinístico y qué se delega en la IA

Norte-kpi existe para traducir un pedido coloquial en un número accionable con
soporte financiero. Esa traducción tiene tres piezas, y cada una vive en un
nivel de confianza distinto — la decisión de diseño más importante del
proyecto es **no delegarle a la IA nada que tenga una fórmula cerrada**.

## 1. Tax Check — determinístico, sin IA

Convierte presupuesto bruto en neto invertible con una fórmula fija:

```
neto = bruto × (1 − 0.10 − 0.21 − 0.04) = bruto × 0.65
```

| Concepto | % |
|---|---|
| Fee de gestión | −10% |
| IVA | −21% |
| Percepciones | −4% |
| **Neto invertible** | **65%** |

Se calcula en el cliente en tiempo real (paso 4 del wizard, mientras se
escribe el presupuesto) con
[`src/utils/tax.js`](../../src/utils/tax.js), y la IA recalcula el mismo
número en su respuesta para que ambos coincidan — es intencional que esté
duplicado: si algún día la IA devuelve un neto distinto al que calculó el
frontend, es una señal de que el prompt se desvió, no de que hay dos fuentes
de verdad válidas.

## 2. Motor de proyección de KPIs — asistido por IA, con reglas duras

El Seteador no calcula la proyección con una fórmula cerrada: la delega en
Claude, pero **acotada por reglas explícitas** en el system prompt
([`src/prompts/setter.js`](../../src/prompts/setter.js)), no en texto libre:

- *Routing por SOP*: la plataforma elegida determina qué SOP aplica (Ignite /
  Comunidad / Setup) — esto no es una preferencia estética, cambia qué tipo de
  meta es válida (performance vs. hito de implementación).
- *Sin presupuesto declarado* → la IA está obligada a devolver rangos
  referenciales de benchmark, nunca una meta cerrada, y a marcarlo. Esto evita
  que el equipo comercial presente al cliente un número que parece preciso
  pero no tiene sustento financiero.
- *Benchmarks fijos*: los rangos de mercado (CTR, CPC, CPM, CPL, ROAS,
  engagement, LTV/CAC) están escritos en el prompt, no generados por la IA —
  la IA los aplica, no los inventa.
- *Pacing siempre en 4 bloques* (25/50/75/100%): es una convención del equipo
  Ignite, no una elección de la IA por request.

**Por qué se delega esto y no se calcula con una fórmula**: no existe una
fórmula única para "cuántos leads son razonables con este presupuesto en este
vertical" — depende de industria, estacionalidad, plataforma y del pedido
específico del cliente en lenguaje natural. Ese es exactamente el tipo de
juicio de mercado que un LLM puede aportar, siempre que esté acotado por
benchmarks fijos y un schema de salida cerrado (ver
[reference: schema de salida](../reference/prompts-output-schema.md)) para que
el criterio no derive en números inventados.

## 3. Motor de auditoría del Evaluador — reglas de rechazo + juicio de la IA

Combina dos capas:

1. **Patrones de rechazo automático**: 6 errores listados explícitamente en
   [`src/prompts/evaluator.js`](../../src/prompts/evaluator.js) que la IA está
   obligada a detectar (ROAS calculado sobre utilidad en vez de ingresos, KPI
   sin número concreto, sin plazo, de vanidad, meta matemáticamente imposible,
   o irrelevante para el objetivo declarado). Cada patrón mapea a qué criterio
   S.M.A.R.T. falla.
2. **Veredicto financiero determinístico**: una vez que hay presupuesto, el
   mismo cálculo `neto = bruto × 0.65` se compara contra un costo estimado
   para la meta declarada → superávit o déficit.

Los cuatro veredictos (`APROBADO`, `RECHAZADO_VANIDAD`,
`RECHAZADO_INVIABILIDAD`, `CONDICIONADO`) son reglas mutuamente excluyentes,
no una escala de sentimiento — el `confianza_pct` que devuelve la IA es un
dato adicional para el lector humano, **nunca** lo que decide el veredicto.

## El principio general

Todo lo que tiene una fórmula cerrada (Tax Check, elección de SOP por
plataforma, estructura de pacing en 4 bloques) se resuelve en código, para que
un LLM no pueda "inventar" una cuenta de IVA. Todo lo que requiere criterio de
mercado se delega en Claude, pero con benchmarks fijos y un schema de salida
cerrado para que el criterio no derive en alucinación de números.
