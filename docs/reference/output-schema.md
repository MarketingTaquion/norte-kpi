# Schema de salida (Seteador / Evaluador)

Contrato de datos que devuelve `src/lib/calculator/setterCalculator.js` y
`evaluatorCalculator.js` — el mismo shape que consumen `SetterResult.jsx` /
`EvaluatorResult.jsx` en el browser, y el mismo que devuelve la API pública
(`/api/kpi-estimate`, `/api/kpi-evaluate`). Un solo contrato, tres
consumidores.

## Seteador — `calculateSetterResult()`

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
      "proyeccion_max": 0,
      "agresividad_pct": 0
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

Ver [reference: calculadora](calculator.md) para cómo se llega a cada valor
(categoría, benchmark, `modo` de proyección).

`agresividad_pct` (0–100) es una propiedad de la **categoría**, no del
pedido puntual: `proyeccion_min`/`proyeccion_max` siempre abarcan el
benchmark completo de la categoría (no hay una posición-dentro-del-rango
que varíe con el presupuesto), así que se deriva del ratio `max/min` del
benchmark en escala logarítmica — un rango angosto (ej. retención) da un
valor bajo ("conservador"); uno ancho (ej. leads, tráfico) da un valor alto
("agresivo"). Repetir el cálculo para la misma categoría siempre da el mismo
valor.

## Evaluador — `calculateEvaluatorResult()`

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

## Reglas de formato

- `veredicto` es uno de exactamente 4 valores fijos — no hay un quinto
  estado.
- Los campos numéricos (`presupuesto`, montos, `dias_totales`, etc.) son
  siempre `number`, nunca `null` — se usa `0` cuando no hay dato.
- `riesgos` tiene como máximo 2 items, `recomendaciones` exactamente 3.

## Si la calculadora recibe datos inesperados

`SetterTab.jsx` y `EvaluatorTab.jsx` envuelven el cálculo en un `try/catch` —
si algo inesperado rompe el cálculo (ej. una fecha malformada), se muestra en
el `ErrorBox` en vez de romper la UI en silencio. En la API pública, un error
así propaga como una excepción no capturada — la plataforma (Vercel/Netlify)
la devuelve como `500` genérico.
