# Calculadora interna — categorías, benchmarks y reglas

Referencia exhaustiva de `src/lib/calculator/` — el motor que reemplazó la
llamada a Claude (ver [explanation: motor de cálculo](../explanation/calculation-engine.md)
para el porqué). Si necesitás el dato exacto de cómo se clasifica un pedido
o qué benchmark usa cada categoría, está acá.

## Categorías — `kpiCatalog.js`

El formulario del Seteador tiene un select obligatorio **Métrica**, poblado
con `CATEGORY_OPTIONS` — el usuario elige la categoría explícitamente en vez
de depender de que el texto libre matchee una keyword. `findCategory(categoria)`
resuelve ese value; si no hay `categoria` (por ejemplo, una integración de la
API que todavía manda solo texto plano), se cae a `classifyText()` como
fallback. Cada `pedido` tiene su propia `categoria` (fila `{ texto, categoria }`).

Orden de `classifyText()` cuando no hay `categoria` explícita: gana la
primera keyword que matchea en el texto de cada `pedido`:

| Categoría | Keywords (ejemplos) | SOP | KPI técnico | `modo` de proyección |
|---|---|---|---|---|
| `ventas` | venta, vender, comprar, roas, facturación, ingresos | SOP Ignite | ROAS | `roas` |
| `leads` | lead, contacto, formulario, consulta | SOP Ignite | CPL y volumen de leads | `costo_por_unidad` |
| `trafico` | tráfico, visitas, clics, ctr | SOP Ignite | CTR y volumen de clics | `costo_por_unidad` (usa CPC) |
| `alcance` | alcance, reach, impresiones, marca, posicionamiento | SOP Comunidad | Alcance / Impresiones | `alcance` |
| `engagement` | engagement, interacción, comentarios, likes | SOP Comunidad | Tasa de Engagement | `porcentaje` |
| `seguidores` | seguidor, followers, audiencia, comunidad, crecimiento | SOP Comunidad | Crecimiento de audiencia | `referencial` |
| `retencion` | retención, churn, fidelización, recompra | SOP Comunidad | Tasa de Retención / Churn | `referencial` |
| `setup` | acceso, tracking, pixel, implementación, naming | SOP Setup | Hito de implementación | `hito` |
| `conversion` (default) | conversión, o ninguna keyword matcheó | SOP Ignite | Tasa de Conversión | `porcentaje` |

**Override de etapa**: si el Seteador tiene alguna etapa "Setup · ..."
seleccionada, el SOP de cualquier pedido que no sea ya `SOP Comunidad` se
fuerza a `SOP Setup` — ver `setupForzado` en
[`setterCalculator.js`](../../src/lib/calculator/setterCalculator.js).

## Benchmarks — `benchmarks.js`

Mercado argentino 2025-2026. Cada entrada es `{ min, max, unit, label }`:

| Key | Rango | Unidad |
|---|---|---|
| `ctr_meta` | 1–3 | % |
| `ctr_google` | 3–7 | % |
| `cpc_meta` | 150–800 | moneda |
| `cpc_meta_b2b` | 400–1500 | moneda |
| `cpm_meta` | 800–2500 | moneda |
| `cpm_meta_nicho` | 2000–5000 | moneda |
| `cpl_b2c` | 300–1500 | moneda |
| `cpl_b2b` | 1500–5000 | moneda |
| `roas_minimo` | 3–4 | x |
| `roas_saludable` | 4–8 | x |
| `roas_ecommerce` | 6–12 | x |
| `conversion_ecommerce` | 1.5–3 | % |
| `conversion_leads` | 3–8 | % |
| `engagement_ig` | 1–3 | % |
| `engagement_ig_excelente` | 3–5 | % |
| `engagement_tiktok` | 3–8 | % |
| `frecuencia` | 2–4 | imp/persona/semana |
| `ltv_cac` | 3–3 | x (mínimo) |

Por defecto se usan los rangos B2C (`cpl_b2c`, `cpc_meta`, `cpm_meta`) — hoy
no hay un campo en el formulario que distinga B2B/B2C, así que la
calculadora no puede elegir automáticamente el benchmark B2B. Si hace falta
esa distinción, hay que agregar el campo al formulario y a la lógica de
`kpiCatalog.js` (ver [how-to: actualizar benchmarks](../how-to/update-kpi-rules-and-benchmarks.md)).

## `modo` de proyección — cómo se usa cada benchmark

Definidos en `proyectarKpi()` dentro de
[`setterCalculator.js`](../../src/lib/calculator/setterCalculator.js):

- **`roas`**: `ingresos = neto × benchmark` (min y max por separado).
- **`costo_por_unidad`**: `unidades = neto / costo` — se usa `min` del costo
  para el techo de unidades y `max` del costo para el piso (más caro el
  costo, menos unidades salen).
- **`alcance`**: convierte neto → impresiones vía CPM, y de impresiones →
  personas alcanzadas dividiendo por la frecuencia promedio (`frecuencia`).
- **`porcentaje`** / **`referencial`**: no depende del presupuesto — siempre
  devuelve el rango de benchmark tal cual.
- **`hito`**: no es un rango, es un binario cumplido/no cumplido.

Sin presupuesto declarado, **cualquier** categoría devuelve el rango de
benchmark crudo, marcado como referencial — nunca se fuerza un número
cerrado sin plata detrás.

Las categorías `alcance` y `seguidores` (las que proyectan personas, no
plata/leads/clics/%) tienen además un segundo techo, independiente del
presupuesto: la población real de la localidad declarada. Ver
[reference: territorios](territorios.md) para el detalle completo (fuentes,
cómo se calcula, qué plataformas tienen techo aplicable).
