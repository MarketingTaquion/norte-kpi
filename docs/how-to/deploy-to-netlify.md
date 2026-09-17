# Deployar a Netlify

Norte-kpi ya está conectado a Netlify vía GitHub (`MarketingTaquion/norte-kpi`
→ sitio `norte-kpi`, team `Marketing-Taquion-IGNITE`): cada push a `master`
dispara un build automático. Esta guía cubre tanto ese flujo normal como cómo
levantar la conexión desde cero si hiciera falta (por ejemplo, un fork o un
sitio nuevo).

## Deploy normal (ya conectado)

No hace falta hacer nada manual: pusheá a `master` y Netlify buildea y publica
solo, usando la config de [`netlify.toml`](../../netlify.toml)
(`npm run build`, publica `dist/`, functions en `netlify/functions`). Mirá el
progreso en **Netlify → norte-kpi → Deploys**.

## Conectar un repo nuevo desde cero

1. En Netlify: **Add new project → Import an existing project → GitHub**.
2. Si el repo no aparece en la lista aunque sea público o privado, es casi
   siempre porque la GitHub App de Netlify tiene acceso restringido a "Only
   select repositories". Andá a
   `github.com/settings/installations` → **Netlify** → **Configure** →
   agregá el repo en "Repository access" → **Save**. Volvé a Netlify y
   debería aparecer.
3. Elegí el repo, dejá el build command / publish dir que ya vienen de
   `netlify.toml` (no hace falta tocarlos), y confirmá el deploy.

## Cargar la API key

La `ANTHROPIC_API_KEY` **no está en el repo** (por diseño, ver
[variables de entorno](../reference/environment-variables.md)) y hay que
cargarla a mano en cada sitio nuevo:

1. **Site → Project configuration → Environment variables → Add a variable**.
2. Key: `ANTHROPIC_API_KEY`, value: la key real (`sk-ant-...`).
3. Scope: "Same value for all deploy contexts" (o al menos Production +
   Deploy previews).
4. Guardá y volvé a triggerear un deploy si el sitio ya estaba built antes de
   cargar la variable (**Deploys → Trigger deploy → Deploy site**).

## Restringir el acceso

Es una herramienta interna, no un sitio público. Dos formas de restringirlo,
sin tocar código:

- **Netlify (gratis, ya activo por default en proyectos privados del team)**:
  el sitio solo es visible para miembros del team de Netlify que lo tienen.
- **Basic Password Protection** (Netlify Pro): **Site → Access & security →
  Basic Password Protection** — agrega un usuario/contraseña simple delante de
  todo el sitio, independiente de quién sea miembro del team.

## Verificar que quedó bien

Después de un deploy nuevo, entrá a la URL pública del sitio y completá el
wizard del Seteador hasta "Generar estimación". Si tira `ErrorBox`, revisá
primero que la `ANTHROPIC_API_KEY` esté cargada (paso anterior) — es la causa
más común.
