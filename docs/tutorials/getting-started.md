# Levantar Norte-kpi localmente y generar tu primera estimación

Este tutorial te lleva de cero a tener el Seteador de KPIs corriendo en tu
máquina y generando una estimación real. No hace falta que sepas nada del
proyecto de antemano, y **no necesitás ninguna API key** — los resultados
los calcula una calculadora interna determinística
([explanation](../explanation/calculation-engine.md)), no un modelo de IA.

## 1. Cloná el repo e instalá dependencias

```bash
git clone https://github.com/MarketingTaquion/norte-kpi.git
cd norte-kpi
npm install
```

## 2. Levantá el proyecto

```bash
npm run dev
```

Esto abre el proyecto en `http://localhost:5173` (Vite elige el próximo
puerto libre si ese está ocupado). No hace falta Netlify CLI ni Vercel CLI
para esto — el wizard corre enteramente en el browser.

## 3. Generá tu primera estimación

1. Entrá a la URL que imprimió `npm run dev`. Vas a ver el **Seteador de KPIs**
   con el wizard en el Paso 1.
2. **Paso 1 — Cliente**: elegí "Demo Retail" (o cualquiera de los demos) y
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

La pantalla cambia a la vista de resultado, calculada al instante: el North
Star Metric elegido (o inferido de los pedidos), la matriz de KPIs SMART, el
Tax Check (si cargaste presupuesto), el pacing en 4 bloques y los próximos
pasos sugeridos. Con el ejemplo de arriba y $1.000.000 de presupuesto, el KPI
técnico debería ser "CPL (Costo por Lead) y volumen de leads", con una
proyección entre ~433 y ~2167 leads.

Para volver a empezar, tocá **+ Nueva estimación** arriba a la derecha del
resultado.

## Próximos pasos

- Para entender cómo se calcula cada número (nada de esto es magia ni IA):
  [explanation: motor de cálculo](../explanation/calculation-engine.md).
- Para deployar esto a Netlify o Vercel:
  [how-to: deploy a Vercel](../how-to/deploy-to-vercel.md).
- Si además querés que otra herramienta (n8n, un CRM) llame a Norte-kpi por
  API, esa parte sí necesita una variable de entorno (`NORTE_API_KEY`) — ver
  [reference: API pública](../reference/api.md).
