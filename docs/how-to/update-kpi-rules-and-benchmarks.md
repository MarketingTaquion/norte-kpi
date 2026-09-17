# Actualizar benchmarks y reglas de negocio de los prompts

Los benchmarks de mercado (CTR, CPC, CPM, CPL, ROAS, etc.) y las reglas de
negocio del Seteador y el Evaluador **no están en el código de UI**: viven como
texto dentro de los system prompts, en
[`src/prompts/setter.js`](../../src/prompts/setter.js) y
[`src/prompts/evaluator.js`](../../src/prompts/evaluator.js). Actualizarlos no
requiere tocar ningún componente de React.

## Actualizar un benchmark (ej. rango de CPC de Meta Ads)

1. Abrí `src/prompts/setter.js` y buscá la sección `# BENCHMARKS`.
2. Editá la línea correspondiente, manteniendo el mismo formato compacto
   (`Canal: rango — condición`) para que la IA la lea igual de bien:

   ```js
   'CPC Meta Ads: $150-800 ARS (B2C masivo), $400-1500 ARS (B2B/nicho)',
   ```

3. Repetí el mismo cambio en `src/prompts/evaluator.js` si el benchmark
   también se usa ahí — **los dos prompts mantienen listas de benchmarks
   separadas y deben quedar sincronizadas a mano**, no hay una fuente única
   compartida hoy.
4. Redeployá (push a `master`) — no hace falta ningún otro paso, el prompt se
   envía tal cual en cada llamada.

## Agregar una regla de negocio nueva

Las reglas viven como bullets de texto plano bajo secciones como
`# REGLAS DE GENERACIÓN` (setter) o `# ERRORES A DETECTAR` (evaluator). Para
agregar una:

1. Sumá el bullet en el array de strings que arma el prompt (recordá: es un
   array unido con `.join('\n')`, **nunca uses template literals con
   backticks acá** — es una convención del proyecto para evitar problemas de
   escaping).
2. Si la regla cambia también el JSON que se espera de vuelta, actualizá el
   `# JSON SCHEMA DE SALIDA` al final del mismo archivo — ver
   [reference: schema de salida](../reference/prompts-output-schema.md) para
   el contrato completo.

## Verificar el cambio

No hay tests automatizados sobre el contenido de los prompts. Verificá a mano:
correlo local (ver [Netlify Dev](run-locally-with-netlify-dev.md)), generá una
estimación o auditoría que dispare la regla nueva, y confirmá que la respuesta
la refleja. Si la IA empieza a devolver JSON que no matchea el schema, el
`ErrorBox` te va a mostrar el raw de la respuesta para debuggear — ver
[`src/utils/json.js`](../../src/utils/json.js).
