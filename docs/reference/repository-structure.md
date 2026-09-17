# Estructura del repositorio

```
norte-kpi/
├── netlify/functions/claude.js       ← proxy serverless (única función, ver reference/netlify-function.md)
├── public/
│   ├── fonts/                        ← Archivo (Regular…Black), copiado del design system de Taquion
│   └── logo/                         ← isotipo + lockup horizontal, copiado del design system de Taquion
├── src/
│   ├── styles/tokens.css             ← tokens de marca Taquion 2026 (fuente de verdad, ver explanation/design-system.md)
│   ├── index.css                     ← estilos de la app, consume los tokens
│   ├── data/                         ← clientes, etapas, plataformas, lapsos (ver reference/configuration-data.md)
│   ├── prompts/                      ← setter.js, evaluator.js — el "cerebro" (ver reference/prompts-output-schema.md)
│   ├── hooks/                        ← useClaude, useSetterForm, useEvaluatorForm
│   ├── utils/                        ← tax.js (Tax Check), json.js (parseo seguro de la respuesta de la IA)
│   └── components/
│       ├── setter/                   ← SetterWizard, SetterResult, KpiTable, PacingGrid…
│       ├── evaluator/                ← EvaluatorForm, EvaluatorResult, SmartGrid…
│       └── shared/                   ← SelectableItem, ChipItem, PeriodPicker, TaxPreview…
├── docs/                             ← esta documentación
├── netlify.toml                      ← build command, publish dir, redirects
└── package.json
```
