# Sistema de diseño (Design System): por qué se usan los tokens reales de Taquion

## De dónde viene

La primera versión de Norte-kpi usaba una paleta oscura ad-hoc ("fire / green
/ amber") inventada para el prototipo original. Se reemplazó por los tokens
reales de marca, tomados de
`Taquion 2026 Design System/tokens/*.css` (fuente de verdad — no se inventó
ningún valor nuevo).

## Qué se trajo y qué se dejó afuera

Esa carpeta de design system contiene mucho más que tokens de UI: guidelines
editoriales de slides, assets de campañas de clientes específicos, plantillas
de presentaciones. Nada de eso aplica a una herramienta de software interna.
Solo se copiaron al repo:

- `tokens/*.css` → refundidos en [`src/styles/tokens.css`](../../src/styles/tokens.css)
- `assets/fonts/` (Archivo Regular/Medium/SemiBold/Bold/Black) → `public/fonts/`
- El lockup horizontal del logo (`assets/logo/lockup-negro-2.png`, la misma
  variante que usa el propio `Navbar.jsx` del design system para
  `variant="horizontal"`) → `public/logo/`

## Decisiones de marca que sí importan para la UI

- **Color**: blanco/negro como base (70–90% de la composición), fucsia
  `#FF00B8`, naranja `#FFA900` y azul `#0026FF` como acentos puntuales. El
  gradiente "Comunidad" (fucsia → naranja, 135°) es un recurso de firma, no un
  fondo general — se usa una sola vez, en el banner del North Star Metric.
- **Tipografía**: Archivo, cargada vía `@font-face` local (no Google Fonts) —
  el proyecto no depende de un CDN externo para su tipografía.
- **Forma**: radios rectos por convención de marca (placas 0px, inputs 4px,
  cards 8px) y sombra casi inexistente — el sistema separa por contraste, no
  por elevación. Esto es deliberado y viene directo de
  `manual-de-marca/REGLAS-CRITICAS.md` del design system: no es un detalle
  arbitrario de esta app.

## Dónde viven los tokens en el código

Todo en [`src/styles/tokens.css`](../../src/styles/tokens.css), consumido
desde [`src/index.css`](../../src/index.css). No hay colores ni valores de
tipografía hardcodeados fuera de esos dos archivos — si necesitás un color
nuevo, agregalo como variable `--tq-*` ahí, nunca inline en un componente.

<!-- TODO(humano): si en algún momento el design system de Taquion 2026 se
actualiza (nueva paleta, nueva tipografía), ¿hay un proceso definido para
sincronizar `src/styles/tokens.css` con la fuente de verdad, o queda a
criterio de quien lo note? -->
