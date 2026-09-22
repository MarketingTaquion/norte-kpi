# API pública

Un endpoint para que herramientas externas (n8n, un CRM, un backend propio)
generen una estimación sin pasar por el wizard del browser. Corre la misma
[calculadora determinística](calculator.md) que usa el browser — nada de IA,
nada de red hacia un tercero. Es público en el sentido de "alcanzable desde
internet", por eso requiere autenticación.

El endpoint tiene una implementación por plataforma de deploy, con
**contrato idéntico** (mismo request, misma response, mismos códigos de
error) — la diferencia es solo dónde vive el código:

| Plataforma | `kpi-estimate` |
|---|---|
| Vercel (principal) | [`api/kpi-estimate.js`](../../api/kpi-estimate.js) |
| Netlify (secundaria) | [`netlify/functions/kpi-estimate.js`](../../netlify/functions/kpi-estimate.js) |

Ambas comparten la misma lógica de negocio desde
[`src/lib/calculator/`](../../src/lib/calculator/) — nada de esto está
duplicado entre plataformas, solo el archivo de entrada que Vercel/Netlify
esperan en su propia convención.

## Autenticación (Auth)

Todas las requests necesitan el header:

```
X-Api-Key: <NORTE_API_KEY>
```

`NORTE_API_KEY` es una key propia de Norte-kpi, cargada en las Environment
Variables del proyecto en Vercel (o Netlify, si el deploy que estás llamando
es ese) — ver [deploy-to-vercel.md](../how-to/deploy-to-vercel.md). Protege
el endpoint de ser invocado por cualquiera que encuentre la URL — no protege
ninguna llamada a un tercero, porque no hay ninguna (ver
[explanation: arquitectura](../explanation/architecture.md)). Es una sola key
compartida para todas las integraciones en v1 — no hay keys por integración
todavía (ver `docs/SPEC.md`, roadmap).

Sin el header, o con un valor que no matchea: `401`.
Si `NORTE_API_KEY` no está configurada en el sitio: `500` (la API queda
deshabilitada hasta que se cargue, no falla en modo abierto).

## `POST /api/kpi-estimate`

Genera una estimación de KPIs — el mismo resultado que produce el wizard del
Seteador al llegar al paso 7, sin la interacción paso a paso.

Función real: [`api/kpi-estimate.js`](../../api/kpi-estimate.js) (Vercel) / [`netlify/functions/kpi-estimate.js`](../../netlify/functions/kpi-estimate.js) (Netlify).
Calcula con [`calculateSetterResult()`](../../src/lib/calculator/setterCalculator.js) — ver
[schema de salida completo](output-schema.md#seteador--calculatesetterresult).

### Solicitud (Request)

```
POST /api/kpi-estimate
Content-Type: application/json
X-Api-Key: <NORTE_API_KEY>
```

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `cliente` | `string` | **Sí** | Nombre libre, no necesita matchear `src/data/clients.js` |
| `pedidos` | `string[]` \| `{ texto: string, categoria: string, rubro?: string }[]` | **Sí** (mín. 1 no vacío) | Pedidos en lenguaje coloquial. El wizard siempre manda `{ texto, categoria, rubro }` — `categoria` es un value de [`CATEGORY_OPTIONS`](calculator.md) (ej. `"leads"`) y fija la fórmula/benchmark sin adivinar; `rubro` es un value de [`RUBROS`](../../src/data/rubros.js) (ej. `"gastronomia"`, opcional, por pedido — no global) y afina el techo poblacional de ESE pedido. Un string plano sigue soportado para integraciones que no manden `categoria`/`rubro` — se clasifican por keywords con `classifyText()`/`classifyRubro()` |
| `etapas` | `string[]` | No | Values de [`STAGES`](configuration-data.md#srcdatastagesjs--stages) (ej. `"comunidad-captacion"`) |
| `periodo` | `{ lapso: string }` \| `{ desde: string, hasta: string }` | No | `lapso` es un value de [`LAPSOS`](configuration-data.md#srcdatalapsosjs--lapsos) (ej. `"mes-1"`); `desde`/`hasta` son fechas `YYYY-MM-DD` |
| `presupuesto` | `number` | No | Bruto. Si se omite, se devuelven rangos de benchmark referenciales sin Tax Check. El wizard solo ofrece `5000000`, `10000000` o `12000000` (o vacío) vía [`PRESUPUESTO_OPTIONS`](../../src/data/presupuestos.js) — pero la API/la calculadora no validan ese límite, cualquier número positivo es aceptado |
| `moneda` | `"ARS"` \| `"USD"` | No | Default `"ARS"` |
| `plataformas` | `string[]` | No | Values de [`PLATFORM_GROUPS`](configuration-data.md#srcdataplatformsjs--platform_groups) (ej. `"meta-ads"`). Si hay ≥1, cada `kpi` del resultado trae un desglose `por_plataforma` (neto dividido en partes iguales entre ellas) |
| `territorio` | `string` | No (recomendado si el KPI es alcance/seguidores) | Value de [`TERRITORIOS`](../../src/data/territorios.js) (ej. `"mar-del-plata"`). Recorta `alcance`/`seguidores` contra la población real de la zona — ver [reference: territorios](territorios.md) |
| `rangoEtario` | `string` | No | Value de [`RANGOS_ETARIOS`](../../src/data/rangosEtarios.js) (ej. `"18-24"`). Acota más el techo poblacional; sin esto se usa el 100% de la población |
| `nsm` | `string` | No | North Star Metric declarada; si se omite, se infiere del KPI técnico más repetido entre los pedidos |

Ejemplo:

```json
{
  "cliente": "Acme SRL",
  "pedidos": [{ "texto": "Quiero más leads calificados para el equipo comercial", "categoria": "leads", "rubro": "servicios-profesionales" }],
  "etapas": ["comunidad-captacion"],
  "periodo": { "lapso": "mes-1" },
  "presupuesto": 1000000,
  "moneda": "ARS",
  "plataformas": ["meta-ads", "google-ads"],
  "territorio": "mar-del-plata"
}
```

### Respuesta (Response) `200`

El mismo JSON que consume `SetterResult.jsx` — ver
[schema completo](output-schema.md#seteador--calculatesetterresult).

### Errores

| Status | Causa |
|---|---|
| `405` | Método distinto de `POST` |
| `401` / `500` | Ver sección Autenticación (Auth) |
| `400` | Body no es JSON válido |
| `422` | Falta `cliente` o `pedidos` (o `pedidos` está vacío) |
| `500` | Excepción no esperada del cálculo (ej. un `periodo` malformado) — no debería pasar con input válido |

## Ver también

- [How-to: integrar una herramienta externa](../how-to/integrate-external-tool.md) — ejemplos con `curl` y n8n.
- [Variables de entorno](environment-variables.md) — cómo cargar `NORTE_API_KEY`.
