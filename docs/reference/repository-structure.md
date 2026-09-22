# Estructura del repositorio

```
norte-kpi/
├── api/                               ← Vercel Functions (principal), ver reference/api.md
│   └── kpi-estimate.js                ← API pública
├── netlify/functions/                 ← Netlify Functions (secundaria), mismo contrato que api/
│   └── kpi-estimate.js
├── public/
│   ├── fonts/                        ← Archivo (Regular…Black), copiado del design system de Taquion
│   └── logo/                         ← isotipo + lockup horizontal, copiado del design system de Taquion
├── src/
│   ├── styles/tokens.css             ← tokens de marca Taquion 2026 (fuente de verdad, ver explanation/design-system.md)
│   ├── index.css                     ← estilos de la app, consume los tokens
│   ├── data/                         ← clientes, etapas, plataformas, lapsos, territorios, rangos etarios, rubros (ver reference/configuration-data.md, reference/territorios.md)
│   ├── lib/
│   │   ├── calculator/               ← el "cerebro": categorías, benchmarks, territorio, cálculo (ver reference/calculator.md, reference/territorios.md)
│   │   └── apiAuth.js                ← auth de la API pública (X-Api-Key), compartido entre api/ y netlify/functions/
│   ├── hooks/                        ← useSetterForm
│   ├── utils/tax.js                  ← Tax Check (bruto → neto)
│   └── components/
│       ├── setter/                   ← SetterWizard, SetterResult, KpiCards, TaxCheckStrip, PacingTracker…
│       └── shared/                   ← SelectableItem, ChipItem, PeriodPicker, TaxPreview, SeverityGauge, RangeMeter…
├── docs/                             ← esta documentación
├── vercel.json                       ← build command, publish dir, rewrite de SPA (Vercel, principal)
├── netlify.toml                      ← build command, publish dir, redirects (Netlify, secundaria)
└── package.json
```

`src/lib/calculator/` es la pieza que evita duplicar lógica de negocio entre
el wizard (que la importa directo y calcula en el browser, sin red) y la API
pública: tanto `api/*.js` (Vercel) como
`netlify/functions/*.js` (Netlify) importan de ahí — lo único que cada
plataforma tiene por separado es el archivo de entrada con la firma que su
runtime espera (`(req, res)` en Vercel, `exports.handler = (event) => ...`
en Netlify). Ver [explanation: arquitectura](../explanation/architecture.md).
