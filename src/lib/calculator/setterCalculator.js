// Calculadora interna del Seteador. Reemplaza la llamada a Claude: mismo
// schema de salida que documentaba prompts-output-schema.md, pero resuelto
// 100% en código — sin API key, sin llamada de red, sin depender de que
// un modelo "adivine" bien. Ver docs/explanation/calculation-engine.md.
import { STAGES } from '../../data/stages.js';
import { PLATFORM_GROUPS } from '../../data/platforms.js';
import { LAPSOS } from '../../data/lapsos.js';
import { taxCalc } from '../../utils/tax.js';
import { classifyText, findCategory, fuenteDeVerdad } from './kpiCatalog.js';
import { BENCHMARKS, midpoint } from './benchmarks.js';
import { findRubro } from '../../data/rubros.js';
import { findTerritorio, findRangoEtario, techoPoblacional, desgloseIdentidad } from './territorio.js';

const ALL_PLATFORMS = PLATFORM_GROUPS.flatMap((g) => g.items);
const PACING_BLOQUES = ['25%', '50%', '75%', '100%'];

function resolveLabels(list, values) {
  return (values || []).map((v) => list.find((item) => item.value === v)?.label).filter(Boolean);
}

function diasDelPeriodo(periodo) {
  if (!periodo) return 30;
  if (periodo.lapso) return LAPSOS.find((l) => l.value === periodo.lapso)?.dias || 30;
  if (periodo.desde && periodo.hasta) {
    const ms = new Date(periodo.hasta) - new Date(periodo.desde);
    if (Number.isFinite(ms) && ms > 0) return Math.max(1, Math.round(ms / 86400000));
  }
  return 30;
}

function round(n) {
  return Math.round(n);
}

// El wizard siempre manda `{ texto, categoria, rubro }` (categoria
// obligatoria, rubro opcional) — se acepta también un string plano para
// integraciones de la API pública que todavía no mandan esos campos, con
// classifyText() como fallback de categoria y sin rubro.
function normalizePedido(p) {
  if (typeof p === 'string') return { texto: p, categoria: '', rubro: '' };
  return { texto: p?.texto || '', categoria: p?.categoria || '', rubro: p?.rubro || '' };
}

// Calcula la proyección de un KPI según su "modo" — la parte que reemplaza
// el juicio de la IA: todo lo que tiene fórmula cerrada se resuelve acá,
// nunca se inventa un número.
function proyectarKpi(category, neto) {
  const b = category.benchmarkKey ? BENCHMARKS[category.benchmarkKey] : null;

  if (!neto || neto <= 0) {
    // Sin presupuesto: se devuelve el rango de benchmark tal cual, referencial.
    if (!b) return { min: 0, max: 0, meta: 'Hito a validar sin costo asociado.' };
    return {
      min: b.min,
      max: b.max,
      meta: `Rango referencial de mercado (sin presupuesto declarado): ${b.min}–${b.max}${b.unit === 'moneda' ? '' : b.unit}.`,
    };
  }

  switch (category.modo) {
    case 'roas': {
      const min = round(neto * b.min);
      const max = round(neto * b.max);
      return { min, max, meta: `Ingresos proyectados por publicidad: entre ${min} y ${max} (ROAS ${b.min}x–${b.max}x sobre el neto).` };
    }
    case 'costo_por_unidad': {
      const costoKey = category.costoBenchmarkKey || category.benchmarkKey;
      const costo = BENCHMARKS[costoKey] || b;
      const min = round(neto / costo.max);
      const max = round(neto / costo.min);
      return { min, max, meta: `Entre ${min} y ${max} unidades estimadas con el neto disponible (costo por unidad ${costo.min}–${costo.max}).` };
    }
    case 'alcance': {
      const impresionesMin = round((neto / b.max) * 1000);
      const impresionesMax = round((neto / b.min) * 1000);
      const frecuencia = midpoint('frecuencia') || 3;
      const min = round(impresionesMin / frecuencia);
      const max = round(impresionesMax / frecuencia);
      return { min, max, meta: `Alcance estimado entre ${min} y ${max} personas (CPM ${b.min}–${b.max}, frecuencia ~${frecuencia}x).` };
    }
    case 'porcentaje':
      return { min: b.min, max: b.max, meta: `Se sostiene el benchmark de mercado: ${b.min}%–${b.max}%.` };
    case 'hito':
      return { min: 1, max: 1, meta: 'Hito de implementación — se mide como cumplido/no cumplido, no como rango.' };
    default:
      return b
        ? { min: b.min, max: b.max, meta: `Rango referencial de mercado: ${b.min}–${b.max}${b.unit === 'moneda' ? '' : b.unit}.` }
        : { min: 0, max: 0, meta: 'Sin benchmark aplicable — se sugiere definir manualmente.' };
  }
}

// "Agresividad" de la proyección — qué tan ancho es el rango de benchmark
// de la categoría (max/min), en escala logarítmica 0–100. Un ratio angosto
// (ej. retencion, min=max) es la proyección más "conservadora" posible; un
// ratio ancho (ej. leads, trafico) implica más upside pero menos certeza —
// más "agresiva". Es una propiedad de la categoría, no del pedido puntual:
// el proyeccion_min/max de este calculador siempre abarca el benchmark
// completo, así que no hay una posición-dentro-del-benchmark que variar.
const AGRESIVIDAD_RATIO_MAX = 6;

function agresividadPct(category) {
  const key = category.costoBenchmarkKey || category.benchmarkKey;
  const b = key ? BENCHMARKS[key] : null;
  if (!b || !b.min || b.min <= 0) return 0;
  const ratio = b.max / b.min;
  if (ratio <= 1) return 0;
  return Math.round(Math.min(100, (Math.log(ratio) / Math.log(AGRESIVIDAD_RATIO_MAX)) * 100));
}

// Categorías cuyo número representa personas/audiencia (no plata, leads,
// clics ni un %) — son las que se recortan contra el techo poblacional del
// territorio para no proyectar más "alcance" o "seguidores" que gente vive
// en la zona. Ver src/lib/calculator/territorio.js.
function esAlcancePersonas(category) {
  return category.modo === 'alcance' || category.key === 'seguidores';
}

function inferirNsm(kpis, nsmDeclarada) {
  if (nsmDeclarada) {
    return { metrica: nsmDeclarada, razon: 'Declarada por el equipo comercial — se usa como brújula del resto de la matriz.' };
  }
  if (kpis.length === 0) {
    return { metrica: 'A definir', razon: 'No hay suficientes pedidos para inferir una North Star Metric.' };
  }
  const counts = {};
  kpis.forEach((k) => { counts[k.kpi_tecnico] = (counts[k.kpi_tecnico] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return {
    metrica: top,
    razon: `Inferida del conjunto de pedidos: es el KPI técnico que más se repite (${counts[top]} de ${kpis.length} pedidos).`,
  };
}

function armarPacing(kpis, dias) {
  const referencia = kpis.find((k) => k.proyeccion_max > 0) || kpis[0];
  const max = referencia ? referencia.proyeccion_max : 0;
  return PACING_BLOQUES.map((bloque) => {
    const pct = parseInt(bloque, 10) / 100;
    const acumulado = round(max * pct);
    const diaCorte = round(dias * pct);
    return {
      bloque,
      meta_acumulada: max > 0
        ? `Día ${diaCorte}: ${acumulado} acumulado de ${referencia.kpi_tecnico}`
        : `Día ${diaCorte} del período — checkpoint de avance`,
    };
  });
}

export function calculateSetterResult(fields) {
  const {
    etapas = [], periodo, presupuesto, moneda = 'ARS', plataformas = [], pedidos = [], nsm,
    territorio, rangoEtario,
  } = fields || {};

  const etapaLabels = resolveLabels(STAGES, etapas);
  const plataformaLabels = resolveLabels(ALL_PLATFORMS, plataformas);
  const pedidosValidos = (pedidos || [])
    .map(normalizePedido)
    .filter((p) => p.texto.trim().length > 0);
  const dias = diasDelPeriodo(periodo);

  const taxCheck = taxCalc(presupuesto || 0);
  const netoTotal = taxCheck.neto;
  const netoPorPedido = pedidosValidos.length > 0 ? netoTotal / pedidosValidos.length : 0;
  const netoPorPlataforma = plataformas.length > 0 ? netoPorPedido / plataformas.length : netoPorPedido;

  const setupForzado = etapaLabels.some((l) => l.toLowerCase().startsWith('setup'));

  const territorioObj = findTerritorio(territorio);
  const rangoEtarioObj = findRangoEtario(rangoEtario);

  const kpis = pedidosValidos.map((pedido) => {
    const category = findCategory(pedido.categoria) || classifyText(pedido.texto);
    const rubroObj = findRubro(pedido.rubro);
    const sop = setupForzado && category.sop !== 'SOP Ignite' ? 'SOP Setup' : category.sop;
    const alcancePersonas = esAlcancePersonas(category);
    let { min, max, meta } = proyectarKpi(category, netoPorPedido);

    // Desglose por plataforma — cada plataforma seleccionada se lleva una
    // porción igual del neto, y (si aplica) su propio techo poblacional.
    const porPlataforma = plataformas.length > 0
      ? plataformas.map((platValue) => {
        const platLabel = ALL_PLATFORMS.find((p) => p.value === platValue)?.label || platValue;
        const { min: pMin, max: pMax } = proyectarKpi(category, netoPorPlataforma);
        const techo = alcancePersonas ? techoPoblacional(territorioObj, platValue, rangoEtarioObj, rubroObj) : null;
        return {
          plataforma: platLabel,
          proyeccion_min: techo != null ? Math.min(pMin, techo) : pMin,
          proyeccion_max: techo != null ? Math.min(pMax, techo) : pMax,
          techo_poblacional: techo,
        };
      })
      : null;

    // El número "agregado" de arriba también se recorta contra el mayor
    // techo poblacional entre las plataformas seleccionadas — evita que la
    // proyección diga, por ejemplo, más seguidores que gente vive en la zona.
    if (alcancePersonas && territorioObj && plataformas.length > 0) {
      const techos = plataformas
        .map((p) => techoPoblacional(territorioObj, p, rangoEtarioObj, rubroObj))
        .filter((t) => t != null);
      if (techos.length > 0) {
        const techoTop = Math.max(...techos);
        if (max > techoTop) {
          max = techoTop;
          if (min > max) min = max;
          meta += ` Limitado por el techo poblacional de ${territorioObj.label} (~${techoTop.toLocaleString('es-AR')} personas alcanzables).`;
        }
      }
    }

    const texto = pedido.texto;
    return {
      pedido_original: texto.length > 95 ? `${texto.slice(0, 92)}...` : texto,
      sop,
      kpi_tecnico: category.kpi_tecnico,
      formula: category.formula,
      fuente_verdad: fuenteDeVerdad(plataformaLabels),
      meta_realista: meta,
      proyeccion_min: min,
      proyeccion_max: max,
      agresividad_pct: agresividadPct(category),
      territorio: territorioObj?.label || null,
      rubro: rubroObj?.label || null,
      por_plataforma: porPlataforma,
      desglose_identidad: alcancePersonas ? desgloseIdentidad(max, rubroObj) : null,
    };
  });

  const nsmResult = inferirNsm(kpis, nsm);
  const pacing = armarPacing(kpis, dias);

  const checklist_nsm = [
    '¿La NSM está conectada directamente a ingresos, retención o costo del negocio?',
    '¿Tiene una fuente de verdad clara, medible sin ambigüedad?',
    '¿El equipo puede accionar sobre ella semana a semana, no solo al cierre del período?',
    presupuesto > 0
      ? '¿El neto invertible alcanza para el volumen proyectado, según el Tax Check?'
      : '¿Hay presupuesto para pasar de rangos referenciales a una meta cerrada?',
  ];

  const proximos_pasos = [
    plataformaLabels.length > 0
      ? `Confirmar accesos y tracking en: ${plataformaLabels.join(', ')}.`
      : 'Definir plataformas activas y accesos necesarios antes de arrancar.',
    presupuesto > 0
      ? 'Validar el Tax Check con administración antes de comprometer el presupuesto con el cliente.'
      : 'Relevar presupuesto disponible para pasar de rangos referenciales a metas cerradas.',
    'Presentar la matriz de KPIs y el pacing al cliente en la reunión de kickoff.',
  ];

  const resumenBase = `NSM: ${nsmResult.metrica}. ${kpis.length} KPI(s) seteados${presupuesto > 0 ? `, neto disponible ${taxCheck.neto.toFixed(0)} ${moneda}` : ' sin presupuesto declarado'}.`;
  const resumen_ejecutivo = resumenBase.length > 200 ? `${resumenBase.slice(0, 197)}...` : resumenBase;

  return {
    nsm: nsmResult,
    stats: {
      kpis_seteados: kpis.length,
      neto_disponible: round(taxCheck.neto),
      metas_originales: pedidosValidos.length,
      metas_ajustadas: kpis.length,
    },
    tax_check: {
      bruto: round(taxCheck.bruto),
      fee: round(taxCheck.fee),
      iva: round(taxCheck.iva),
      percepciones: round(taxCheck.percepciones),
      neto: round(taxCheck.neto),
    },
    kpis,
    pacing,
    checklist_nsm,
    proximos_pasos,
    resumen_ejecutivo,
  };
}
