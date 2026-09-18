# Norte-kpi — Spec

Taquion / Ignite — documento interno · v1.0 · Septiembre 2026

> El contenido técnico detallado de este documento se reorganizó siguiendo
> [Diátaxis](https://diataxis.fr/) en [`docs/index.md`](index.md) — tutorial,
> guías how-to, referencia técnica y explicaciones de diseño, cada una en su
> propio documento. Esta página queda como resumen ejecutivo y como el lugar
> donde vive el roadmap y el checklist de lanzamiento, que son contenido de
> seguimiento de proyecto más que documentación técnica.

Esta spec reemplaza a la anterior (`GIS_Spec_Tecnica_Netlify.docx`, del
prototipo original). Es una versión propia, escrita contra el código que
efectivamente se construyó — no una copia de aquel documento, que traía
contenido de otras auditorías/proyectos que no correspondían a esta
herramienta.

## Qué calcula Norte-kpi

Herramienta interna de Taquion/Ignite para que el equipo comercial convierta
un pedido coloquial de cliente en una **estimación de KPIs técnicos con
proyección financiera y pacing**, y para que el Líder de Ignite **audite de
forma independiente** cualquier KPI antes de presentarlo al cliente.

| Módulo | Quién lo usa | Qué produce | Documentación |
|---|---|---|---|
| **Seteador** (wizard) | Estratega / AM | Estimación: matriz de KPIs SMART, Tax Check, pacing, NSM | [Tutorial](tutorials/getting-started.md) · [Por qué es un wizard](explanation/product-decisions.md) |
| **Evaluador** (formulario) | Líder de Ignite | Auditoría independiente: veredicto, análisis SMART, viabilidad | [Por qué no es un wizard](explanation/product-decisions.md) |

Ver [`docs/index.md`](index.md) para arquitectura, motor de cálculo, design
system y todo el detalle técnico.

## Roadmap

| Feature | Prioridad | Nota |
|---|---|---|
| Persistencia de estimaciones por cliente | Alta | hoy no persiste nada — cada estimación se pierde al refrescar |
| Export a PDF de la matriz de KPIs | Alta | para adjuntar a la propuesta comercial |
| Wizard también para el Evaluador | Baja | descartado en v1 — es una auditoría puntual, no progresiva (ver [explanation](explanation/product-decisions.md)) |
| Autenticación por rol (Estratega / Líder) | Media | hoy el acceso es único vía Basic Auth / acceso de team |
| Histórico real de CPL/CPA/ROAS por cliente | Alta | mejoraría la precisión de la proyección más que agregar más benchmarks genéricos |
| Benchmarks B2B vs B2C automáticos | Media | hoy la calculadora usa siempre el rango B2C por default — ver [reference: calculadora](reference/calculator.md) |

## Checklist de lanzamiento

- [ ] `NORTE_API_KEY` cargada en Vercel (Production + Preview) si vas a usar la API pública — ver [how-to: deploy a Vercel](how-to/deploy-to-vercel.md). El wizard y el Evaluador no necesitan ninguna variable.
- [ ] `.env.local` nunca commiteado (verificar `.gitignore`)
- [ ] `npm run dev` local: wizard completo genera resultado, Evaluador devuelve veredicto — sin ningún `ErrorBox`
- [ ] Probar sin presupuesto (KPIs referenciales, sin Tax Check) y con presupuesto (Tax Check correcto)
- [ ] Probar los 4 veredictos del Evaluador
- [ ] Acceso restringido configurado antes de compartir la URL con el equipo

## Nota sobre plataforma de deploy

Desde 2026-09-17, **Vercel es la plataforma principal** (auto-deploy en cada
push a `master`) — Netlify quedó conectada como secundaria porque cobra el
build contra una cuota de créditos y con pushes frecuentes eso se nota.
Cualquier deploy a Netlify requiere confirmación explícita antes de
dispararse. Ver [explanation: arquitectura](explanation/architecture.md#por-qué-dos-plataformas-de-deploy-vercel--netlify).
