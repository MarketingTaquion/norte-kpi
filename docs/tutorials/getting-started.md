# Levantar Norte-kpi localmente y generar tu primera estimación

Este tutorial te lleva de cero a tener el Seteador de KPIs corriendo en tu
máquina y generando una estimación real. No hace falta que sepas nada del
proyecto de antemano.

## 1. Cloná el repo e instalá dependencias

```bash
git clone https://github.com/MarketingTaquion/norte-kpi.git
cd norte-kpi
npm install
```

## 2. Conseguí una API key de Anthropic

Necesitás una API key válida de Anthropic (`sk-ant-...`) para que la IA
responda. Si no tenés una, pedísela a quien administre la cuenta de Anthropic
del equipo — no se comparte por chat ni se commitea a este repo.

## 3. Creá tu archivo de variables de entorno

En la raíz del proyecto:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y reemplazá el valor de ejemplo por tu key real:

```
ANTHROPIC_API_KEY=sk-ant-tu-key-real-aca
```

`.env.local` está en `.gitignore` — nunca se sube al repo.

## 4. Levantá el proyecto con Netlify Dev

Este proyecto tiene frontend (React) y backend (una Netlify Function) — para
que ambos corran juntos y la function pueda leer tu `.env.local`, usá Netlify
CLI en vez de `npm run dev` (el detalle de por qué está en
[la guía de Netlify Dev](../how-to/run-locally-with-netlify-dev.md); acá van
solo los comandos mínimos para completar el tutorial):

```bash
npm install -g netlify-cli   # si no la tenés instalada
netlify dev
```

Esto abre el proyecto en `http://localhost:8888`.

## 5. Generá tu primera estimación

1. Entrá a `http://localhost:8888`. Vas a ver la tab **01 · Seteador de KPIs**
   con el wizard en el Paso 1.
2. **Paso 1 — Cliente**: elegí "Cliente genérico" (o cualquiera de los demos) y
   tocá **Continuar**.
3. **Pasos 2 a 5** (Etapa, Período, Presupuesto, Plataformas): son opcionales,
   podés dejarlos vacíos y seguir tocando **Continuar**. Si querés ver el Tax
   Check en acción, cargá un presupuesto en el paso 4 (ej. `1000000`) y vas a
   ver el desglose de fee/IVA/percepciones actualizarse en vivo.
4. **Paso 6 — Pedidos**: escribí al menos un pedido en lenguaje coloquial, por
   ejemplo:
   > Quiero más leads calificados para el equipo comercial
5. **Paso 7 — Revisión**: revisá el resumen y tocá **Generar estimación**.

## Resultado esperado

La pantalla cambia a la vista de resultado con: el North Star Metric elegido
(o inferido), la matriz de KPIs SMART, el Tax Check (si cargaste presupuesto),
el pacing en 4 bloques y los próximos pasos sugeridos. Si en cambio ves un
`ErrorBox`, revisá que tu `ANTHROPIC_API_KEY` en `.env.local` sea válida y que
estés corriendo `netlify dev` (no `npm run dev` a secas).

Para volver a empezar, tocá **+ Nueva estimación** arriba a la derecha del
resultado.

## Próximos pasos

- Para entender qué hace la tab **02 · Evaluador de KPIs**, probala directo:
  no es un wizard, es un formulario de una sola pantalla.
- Para deployar esto a Netlify en vez de correrlo local, ver
  [Deployar a Netlify](../how-to/deploy-to-netlify.md).
