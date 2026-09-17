# Norte-kpi

Herramienta interna de Taquion/Ignite: traduce pedidos coloquiales de
clientes en estimaciones de KPIs con proyección financiera y pacing
(Seteador), y audita de forma independiente un KPI antes de presentarlo al
cliente (Evaluador). React + Vite + funciones serverless (Vercel Functions
como plataforma principal, Netlify Functions como secundaria).

- **Documentación completa**: [`docs/index.md`](docs/index.md)
- **API pública** (para integrar otras herramientas): [`docs/reference/api.md`](docs/reference/api.md)
- **Deploy**: [Vercel](docs/how-to/deploy-to-vercel.md) es la plataforma principal (auto-deploy en cada push). [Netlify](docs/how-to/deploy-to-netlify.md) queda como secundaria, requiere confirmación antes de deployar ahí.

## Quick start

```bash
git clone https://github.com/MarketingTaquion/norte-kpi.git
cd norte-kpi
npm install
cp .env.example .env.local   # completar con tu ANTHROPIC_API_KEY
netlify dev
```

Guía completa, paso a paso, con resultado esperado:
[docs/tutorials/getting-started.md](docs/tutorials/getting-started.md).
