# Norte-kpi — Spec Técnica

Taquion / Ignite — documento interno · v1.0 · Septiembre 2026

Esta spec reemplaza a la anterior (`GIS_Spec_Tecnica_Netlify.docx`). Es una versión
propia, escrita contra el código que efectivamente se construyó — no es una copia
del documento original, que traía contenido de otras auditorías/proyectos que no
correspondían a esta herramienta.

## 1. Qué calcula Norte-kpi

Norte-kpi es la herramienta interna de Taquion/Ignite para que el equipo comercial
convierta un pedido coloquial de cliente ("quiero más leads", "necesito bajar el
CPA") en una **estimación de KPIs técnicos con proyección financiera y pacing**, y
para que el Líder de Ignite **audite de forma independiente** cualquier KPI antes
de presentarlo al cliente.

Dos módulos, dos roles:

| Módulo | Quién lo usa | Qué produce |
|---|---|---|
| **Seteador** (wizard) | Estratega / AM | Estimación: matriz de KPIs SMART, Tax Check, pacing, NSM |
| **Evaluador** (formulario) | Líder de Ignite | Auditoría independiente: veredicto, análisis SMART, viabilidad |

## 2. Producto — flujos de UX

### 2.1 Seteador: wizard paso a paso

El Seteador arranca cada estimación/cotización como un **wizard de 7 pasos**, no
como un formulario largo. Pantalla limpia, un tema por pantalla, barra de progreso
con puntos, navegación Atrás/Continuar:

1. Cliente
2. Etapa del proyecto (opcional, multi-select)
3. Período (lapso predefinido o fechas custom)
4. Presupuesto (con Tax Check en vivo)
5. Plataformas activas (opcional, agrupadas por SOP)
6. Pedidos del cliente + North Star Metric
7. Revisión final → "Generar estimación"

Al confirmar, la pantalla cambia a un **resultado de ancho completo** (matriz de
KPIs, Tax Check, pacing, próximos pasos) con un botón "+ Nueva estimación" que
resetea el wizard al paso 1. Ver [`SetterWizard.jsx`](../src/components/setter/SetterWizard.jsx)
y [`SetterTab.jsx`](../src/components/setter/SetterTab.jsx).

### 2.2 Evaluador: formulario único

El Evaluador es una auditoría puntual, no una cotización progresiva: no gana nada
con un wizard. Se mantiene como formulario de una sola pantalla (split
formulario/resultado). Ver [`EvaluatorTab.jsx`](../src/components/evaluator/EvaluatorTab.jsx).

## 3. Arquitectura

Mismo patrón de seguridad que la spec original: la API key de Anthropic nunca
llega al browser.

```
[Browser] → React (Vite) → fetch("/.netlify/functions/claude")
                                     ↓
                    [Netlify Function] claude.js
                                     ↓
                    [Anthropic API] Claude Sonnet
                                     ↓
                    [JSON] → React state → UI
```

- **Frontend**: React 18 + Vite 5, sin router (dos tabs en `App.jsx`).
- **Backend**: una única Netlify Function (`netlify/functions/claude.js`) que
  agrega la API key desde `process.env.ANTHROPIC_API_KEY` y reenvía a
  `api.anthropic.com`. Usa `fetch` nativo de Node 20 (sin dependencia `node-fetch`).
- **Deploy**: Netlify, build `npm run build`, publish `dist`, functions
  `netlify/functions` — ver `netlify.toml`.

## 4. Diseño — Taquion 2026 Design System

La primera versión de Norte-kpi usaba una paleta oscura ad-hoc ("fire/green/amber")
inventada para el prototipo. Se reemplazó por los tokens reales de marca, tomados
de `Taquion 2026 Design System/tokens/*.css` (fuente de verdad — no se
inventó ningún valor):

- **Color**: blanco/negro como base (70-90% de la composición), fucsia `#FF00B8`,
  naranja `#FFA900` y azul `#0026FF` como acentos puntuales. Gradiente
  "Comunidad" (fucsia → naranja, 135°) reservado para momentos de firma (banner
  de NSM), nunca como fondo general.
- **Tipografía**: Archivo (Regular/Medium/SemiBold/Bold/Black), copiada de
  `assets/fonts/` a `public/fonts/` y cargada vía `@font-face` en
  `src/styles/tokens.css`.
- **Forma**: radios rectos por convención — placas 0px, inputs 4px, cards 8px.
  Sombra casi inexistente; el sistema separa por contraste, no por elevación.
- **Marca**: isotipo + wordmark reales (`public/logo/`), copiados de
  `assets/logo/lockup-negro-2.png` (variante horizontal, la que usa el propio
  `Navbar.jsx` del design system).

Los tokens viven en [`src/styles/tokens.css`](../src/styles/tokens.css) y se
consumen desde [`src/index.css`](../src/index.css). No hay estilos con colores
hardcodeados fuera de esos dos archivos.

## 5. Motor de cálculo — estimaciones, cotizaciones y proyecciones

Esta es la pieza que Norte-kpi existe para resolver: traducir un pedido coloquial en
un número accionable con soporte financiero. Tiene tres componentes, cada uno con
una responsabilidad distinta y un nivel de confianza distinto.

### 5.1 Tax Check — determinístico, sin IA

Convierte presupuesto bruto en neto invertible. Es matemática pura, calculada en
el cliente en tiempo real mientras el usuario escribe (paso 4 del wizard), y
recalculada por la IA en su respuesta para que ambos números coincidan.

```
neto = bruto × (1 − 0.10 − 0.21 − 0.04) = bruto × 0.65
```

| Concepto | % | Ejemplo sobre $1.000.000 ARS |
|---|---|---|
| Fee de gestión | −10% | −$100.000 |
| IVA | −21% | −$210.000 |
| Percepciones | −4% | −$40.000 |
| **Neto invertible** | **65%** | **$650.000** |

Implementación: [`src/utils/tax.js`](../src/utils/tax.js) (`taxCalc()`, sin
dependencias, cubierto por el mismo cálculo tanto en el preview del wizard como
en el `stat-card` del resultado).

### 5.2 Motor de proyección de KPIs — asistido por IA, con reglas duras

El Seteador no calcula la proyección con una fórmula cerrada (a diferencia del Tax
Check): la delega en Claude, pero **acotada por reglas explícitas** en el system
prompt, no en texto libre.

**Entrada** (`buildUserPrompt` en `SetterTab.jsx`): cliente, etapas, período,
presupuesto + moneda, plataformas activas, NSM declarada u opcional, y la lista
de pedidos en lenguaje natural.

**Reglas de negocio que fuerzan el cálculo** (`src/prompts/setter.js`):

- *Routing por SOP*: plataforma paga → SOP Ignite (rige NSM + Tax Check);
  orgánica → SOP Comunidad (rige SMART puro); etapa de setup → SOP Setup (KPIs de
  hito, no de performance).
- *Sin presupuesto declarado* → la IA está obligada a devolver **rangos
  referenciales de benchmark**, nunca una meta cerrada — y a marcarlo.
  Los benchmarks (CTR, CPC, CPM, CPL, ROAS, engagement, LTV/CAC) están fijados en
  el prompt para el mercado argentino 2025-2026; la IA no puede inventar otros.
- *Con presupuesto*: la meta se calibra contra el **neto** (post Tax Check), no
  contra el bruto.
- *Pacing*: siempre 4 bloques acumulados (25/50/75/100% del período elegido),
  nunca otra cantidad de cortes.

**Salida**: JSON con schema fijo (`kpis[]` con `proyeccion_min`/`proyeccion_max`,
`tax_check`, `pacing[]`, `checklist_nsm[]`) — nunca markdown ni prosa libre. El
schema completo, con tipos explícitos, está al final de `setter.js` y actúa como
contrato: si Claude se desvía de él, `cleanJSON`/`parseResponse` (`src/utils/json.js`)
lo detectan y el error se muestra en el `ErrorBox` con el raw truncado, en vez de
romper la UI en silencio.

`max_tokens: 8000` — el Seteador genera múltiples KPIs por pedido y necesita
espacio; por eso el prompt exige strings compactos (80–100 caracteres por campo).

### 5.3 Motor de auditoría — reglas de rechazo + juicio de la IA

El Evaluador combina dos capas:

1. **Patrones de rechazo automático**, listados explícitamente en
   `src/prompts/evaluator.js` (6 errores que el prompt obliga a detectar: ROAS
   calculado sobre utilidad en vez de ingresos, KPI sin número concreto, sin
   plazo, de vanidad, meta matemáticamente imposible, o irrelevante para el
   objetivo declarado). Cada patrón mapea a qué criterio S.M.A.R.T. falla.
2. **Veredicto financiero**, determinístico una vez que hay presupuesto: mismo
   `neto = bruto × 0.65`, comparado contra un costo estimado para la meta
   declarada → superávit o déficit.

Los cuatro veredictos posibles (`APROBADO`, `RECHAZADO_VANIDAD`,
`RECHAZADO_INVIABILIDAD`, `CONDICIONADO`) son mutuamente excluyentes y están
definidos como reglas, no como una escala de sentimiento — el `confianza_pct` que
devuelve la IA es un dato adicional, nunca lo que decide el veredicto.

`max_tokens: 4000` — es una auditoría puntual sobre un único KPI, no una batería.

### 5.4 Por qué esta división (determinístico vs. IA)

Todo lo que tiene una fórmula cerrada (Tax Check, elección de SOP por plataforma,
estructura de pacing en 4 bloques) se resuelve en código, no se le pide a la IA
que lo calcule — evita que un LLM "invente" una cuenta de IVA. Todo lo que
requiere criterio de mercado (¿qué CPL es razonable para este vertical?, ¿esta
meta es alcanzable?) se delega en Claude, pero con benchmarks fijos y un schema de
salida cerrado para que el criterio no derive en alucinación de números.

## 6. Estructura de archivos

```
ignite-gis/
├── netlify/functions/claude.js       ← proxy serverless (única función)
├── public/
│   ├── fonts/                        ← Archivo (Regular…Black), copiado del DS
│   └── logo/                         ← isotipo + lockup horizontal, copiado del DS
├── src/
│   ├── styles/tokens.css             ← tokens de marca Taquion 2026 (fuente de verdad)
│   ├── index.css                     ← estilos de la app, consume los tokens
│   ├── data/                         ← clientes, etapas, plataformas, lapsos
│   ├── prompts/                      ← setter.js, evaluator.js (el "cerebro")
│   ├── hooks/                        ← useClaude, useSetterForm, useEvaluatorForm
│   ├── utils/                        ← tax.js (Tax Check), json.js (parseo seguro)
│   └── components/
│       ├── setter/                   ← SetterWizard, SetterResult, KpiTable, PacingGrid…
│       ├── evaluator/                ← EvaluatorForm, EvaluatorResult, SmartGrid…
│       └── shared/                   ← SelectableItem, ChipItem, PeriodPicker, TaxPreview…
├── docs/SPEC.md                      ← este documento
├── netlify.toml
└── package.json
```

## 7. Deploy en Netlify

1. `npm install` en `ignite-gis/`.
2. Variable de entorno en Netlify (Site → Environment variables):
   `ANTHROPIC_API_KEY = sk-ant-...` — nunca en el bundle del frontend.
3. Build command `npm run build`, publish dir `dist`, functions dir
   `netlify/functions` (ya configurado en `netlify.toml`).
4. Redirect `/* → /index.html` (200) para que la SPA sirva todas las rutas.
5. Acceso restringido recomendado: Basic Password Protection desde el dashboard
   de Netlify (herramienta interna, no pública).

Local: `netlify dev` levanta React + la function juntos en `localhost:8888`, con
`.env.local` (nunca commiteado) para `ANTHROPIC_API_KEY`.

## 8. Roadmap

| Feature | Prioridad | Nota |
|---|---|---|
| Persistencia de estimaciones por cliente | Alta | hoy no persiste nada — cada estimación se pierde al refrescar |
| Export a PDF de la matriz de KPIs | Alta | para adjuntar a la propuesta comercial |
| Wizard también para el Evaluador | Baja | descartado en v1 — es una auditoría puntual, no progresiva |
| Autenticación por rol (Estratega / Líder) | Media | hoy el acceso es único vía Basic Auth |
| Histórico real de CPL/CPA/ROAS por cliente | Alta | mejoraría la precisión de la proyección más que agregar más benchmarks genéricos |

## 9. Checklist de lanzamiento

- [ ] `ANTHROPIC_API_KEY` cargada en Netlify (Production + Preview)
- [ ] `.env.local` nunca commiteado (verificar `.gitignore`)
- [ ] `netlify dev` local: wizard completo genera JSON válido, Evaluador devuelve veredicto
- [ ] Probar sin presupuesto (KPIs referenciales, sin Tax Check) y con presupuesto (Tax Check correcto)
- [ ] Probar los 4 veredictos del Evaluador
- [ ] Basic Auth configurado antes de compartir la URL con el equipo
