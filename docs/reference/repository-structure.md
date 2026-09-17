# Estructura del repositorio

```
norte-kpi/
├── api/                               ← Vercel Functions (principal), ver reference/api.md
│   ├── claude.js                      ← proxy interno (equivalente a netlify/functions/claude.js)
│   ├── kpi-estimate.js                ← API pública
│   └── kpi-evaluate.js                ← API pública
├── netlify/functions/                 ← Netlify Functions (secundaria), mismo contrato que api/
│   ├── claude.js
│   ├── kpi-estimate.js
│   └── kpi-evaluate.js
├── public/
│   ├── fonts/                        ← Archivo (Regular…Black), copiado del design system de Taquion
│   └── logo/                         ← isotipo + lockup horizontal, copiado del design system de Taquion
├── src/
│   ├── styles/tokens.css             ← tokens de marca Taquion 2026 (fuente de verdad, ver explanation/design-system.md)
│   ├── index.css                     ← estilos de la app, consume los tokens
│   ├── data/                         ← clientes, etapas, plataformas, lapsos (ver reference/configuration-data.md)
│   ├── prompts/                      ← setter.js, evaluator.js — el "cerebro" (ver reference/prompts-output-schema.md)
│   ├── lib/                          ← promptBuilders.js, anthropic.js, apiAuth.js — compartido entre el frontend, api/ y netlify/functions/
│   ├── hooks/                        ← useClaude, useSetterForm, useEvaluatorForm
│   ├── utils/                        ← tax.js (Tax Check), json.js (parseo seguro de la respuesta de la IA)
│   └── components/
│       ├── setter/                   ← SetterWizard, SetterResult, KpiTable, PacingGrid…
│       ├── evaluator/                ← EvaluatorForm, EvaluatorResult, SmartGrid…
│       └── shared/                   ← SelectableItem, ChipItem, PeriodPicker, TaxPreview…
├── docs/                             ← esta documentación
├── vercel.json                       ← build command, publish dir, rewrite de SPA (Vercel, principal)
├── netlify.toml                      ← build command, publish dir, redirects (Netlify, secundaria)
└── package.json
```

`src/lib/` es la pieza que evita duplicar lógica de negocio entre las dos
plataformas de deploy: tanto `api/*.js` (Vercel) como `netlify/functions/*.js`
(Netlify) importan de ahí — lo único que cada uno tiene por separado es el
archivo de entrada con la firma que su runtime espera (`(req, res)` en Vercel,
`exports.handler = (event) => ...` en Netlify).
