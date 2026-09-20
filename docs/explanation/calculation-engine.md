# Motor de cálculo: por qué es 100% determinístico, sin IA

Norte-kpi existe para traducir un pedido coloquial en un número accionable
con soporte financiero. La versión original de este proyecto delegaba esa
traducción en Claude (Anthropic) vía una API — pero eso significaba que la
herramienta **no funcionaba si no había una API key de Anthropic cargada**, y
que cada estimación dependía de una llamada de red a un servicio externo que
Taquion no controla.

Por eso, desde 2026-09-18, todo el cálculo vive en
[`src/lib/calculator/`](../../src/lib/calculator/) — código puro, sin
llamadas de red, sin API key, sin modelo de lenguaje. El wizard y el
Evaluador calculan el resultado **en el momento, en el browser**, apenas el
usuario toca "Generar estimación" o "Auditar KPI".

## Las tres piezas del motor

### 1. Clasificación por keywords — `kpiCatalog.js`

Cada pedido en lenguaje coloquial ("quiero más leads", "necesito bajar el
CPA") se compara contra una lista de categorías
([`CATEGORIES`](../../src/lib/calculator/kpiCatalog.js)), cada una con sus
propias palabras clave (`leads`, `contacto`, `formulario` → categoría
`leads`; `alcance`, `marca`, `posicionamiento` → categoría `alcance`; etc.).
Gana la primera categoría cuyas keywords aparecen en el texto — sin acentos
ni mayúsculas, gracias a [`text.js`](../../src/lib/calculator/text.js). Si
nada matchea, cae en la categoría genérica `conversion`.

Cada categoría ya trae consigo el SOP que le corresponde (Ignite / Comunidad
/ Setup), la fórmula técnica exacta y a qué benchmark de mercado se compara —
esto reemplaza lo que antes eran las "REGLAS DE ROUTING" del prompt.

### 2. Benchmarks fijos — `benchmarks.js`

Los mismos rangos de mercado argentino 2025-2026 que antes vivían como texto
suelto dentro del prompt (CTR, CPC, CPM, CPL, ROAS, engagement, LTV/CAC) son
ahora datos estructurados en
[`BENCHMARKS`](../../src/lib/calculator/benchmarks.js) — un objeto con
`{ min, max, unit, label }` por métrica. La calculadora los lee directamente,
nunca los "recuerda" ni los aproxima.

### 3. Proyección — `setterCalculator.js` / `evaluatorCalculator.js`

Con la categoría y los benchmarks en mano, el cálculo de la proyección es
aritmética simple:

- **Con presupuesto declarado**: se calcula el neto (ver Chequeo impositivo / Tax Check abajo) y
  se divide por el benchmark de costo por unidad de la categoría (ej. CPL) o
  se multiplica por el benchmark de retorno (ej. ROAS), según corresponda.
  El rango `proyeccion_min`/`proyeccion_max` sale de aplicar el extremo más
  caro y el más barato del benchmark.
- **Sin presupuesto**: se devuelve el rango de benchmark tal cual, marcado
  como referencial — nunca se inventa una meta cerrada sin plata detrás.

Para el Evaluador, la misma lógica se usa en sentido inverso: a partir del
número que declaró el equipo (ej. "500 leads") y el benchmark de costo, se
estima el costo total y se compara contra el neto disponible.

## Chequeo impositivo (Tax Check) — el único cálculo que nunca cambió

```
neto = bruto × (1 − 0.10 − 0.21 − 0.04) = bruto × 0.65
```

Esta fórmula ([`src/utils/tax.js`](../../src/utils/tax.js)) fue siempre
determinística, incluso en la versión con IA — es la prueba de que la
filosofía correcta desde el principio era "todo lo que tiene fórmula cerrada
se resuelve en código, nunca se le pide a un modelo que lo calcule". El resto
del motor de cálculo simplemente extiende ese mismo principio a todo lo demás
que antes se delegaba en Claude.

## Auditoría S.M.A.R.T. del Evaluador — reglas, no juicio de un modelo

`evaluatorCalculator.js` audita cada criterio con una regla concreta y
verificable:

- **S** (Específico): ¿hay un verbo de acción declarado?
- **M** (Medible): ¿el indicador tiene un número concreto? (regex sobre el
  texto, ver [`firstNumber`](../../src/lib/calculator/text.js))
- **A** (Alcanzable): ¿el número pedido es plausible contra el benchmark de
  la categoría? (ej. ROAS 20x en el primer mes se marca como improbable)
- **R** (Relevante): ¿hay un segmento declarado, y la métrica no es de
  vanidad? (keywords como "likes" sin conexión a negocio se detectan y
  bajan directo a `RECHAZADO_VANIDAD`)
- **T** (Tiempo): ¿hay un plazo definido (lapso o fechas)?

El veredicto final (`APROBADO` / `RECHAZADO_VANIDAD` /
`RECHAZADO_INVIABILIDAD` / `CONDICIONADO`) sale de un árbol de decisión fijo
sobre estos cinco checks más la viabilidad financiera — nunca de una
"impresión" de qué tan bien redactado está el KPI.

## Los límites de este enfoque (y por qué son aceptables)

Un matching por keywords es más rígido que un modelo de lenguaje: un pedido
raro o mal escrito puede caer en la categoría genérica `conversion` en vez de
una más específica. Eso es un trade-off consciente — se prefiere un resultado
**predecible, verificable y siempre disponible** por sobre uno más "inteligente"
pero dependiente de un servicio externo, una API key, y potencialmente
inconsistente entre corridas. Si en el futuro hace falta más precisión, el
lugar para mejorarla es sumar keywords y categorías a `kpiCatalog.js` — ver
[how-to: actualizar benchmarks y reglas](../how-to/update-kpi-rules-and-benchmarks.md).
