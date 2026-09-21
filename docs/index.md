# Documentación de Norte-kpi

Esta documentación está organizada según [Diátaxis](https://diataxis.fr/): cuatro
categorías separadas por lo que necesitás en el momento, no por tema. Cada
documento sirve un solo propósito — si buscás algo y no está donde esperabas,
probablemente esté en otra categoría de esta misma lista.

| Categoría | Respondé esto | Cuándo mirarla |
|---|---|---|
| [Tutoriales (Tutorials)](tutorials/) | "Nunca usé esto, guiame de punta a punta" | Primera vez que corrés el proyecto |
| [Guías prácticas (How-To Guides)](how-to/) | "Ya sé usar esto, ¿cómo hago X puntual?" | Tenés una tarea concreta para resolver |
| [Referencia (Reference)](reference/) | "Necesito el dato exacto" | Ya sabés qué buscás, solo necesitás el detalle |
| [Explicación (Explanation)](explanation/) | "Quiero entender el porqué" | Vas a tomar una decisión de diseño o revisar una existente |

## Tutoriales (Tutorials)

- [Levantar Norte-kpi localmente y generar tu primera estimación](tutorials/getting-started.md)

## Guías prácticas (How-To Guides)

- [Probar la API pública en local con Netlify Dev](how-to/run-locally-with-netlify-dev.md)
- [Deployar a Vercel](how-to/deploy-to-vercel.md) — plataforma principal
- [Deployar a Netlify](how-to/deploy-to-netlify.md) — secundaria, requiere confirmación
- [Actualizar benchmarks y reglas de la calculadora](how-to/update-kpi-rules-and-benchmarks.md)
- [Integrar una herramienta externa (API pública)](how-to/integrate-external-tool.md)

## Referencia (Reference)

- [Estructura del repositorio](reference/repository-structure.md)
- [API pública — `/api/kpi-estimate` y `/api/kpi-evaluate`](reference/api.md)
- [Calculadora interna — categorías, benchmarks y reglas](reference/calculator.md)
- [Territorios — techo poblacional por localidad y plataforma](reference/territorios.md)
- [Schema de salida (Seteador / Evaluador)](reference/output-schema.md)
- [Datos de configuración (clientes, etapas, plataformas, lapsos)](reference/configuration-data.md)
- [Variables de entorno](reference/environment-variables.md)

## Explicación (Explanation)

- [Arquitectura: por qué el cálculo es client-side y la API es opcional](explanation/architecture.md)
- [Motor de cálculo: por qué es 100% determinístico, sin IA](explanation/calculation-engine.md)
- [Sistema de diseño (Design System): por qué se usan los tokens reales de Taquion](explanation/design-system.md)
- [Por qué el Seteador es un wizard y el Evaluador no](explanation/product-decisions.md)

---

`docs/SPEC.md` (la spec técnica original de este proyecto) se mantiene como
documento de contexto general, pero su contenido detallado fue repartido entre
estas cuatro categorías — es más fácil de mantener así que como un único
documento largo.
