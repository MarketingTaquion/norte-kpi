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
      "agresividad_pct": 0,
      "territorio": "string o null si no se declaró localidad",
      "rubro": "string o null si el pedido no declaró rubro",
      "por_plataforma": [
        { "plataforma": "string", "proyeccion_min": 0, "proyeccion_max": 0, "techo_poblacional": "number o null" }
      ],
      "desglose_identidad": { "anonimizado": 0, "nominizado": 0 },
      "tam": "number o null — universo nacional para ese pedido (sin recorte geográfico)",
      "sam": "number o null — techo poblacional de la localidad declarada (null sin territorio)",
      "som": { "min": 0, "max": 0 },
      "comunidad": { "min": 0, "max": 0 },
      "confianza": {
        "tam": { "nivel": "alta | interna", "fuente": "string", "label": "string" },
        "sam": { "nivel": "alta | interna", "fuente": "string", "label": "string" },
        "som": { "nivel": "alta | interna", "fuente": "string", "label": "string" },
        "comunidad": { "nivel": "alta | interna", "fuente": "string", "label": "string" }
      }
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

`territorio` es `null` cuando no se declaró localidad; `rubro` es `null`
cuando ESE pedido no declaró rubro (es un campo por pedido, no global);
`por_plataforma` es `null` sin plataformas seleccionadas; `desglose_identidad`
es `null` sin `comunidad` (sin `comunidad.max` no hay base para estimar el
split anonimizado/nominizado — ver más abajo). Ver [reference:
territorios](territorios.md) para de dónde sale el techo poblacional que
recorta `alcance`/`seguidores`, qué plataformas tienen techo aplicable, y
por qué `por_plataforma` existe (una fila por plataforma seleccionada, con
el neto dividido en partes iguales entre ellas).

### `tam` / `sam` / `som` / `comunidad` / `confianza`

Solo se calculan para categorías de tipo alcance/audiencia (ver
`esAlcancePersonas()` en `setterCalculator.js`) — en el resto son `null`.
Forman un embudo TAM → SAM → SOM → Comunidad:

- **`tam`** (Total Addressable Market): universo nacional de esa
  plataforma/rango etario — techo demográfico puro, **nunca** recortado por
  territorio ni por rubro/intereses (`tamNacional()` en `territorio.js` no
  recibe `rubro` a propósito) — `null` si no hay al menos una plataforma
  con familia de penetración conocida.
- **`sam`** (Serviceable Addressable Market): el TAM, acotado por la
  localidad declarada Y por el rubro/interés del pedido — `null` sin
  territorio.
- **`som`** (Serviceable Obtainable Market): `{ min, max }`, el rango
  final mostrado como "Proyección" (mismos valores que
  `proyeccion_min`/`proyeccion_max`, que se mantienen por compatibilidad).
  **`som.max` nunca supera `sam`** — ni siquiera el ensanchado de rango por
  baja confianza (ver abajo) puede llevar el número más allá del techo
  demográfico real, porque eso rompería el propósito del embudo (evitar que
  comercial venda algo inalcanzable).
- **`comunidad`**: `{ min, max }`, un escalón más allá del SOM — de toda la
  gente alcanzable por pauta (SOM), cuánta se termina uniendo al grupo de
  WhatsApp que arma el flujo de ManyChat de ese cliente (servicio real de
  Taquion, el mismo proceso para todos los clientes). Es
  `som × TASA_CAPTACION_COMUNIDAD` (`src/data/comunidad.js`) — una tasa
  única global, no por rubro todavía, porque no hay historial real
  suficiente para calibrarla por rubro (ver el comentario de ese archivo).
  Mide conversión/comportamiento, no techo de audiencia — es una fuente de
  incertidumbre distinta a la del SOM, por eso es un escalón separado y no
  solo un recorte más del mismo tipo.
- **`confianza`**: un `{ nivel, fuente, label }` por cada uno de los
  cuatro. `nivel: 'alta'` = cadena poblacional con fuente externa citable
  (INDEC + DataReportal); `nivel: 'interna'` = el número depende de un
  factor sin fuente externa (rubro para sam/som, la tasa de captación para
  comunidad) — ver [reference:
  territorios](territorios.md#de-dónde-sale-cada-número-y-qué-tan-sólido-es).
  **`tam.confianza` es siempre `'alta'`** (nunca depende de rubro, ver
  arriba) y **`comunidad.confianza` es siempre `'interna'`**; `sam`/`som`
  varían según si hay rubro declarado. Cuando `som.confianza.nivel ===
  'interna'`, el rango `som` se ensancha ±15% adicional respecto al cálculo
  crudo (`ampliarRangoSiInterna()` en `confianza.js`) — para que un rango
  angosto nunca aparezca en una pieza sin fuente sólida detrás — pero
  siempre recortado contra `sam` como se explicó arriba.

`desglose_identidad` (`{ anonimizado, nominizado }`) cuelga de
`comunidad.max`, no de `som.max` — el split "¿dejó un dato identificable o
no?" solo tiene sentido una vez que la persona ya es miembro del grupo de
WhatsApp (`desgloseIdentidad()` en `territorio.js`, reutilizando
`rubro.pctNominizado`); antes de esa etapa el SOM es solo gente alcanzable
por pauta, sin ninguna noción de identidad.

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
