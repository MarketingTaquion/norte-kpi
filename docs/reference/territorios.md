# Territorios — TAM/SAM/SOM y techo poblacional por localidad y plataforma

Referencia exhaustiva de `src/data/territorios.js`, `src/data/argentina.js`,
`src/data/rangosEtarios.js`, `src/data/rubros.js`,
`src/lib/calculator/territorio.js` y `src/lib/calculator/confianza.js` — el
mecanismo que evita que la calculadora proyecte más "personas alcanzadas" o
"seguidores" que la cantidad de gente que realmente vive en la zona
declarada, y que expone cuán confiable es cada número. Nace de un caso
real: un cliente de Mar del Plata pidiendo alcance, donde una estimación
puramente basada en presupuesto/CPM podía sugerir un número mayor a lo
plausible para esa localidad.

## Por qué existe

`setterCalculator.js` proyecta alcance con una fórmula de mercado (CPM ×
presupuesto → impresiones → personas). Esa fórmula no sabe nada de dónde
vive la audiencia — sin un techo, nada impide que el resultado supere la
población real de una ciudad chica. El "techo poblacional" es un límite
superior adicional: `min(proyección_por_presupuesto, techo_poblacional)`.

Ese techo se expone como un embudo **TAM → SAM → SOM** (ver [reference:
schema de salida](output-schema.md#tam--sam--som--confianza) para el shape
exacto) para que comercial vea no solo el número final, sino de dónde sale
y qué tan angosto o ancho es el margen de error — el objetivo explícito es
que nunca se venda algo demográficamente inalcanzable, ni se proyecte tan
corto que se deje plata sobre la mesa.

## De dónde sale cada número (y qué tan sólido es)

| Dato | Fuente | Solidez |
|---|---|---|
| Población por localidad (`territorios.js`) | Base: INDEC, Censo Nacional de Población, Hogares y Viviendas 2022 (aglomerados urbanos, vía REDATAM). Actualizada a 2026 — ver [Actualización de población a 2026](#actualización-de-población-a-2026) abajo | Alta — dato oficial |
| Población total del país (`argentina.js`, `POBLACION_ARGENTINA_TOTAL_2026`) | INDEC, "Estimaciones de población por departamento" 2022-2035 (proyección intercensal oficial, publicada feb. 2026) | Alta — dato oficial |
| Penetración de internet en Argentina (90,6%) | DataReportal, "Digital 2026: Argentina" (oct. 2025) | Alta — reporte de la industria, actualizado |
| Penetración de cada plataforma (`territorio.js`, sobre base de usuarios de internet) | Mismo reporte DataReportal | Alta, con una simplificación: Meta (Instagram+Facebook combinados) usa el mayor de los dos individualmente como proxy, no la suma — sumarlos sobreestimaría por gente que usa ambas |
| Pirámide etaria (`rangosEtarios.js`) | INDEC Censo 2022, vía un agregador secundario que cita el censo (no se pudo leer la tabla oficial de INDEC directamente — está en PDFs escaneados) | Media — tratar como estimación de trabajo, no exacta al decimal |
| Factor por rubro/interés (`rubros.js`) | **Ninguna fuente externa** — estimación interna de la agencia | Baja — es el eslabón más débil de la cadena, a propósito aislado en su propio archivo para que sea fácil de reemplazar cuando haya datos propios de campaña |

**Nunca tratar el factor de rubro con la misma confianza que la población o
la penetración de plataforma.** Si el equipo comercial junta datos reales
(ej. tasa de interés medida en campañas ya corridas), actualizar
`rubros.js` — es el único de los data files sin respaldo externo.
`rubros.js` también trae `pctNominizado` por rubro (ver [Desglose
anonimizado/nominizado](#desglose-anonimizado--nominizado) más abajo) — misma
solidez baja, mismo aviso. Esta tabla es exactamente lo que
`src/lib/calculator/confianza.js` codifica como `nivel: 'alta'` vs.
`nivel: 'interna'` — cualquier número que dependa del factor de rubro hereda
`'interna'` aunque el resto de la cadena (población, penetración) sea de
fuente alta, y el rango que se muestra se ensancha en consecuencia (ver
[reference: schema de salida](output-schema.md#tam--sam--som--confianza)).

## Actualización de población a 2026

El Censo 2022 crudo (aglomerados, vía REDATAM) no se reemplaza ciudad por
ciudad — INDEC no publicó un nuevo censo, solo una **proyección
intercensal por departamento** (`base_estimaciones_pob_deptos_2022_2035.csv`,
`censo.gob.ar/wp-content/uploads/2026/02/`, por departamento/año/sexo,
2022–2035). Esa fuente es más gruesa que nuestros aglomerados: un
departamento puede contener varias localidades ya cargadas (ej. Punilla en
Córdoba = Villa Carlos Paz + Cosquín + La Falda), y varios de nuestros
aglomerados "Gran X" abarcan **más de un** departamento INDEC (ej. "Gran
Córdoba" ≠ el departamento "Capital" de Córdoba, que es mucho más chico —
743.340 vs. 1.705.741 habitantes en 2022). Mapear cada aglomerado a "su"
departamento uno a uno no es verificable sin introducir error nuevo.

Por eso se usó un **ratio de crecimiento nacional único**, no
per-departamento: `46.466.688 / 46.135.579 = 1,007177` (población total del
país, 2026 vs. 2022, misma fuente), aplicado a las 164 cifras de
`territorios.js` tal como estaban. Es menos preciso que un ajuste
departamento por departamento *que fuera confiable* — pero un ratio
nacional aplicado de forma pareja es más seguro que un mapeo manual
propenso a error en el sentido incorrecto. `POBLACION_ARGENTINA_TOTAL_2026`
(`src/data/argentina.js`) — la suma de todos los departamentos para 2026 de
la misma fuente — es también el número que usa `tamNacional()` como base
del TAM cuando no hay territorio declarado.

## Rubro: por pedido, no global — con autocompletado

A diferencia de `territorio` y `rangoEtario` (declarados una vez para toda
la estimación, en el paso Territorio del wizard), **el rubro es un campo
por pedido** — cada fila de "¿Qué pidió el cliente?" tiene su propio select
de Rubro. Tiene sentido: dos pedidos de la misma estimación pueden ser de
intereses distintos (ej. "más leads de gastronomía" y "más seguidores para
indumentaria"), y un solo rubro global no podría representar ambos.

Al escribir el texto del pedido, `useSetterForm.js` autocompleta tanto la
Métrica (`classifyTextStrict()` en `kpiCatalog.js`) como el Rubro
(`classifyRubro()` en `rubros.js`) contra las `keywords` de cada categoría/
rubro — **solo mientras el campo siga vacío** (no pisa una elección manual
ya hecha), y **sin fallback**: si ninguna keyword matcheó, el campo queda
vacío en vez de asumir un valor sin señal real en el texto. Si se agrega un
rubro nuevo a `rubros.js`, agregarle también su lista de `keywords`.

## Localidades incluidas y las que no

`territorios.js` tiene ~165 localidades/aglomerados: CABA + los 24 partidos
del GBA cargados por separado, y las principales ciudades/aglomerados de
cada provincia (capitales, ciudades intermedias con población relevante
para pauta comercial). **No** incluye "Gran Buenos Aires" como una sola
entrada de 16,2M — eso derrotaría el propósito de la feature (acotar por
zona real). Tampoco es exhaustivo: pueblos chicos (menos de ~30.000
habitantes) no están cargados. Si falta una localidad que el equipo
comercial necesita, agregarla a `territorios.js` con el mismo formato
(`value`, `label`, `provincia`, `poblacion`) — idealmente verificando el
dato en `censo.gob.ar/index.php/gobiernos-locales/` (la consulta interactiva
de INDEC por localidad).

Casos con más de una fuente dando cifras distintas (documentados en el
comentario de cabecera de `territorios.js`):
- **Bahía Blanca**: se usó la cifra ciudad-proper (335.190), no la del
  aglomerado "Gran Bahía Blanca" (323.357) — ambas aparecían en cobertura de
  prensa del mismo release de INDEC.
- **Santa Fe capital**: dos cifras de prensa distinta (403.878 y 408.572,
  probablemente provisorio vs. definitivo) — se usó 403.878.
- **San Miguel de Tucumán**: se usó la cifra definitiva del aglomerado
  completo (1.052.194), no una cifra ciudad-sola de 590.342 que salió de
  resultados *provisorios* de enero 2023.
- **Neuquén, Santiago del Estero y Viedma**: no se encontró la población de
  la ciudad capital sola — están cargadas como el aglomerado combinado
  ("Neuquén - Plottier - Cipolletti", "Santiago del Estero - La Banda",
  "Viedma - Carmen de Patagones"), etiquetado así en el `label` para que
  quede claro que el número no es solo esa ciudad.

## Cómo se aplica el recorte

Solo se aplica a categorías cuyo número representa un conteo real de
personas/unidades — no a un ratio (ROAS), un % (engagement, retención,
conversión) ni un hito binario (setup). Hoy son cuatro: `alcance` (modo
`'alcance'` en `kpiCatalog.js`), `seguidores` (KPI técnico "Crecimiento de
audiencia"), y `leads`/`tráfico` (modo `'costo_por_unidad'` — son unidades
contables igual que las personas alcanzadas, así que también entran al
embudo). Ver `esProyeccionDePersonas()` en `setterCalculator.js`.

Plataformas sin familia de penetración conocida (Programática, Mercado Ads,
Email marketing, Influencers, PR/Prensa, Eventos) no tienen techo aplicable
con los datos disponibles hoy — su proyección no se recorta. `google-ads` y
`seo` usan directamente la penetración de internet (sin recorte de
plataforma), porque casi cualquier usuario de internet es alcanzable por
búsqueda.

## Desglose por plataforma

Cuando el Seteador tiene ≥1 plataforma seleccionada, cada `kpi` en el
resultado trae un `por_plataforma: [{ plataforma, proyeccion_min,
proyeccion_max, techo_poblacional }]` — el neto se divide en partes iguales
entre las plataformas elegidas, y cada una se recorta contra su propio
techo. El `proyeccion_min`/`proyeccion_max` "agregado" (a nivel del `kpi`,
no por plataforma) sigue calculándose con el neto completo, pero también se
recorta contra el **mayor** techo entre las plataformas seleccionadas — un
límite conservador que evita contar audiencia superpuesta entre canales sin
tener que modelar esa superposición con precisión.

## Comunidad: un escalón más allá del SOM

El embudo no termina en el SOM. Para clientes que corren el servicio de
Comunidad de Taquion (un flujo de ManyChat que arma un grupo de WhatsApp —
el mismo proceso para todos los clientes), tiene sentido preguntar: de toda
la gente alcanzable por pauta (SOM), ¿cuántos se terminan uniendo a ese
grupo? Eso es `comunidad` — `som × TASA_CAPTACION_COMUNIDAD`
(`src/data/comunidad.js`).

Es un escalón de naturaleza distinta al resto del embudo: TAM/SAM/SOM miden
techo de audiencia (¿cuánta gente existe/es alcanzable?), Comunidad mide
conversión/comportamiento (¿cuántos de los alcanzables dan el paso de
unirse?) — dos fuentes de incertidumbre distintas, por eso es su propio
escalón y no solo un recorte más del mismo tipo. Hoy `TASA_CAPTACION_COMUNIDAD`
es una sola tasa **global**, no por rubro: al momento de este cálculo,
Taquion corrió un solo flow de ManyChat — no hay muestra para diferenciar
por rubro sin inventar precisión falsa. El plan es calibrarla (y
eventualmente partirla por rubro, con un piso mínimo de campañas reales por
rubro) a través del mismo loop de calibración de la Fase 5 del plan de
TAM/SAM/SOM — ver el comentario de `src/data/comunidad.js`.

## Desglose anonimizado / nominizado

Cada `kpi` de tipo alcance/seguidores/leads/tráfico también trae `desglose_identidad:
{ anonimizado, nominizado }` (o `null` sin `comunidad.max`). Divide el
`comunidad.max` en dos — **no** el `som.max`: el split "¿dejó un dato
identificable o no?" solo tiene sentido una vez que la persona ya es
miembro del grupo de WhatsApp, no antes.

- **`nominizado`**: cuántos de esos miembros es razonable esperar que se
  identifiquen (formulario, CRM, opt-in del propio flujo) — `pctNominizado`
  del rubro.
- **`anonimizado`**: el resto — están en el grupo, pero sin dato
  identificable más allá del teléfono.

Ver `desgloseIdentidad()` en `territorio.js`. Igual que el factor de rubro,
`pctNominizado` es una estimación interna sin fuente externa — rubros de
intención/ticket alto (inmobiliario, servicios B2B) tienen un
`pctNominizado` mayor que consumo masivo de bajo compromiso (gastronomía,
entretenimiento), por juicio de la agencia, no por dato medido. Este campo
es conceptualmente independiente de los tipos de cliente "Nominizado" /
"Anonimizado" que ya existían en `src/data/clients.js` (esos describen si
los datos de un cliente de Comunidad identifican personas o no) — el
desglose acá aplica a cualquier cliente, es sobre la proyección, no sobre
el cliente en sí.

## El SOM nunca es un compromiso

`KpiCards.jsx` muestra, debajo de cada tarjeta, un disclaimer fijo:
*"Proyección de planificación interna, no es un compromiso — no reemplaza
el historial real de la cuenta del cliente."* — independientemente de la
confianza del número. El indicador de confianza (badge junto a la
"Proyección") y el disclaimer son dos mecanismos distintos: uno dice qué
tan sólida es la fuente, el otro recuerda que ninguna proyección reemplaza
el resultado real de una campaña ya corrida.

## Ver también

- [reference: calculadora](calculator.md) — categorías, benchmarks, `modo` de proyección.
- [reference: schema de salida](output-schema.md) — shape completo de `kpis[].por_plataforma`, `desglose_identidad` y `tam`/`sam`/`som`/`comunidad`/`confianza`.
