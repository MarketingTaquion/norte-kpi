# Actualizar benchmarks y reglas de negocio de la calculadora

Los benchmarks de mercado (CTR, CPC, CPM, CPL, ROAS, etc.) y las reglas de
clasificación viven como datos estructurados en
[`src/lib/calculator/benchmarks.js`](../../src/lib/calculator/benchmarks.js) y
[`src/lib/calculator/kpiCatalog.js`](../../src/lib/calculator/kpiCatalog.js).
Actualizarlos no requiere tocar ningún componente de React — el wizard y la
API pública leen de ahí automáticamente.

## Actualizar un benchmark (ej. rango de CPC de Meta Ads)

Abrí `benchmarks.js` y editá el objeto correspondiente en `BENCHMARKS`:

```js
cpc_meta: { min: 150, max: 800, unit: 'moneda', label: 'CPC Meta Ads (B2C)' },
```

Ese mismo objeto lo usa el Seteador para proyectar — no hay una copia
separada por flujo, así que un solo cambio alcanza. Ver
[reference: calculadora](../reference/calculator.md) para la lista completa
de keys y quién las usa.

## Agregar o ajustar una categoría de KPI

En `kpiCatalog.js`, cada entrada de `CATEGORIES` define las keywords que
disparan esa categoría, el SOP, la fórmula y a qué benchmark apunta:

```js
{
  key: 'leads',
  keywords: ['lead', 'leads', 'contacto', 'contactos', 'formulario', 'consulta', 'consultas'],
  sop: 'SOP Ignite',
  kpi_tecnico: 'CPL (Costo por Lead) y volumen de leads',
  formula: 'CPL = Inversión / Leads',
  benchmarkKey: 'cpl_b2c',
  unidad: 'cantidad',
  modo: 'costo_por_unidad',
},
```

Para agregar una keyword nueva (ej. que "clientes potenciales" también
dispare la categoría `leads`), sumala al array `keywords` de esa entrada.
**El orden de `CATEGORIES` importa**: se evalúa de arriba a abajo y gana la
primera que matchea — si agregás una categoría nueva con keywords que se
superponen con una existente, ubicala antes o después según cuál querés que
gane.

Para agregar una categoría completamente nueva, sumá un objeto nuevo al
array con el mismo shape, y asegurate de que el benchmark que referencia
(`benchmarkKey`) exista en `BENCHMARKS`.

## Ajustar el `modo` de proyección

Si una categoría nueva no encaja en ninguno de los `modo` existentes
(`roas`, `costo_por_unidad`, `alcance`, `porcentaje`, `referencial`, `hito`),
hay que agregar un caso nuevo al `switch` de `proyectarKpi()` en
[`setterCalculator.js`](../../src/lib/calculator/setterCalculator.js) — ver
[reference: calculadora](../reference/calculator.md#modo-de-proyección--cómo-se-usa-cada-benchmark)
para lo que hace cada uno de los existentes antes de agregar uno nuevo.

## Verificar el cambio

No hay tests automatizados sobre la calculadora todavía. Verificá a mano:
`npm run dev`, generá una estimación o auditoría que dispare la categoría o
el benchmark que tocaste, y confirmá que el resultado lo refleja. Si algo
rompe el cálculo (ej. una división por cero por un benchmark mal armado), el
`ErrorBox` te muestra el mensaje de la excepción — ver
[reference: schema de salida](../reference/output-schema.md).
