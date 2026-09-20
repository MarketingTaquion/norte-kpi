# Norte-kpi

Herramienta interna de Taquion/Ignite: traduce pedidos coloquiales de
clientes en estimaciones de KPIs con proyección financiera y pacing
(Seteador), y audita de forma independiente un KPI antes de presentarlo al
cliente (Evaluador). Los resultados los calcula una **calculadora interna
determinística** (`src/lib/calculator/`) — sin IA, sin API key, sin llamada
de red. React + Vite + una API pública opcional en funciones serverless
(Vercel Functions como plataforma principal, Netlify Functions como
secundaria) para integrar otras herramientas.

- **Sitio**: [norte-kpi.vercel.app](https://norte-kpi.vercel.app)
- **Documentación completa**: [`docs/index.md`](docs/index.md)
- **API pública** (para integrar otras herramientas): [`docs/reference/api.md`](docs/reference/api.md)
- **Deploy**: [Vercel](docs/how-to/deploy-to-vercel.md) es la plataforma principal (auto-deploy en cada push). [Netlify](docs/how-to/deploy-to-netlify.md) queda como secundaria, requiere confirmación antes de deployar ahí.

## Inicio rápido (Quick Start)

```bash
git clone https://github.com/MarketingTaquion/norte-kpi.git
cd norte-kpi
npm install
npm run dev
```

Listo — el wizard y el Evaluador funcionan de una, sin ninguna variable de
entorno. `NORTE_API_KEY` solo hace falta si vas a probar la API pública
(`/api/kpi-estimate`, `/api/kpi-evaluate`) para integraciones externas.

Guía completa, paso a paso, con resultado esperado:
[docs/tutorials/getting-started.md](docs/tutorials/getting-started.md).
