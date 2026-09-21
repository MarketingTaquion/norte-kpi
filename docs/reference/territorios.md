# Territorios — techo poblacional por localidad y plataforma

Referencia exhaustiva de `src/data/territorios.js`, `src/data/rangosEtarios.js`,
`src/data/rubros.js` y `src/lib/calculator/territorio.js` — el mecanismo que
evita que la calculadora proyecte más "personas alcanzadas" o "seguidores"
que la cantidad de gente que realmente vive en la zona declarada. Nace de un
caso real: un cliente de Mar del Plata pidiendo alcance, donde una
estimación puramente basada en presupuesto/CPM podía sugerir un número
mayor a lo plausible para esa localidad.

## Por qué existe

`setterCalculator.js` proyecta alcance con una fórmula de mercado (CPM ×
presupuesto → impresiones → personas). Esa fórmula no sabe nada de dónde
vive la audiencia — sin un techo, nada impide que el resultado supere la
población real de una ciudad chica. El "techo poblacional" es un límite
superior adicional: `min(proyección_por_presupuesto, techo_poblacional)`.

## De dónde sale cada número (y qué tan sólido es)

| Dato | Fuente | Solidez |
|---|---|---|
| Población por localidad (`territorios.js`) | INDEC, Censo Nacional de Población, Hogares y Viviendas 2022 (aglomerados urbanos, vía REDATAM) | Alta — dato oficial |
| Penetración de internet en Argentina (90,6%) | DataReportal, "Digital 2026: Argentina" (oct. 2025) | Alta — reporte de la industria, actualizado |
| Penetración de cada plataforma (`territorio.js`, sobre base de usuarios de internet) | Mismo reporte DataReportal | Alta, con una simplificación: Meta (Instagram+Facebook combinados) usa el mayor de los dos individualmente como proxy, no la suma — sumarlos sobreestimaría por gente que usa ambas |
| Pirámide etaria (`rangosEtarios.js`) | INDEC Censo 2022, vía un agregador secundario que cita el censo (no se pudo leer la tabla oficial de INDEC directamente — está en PDFs escaneados) | Media — tratar como estimación de trabajo, no exacta al decimal |
| Factor por rubro/interés (`rubros.js`) | **Ninguna fuente externa** — estimación interna de la agencia | Baja — es el eslabón más débil de la cadena, a propósito aislado en su propio archivo para que sea fácil de reemplazar cuando haya datos propios de campaña |

**Nunca tratar el factor de rubro con la misma confianza que la población o
la penetración de plataforma.** Si el equipo comercial junta datos reales
(ej. tasa de interés medida en campañas ya corridas), actualizar
`rubros.js` — es el único de los cuatro data files sin respaldo externo.
`rubros.js` también trae `pctNominizado` por rubro (ver [Desglose
anonimizado/nominizado](#desglose-anonimizado--nominizado) más abajo) — misma
solidez baja, mismo aviso.

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

Solo se aplica a categorías cuyo número representa personas/audiencia — no
a plata, leads, clics ni porcentajes. Hoy son exactamente dos: `alcance`
(modo `'alcance'` en `kpiCatalog.js`) y `seguidores` (KPI técnico
"Crecimiento de audiencia"). Ver `esAlcancePersonas()` en
`setterCalculator.js`.

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

## Desglose anonimizado / nominizado

Cada `kpi` de tipo alcance/seguidores también trae `desglose_identidad:
{ anonimizado, nominizado }` (o `null` sin rubro declarado, porque sin rubro
no hay base para estimar el split). Divide el `proyeccion_max` ya recortado
en dos:

- **`nominizado`**: cuánto de esa audiencia es razonable esperar que deje un
  dato identificable (formulario, CRM, opt-in) — `pctNominizado` del rubro.
- **`anonimizado`**: el resto — exposición vía pauta/alcance sin retorno
  identificable.

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

## Ver también

- [reference: calculadora](calculator.md) — categorías, benchmarks, `modo` de proyección.
- [reference: schema de salida](output-schema.md) — shape completo de `kpis[].por_plataforma` y `desglose_identidad`.
