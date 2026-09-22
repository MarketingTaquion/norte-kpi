# Integrar una herramienta externa con Norte-kpi

Contrato completo de los endpoints en [reference: API pública](../reference/api.md).
Esta guía muestra cómo conectarlos desde afuera.

## 1. Conseguí la API key

Pedile a quien administra el proyecto en Vercel (o Netlify, si estás
integrando contra ese deploy) el valor de `NORTE_API_KEY` (Project →
Settings → Environment Variables). Es una key propia de Norte-kpi — no
depende de ningún otro servicio ni la vas a poder deducir.

## 2. Probalo con `curl` antes de integrarlo

Generar una estimación:

```bash
curl -X POST https://norte-kpi.vercel.app/api/kpi-estimate \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: TU_NORTE_API_KEY" \
  -d '{
    "cliente": "Acme SRL",
    "pedidos": ["Quiero más leads calificados para el equipo comercial"],
    "presupuesto": 1000000,
    "plataformas": ["meta-ads"]
  }'
```

Si te devuelve `401`, revisá el header (tiene que ser exactamente `X-Api-Key`,
no `Authorization`). Si te devuelve `422`, te dice en el mensaje qué campo
obligatorio falta.

## 3. Integrar desde n8n

1. Nodo **HTTP Request**.
2. Method: `POST`. URL: `https://norte-kpi.vercel.app/api/kpi-estimate`.
3. **Headers**: agregá `X-Api-Key` con el valor de la key (guardala como
   credencial de n8n, no hardcodeada en el nodo, para poder rotarla sin tocar
   el workflow).
4. **Body**: `JSON`, con los campos de
   [la tabla de request](../reference/api.md#post-apikpi-estimate) — podés
   mapear campos de un nodo anterior (ej. un formulario, un CRM) a este JSON.
5. El nodo siguiente recibe directamente el JSON de la respuesta (matriz de
   KPIs) — es el mismo cálculo determinístico del browser, no depende de
   ningún servicio externo, así que no hay que lidiar con timeouts ni
   reintentos de un modelo de IA.

## 4. Manejo de errores en el workflow

Los códigos de error son estables (ver
[reference: errores](../reference/api.md)) — armá el workflow para
ramificar al menos en estos dos casos:

- `401` / `500` → problema de configuración (key incorrecta o no cargada), no
  reintentar automáticamente, avisar a quien administra la integración.
- `422` → el request que armó el workflow le faltó un campo obligatorio —
  error del lado de quien integra, no de Norte-kpi.
