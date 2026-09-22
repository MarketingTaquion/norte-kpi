# Deployar a Netlify

> **Netlify es secundaria desde 2026-09-17** — [Vercel](deploy-to-vercel.md)
> es la plataforma principal. Netlify cobra el build contra una cuota de
> créditos del plan, y con pushes frecuentes ese consumo se nota — por eso
> **cualquier deploy a Netlify necesita confirmación explícita antes de
> dispararse**, no es automático como Vercel. Esta página documenta cómo
> hacerlo cuando sí haga falta (ej. comparar builds, un fallback puntual).

Norte-kpi sigue conectado a Netlify vía GitHub (`MarketingTaquion/norte-kpi`
→ sitio `norte-kpi`, team `Marketing-Taquion-IGNITE`), pero el auto-deploy en
cada push está pensado para quedar pausado — confirmar el estado real en el
dashboard antes de asumir que un push allá disparó algo. Esta guía cubre tanto
el flujo normal como cómo levantar la conexión desde cero si hiciera falta.

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

## Cargar la API key (solo si vas a usar la API pública)

El wizard funciona de una, sin ninguna variable de entorno.
`NORTE_API_KEY` **no está en el repo** (por diseño, ver
[variables de entorno](../reference/environment-variables.md)) y solo hace
falta si vas a integrar la API pública con otra herramienta:

1. **Site → Project configuration → Environment variables → Add a variable**.
2. Key: `NORTE_API_KEY`, value: un random largo propio.
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
wizard del Seteador hasta "Generar estimación" — debería funcionar de una,
sin ningún `ErrorBox`, porque no depende de ninguna variable de entorno.
