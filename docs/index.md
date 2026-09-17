# Documentación de Norte-kpi

Esta documentación está organizada según [Diátaxis](https://diataxis.fr/): cuatro
categorías separadas por lo que necesitás en el momento, no por tema. Cada
documento sirve un solo propósito — si buscás algo y no está donde esperabas,
probablemente esté en otra categoría de esta misma lista.

| Categoría | Respondé esto | Cuándo mirarla |
|---|---|---|
| [Tutorials](tutorials/) | "Nunca usé esto, guiame de punta a punta" | Primera vez que corrés el proyecto |
| [How-to guides](how-to/) | "Ya sé usar esto, ¿cómo hago X puntual?" | Tenés una tarea concreta para resolver |
| [Reference](reference/) | "Necesito el dato exacto" | Ya sabés qué buscás, solo necesitás el detalle |
| [Explanation](explanation/) | "Quiero entender el porqué" | Vas a tomar una decisión de diseño o revisar una existente |

## Tutorials

- [Levantar Norte-kpi localmente y generar tu primera estimación](tutorials/getting-started.md)

## How-to guides

- [Correr el proxy de Claude en local con Netlify Dev](how-to/run-locally-with-netlify-dev.md)
- [Deployar a Vercel](how-to/deploy-to-vercel.md) — plataforma principal
- [Deployar a Netlify](how-to/deploy-to-netlify.md) — secundaria, requiere confirmación
- [Actualizar benchmarks y reglas de negocio de los prompts](how-to/update-kpi-rules-and-benchmarks.md)
- [Integrar una herramienta externa (API pública)](how-to/integrate-external-tool.md)

## Reference

- [Estructura del repositorio](reference/repository-structure.md)
- [API pública — `/api/kpi-estimate` y `/api/kpi-evaluate`](reference/api.md)
- [Función proxy interna `claude.js` (Vercel y Netlify)](reference/netlify-function.md)
- [Schema de salida de los prompts (Seteador / Evaluador)](reference/prompts-output-schema.md)
- [Datos de configuración (clientes, etapas, plataformas, lapsos)](reference/configuration-data.md)
- [Variables de entorno](reference/environment-variables.md)

## Explanation

- [Arquitectura: por qué un proxy serverless](explanation/architecture.md)
- [Motor de cálculo: qué es determinístico y qué se delega en la IA](explanation/calculation-engine.md)
- [Design system: por qué se usan los tokens reales de Taquion](explanation/design-system.md)
- [Por qué el Seteador es un wizard y el Evaluador no](explanation/product-decisions.md)

---

`docs/SPEC.md` (la spec técnica original de este proyecto) se mantiene como
documento de contexto general, pero su contenido detallado fue repartido entre
estas cuatro categorías — es más fácil de mantener así que como un único
documento largo.
