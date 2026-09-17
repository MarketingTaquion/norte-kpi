# Schema de salida de los prompts (Seteador / Evaluador)

Ambos system prompts (`src/prompts/setter.js`,
`src/prompts/evaluator.js`) terminan en una regla estricta: la IA responde
**únicamente JSON puro**, sin markdown ni fences de código. El parseo del lado
del cliente vive en [`src/utils/json.js`](../../src/utils/json.js)
(`cleanJSON` / `parseResponse`), que además tolera una respuesta envuelta en
` ```json ... ``` ` por las dudas.

## Seteador — `SETTER_SYSTEM_PROMPT`

`max_tokens`: `8000`. Consumido por
[`SetterTab.jsx`](../../src/components/setter/SetterTab.jsx) y renderizado por
[`SetterResult.jsx`](../../src/components/setter/SetterResult.jsx).

```json
{
  "nsm": { "metrica": "string", "razon": "string" },
  "stats": {
    "kpis_seteados": 0,
    "neto_disponible": 0,
    "metas_originales": 0,
    "metas_ajustadas": 0
  },
  "tax_check": {
    "bruto": 0, "fee": 0, "iva": 0, "percepciones": 0, "neto": 0
  },
  "kpis": [
    {
      "pedido_original": "string",
      "sop": "SOP Ignite | SOP Comunidad | SOP Setup",
      "kpi_tecnico": "string",
      "formula": "string",
      "fuente_verdad": "string",
      "meta_realista": "string",
      "proyeccion_min": 0,
      "proyeccion_max": 0
    }
  ],
  "pacing": [
    { "bloque": "25%", "meta_acumulada": "string" },
    { "bloque": "50%", "meta_acumulada": "string" },
    { "bloque": "75%", "meta_acumulada": "string" },
    { "bloque": "100%", "meta_acumulada": "string" }
  ],
  "checklist_nsm": ["string"],
  "proximos_pasos": ["string", "string", "string"],
  "resumen_ejecutivo": "string (máx 200 caracteres)"
}
```

## Evaluador — `EVALUATOR_SYSTEM_PROMPT`

`max_tokens`: `4000`. Consumido por
[`EvaluatorTab.jsx`](../../src/components/evaluator/EvaluatorTab.jsx) y
renderizado por
[`EvaluatorResult.jsx`](../../src/components/evaluator/EvaluatorResult.jsx).

```json
{
  "veredicto": "APROBADO | RECHAZADO_VANIDAD | RECHAZADO_INVIABILIDAD | CONDICIONADO",
  "confianza_pct": 0,
  "smart": {
    "s": { "pass": true, "nota": "string" },
    "m": { "pass": true, "nota": "string" },
    "a": { "pass": true, "nota": "string" },
    "r": { "pass": true, "nota": "string" },
    "t": { "pass": true, "nota": "string" }
  },
  "viabilidad": {
    "presupuesto_bruto": 0,
    "presupuesto_neto": 0,
    "costo_estimado": 0,
    "superavit_deficit": 0
  },
  "dias_totales": 0,
  "pacing_sugerido": [
    { "bloque": "25%", "meta_acumulada": "string" },
    { "bloque": "50%", "meta_acumulada": "string" },
    { "bloque": "75%", "meta_acumulada": "string" },
    { "bloque": "100%", "meta_acumulada": "string" }
  ],
  "riesgos": ["string"],
  "recomendaciones": ["string", "string", "string"],
  "kpi_alternativo": "string o null si el veredicto es APROBADO"
}
```

## Reglas de formato que aplican a ambos

- Strings compactos: máximo 80–100 caracteres por campo (para no gastar el
  presupuesto de tokens de salida en prosa).
- Los campos numéricos (`presupuesto`, montos, `dias_totales`, etc.) son
  siempre `number`, nunca `null` ni string — usar `0` cuando no hay dato.
- `veredicto` es uno de exactamente 4 valores fijos — no hay un quinto estado.

## Si la IA se desvía del schema

`parseResponse` lanza un error con `err.raw` seteado al texto crudo recibido.
`useClaude.js` lo captura, lo muestra en el `ErrorBox` (truncado) y **nunca
rompe la UI en silencio** — ver
[`src/components/shared/ErrorBox.jsx`](../../src/components/shared/ErrorBox.jsx).
