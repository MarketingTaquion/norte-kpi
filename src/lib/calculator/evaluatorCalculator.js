// Calculadora interna del Evaluador. Reemplaza la llamada a Claude: auditoría
// determinística contra reglas SMART + benchmarks de mercado, sin API key ni
// llamada de red. Ver docs/explanation/calculation-engine.md.
import { PLATFORM_GROUPS } from '../../data/platforms.js';
import { LAPSOS } from '../../data/lapsos.js';
import { taxCalc } from '../../utils/tax.js';
import { classifyText } from './kpiCatalog.js';
import { BENCHMARKS } from './benchmarks.js';
import { containsAny, firstNumber } from './text.js';

const ALL_PLATFORMS = PLATFORM_GROUPS.flatMap((g) => g.items);
const PAID_VALUES = PLATFORM_GROUPS.find((g) => g.group === 'Paid / Ads')?.items.map((i) => i.value) || [];
const VERBOS_SMART = ['captar', 'lograr', 'reducir', 'mantener', 'aumentar', 'generar', 'mejorar', 'incrementar', 'disminuir', 'sostener'];
const VANITY_KEYWORDS = ['like', 'me gusta', 'likes', 'cantidad de publicaciones', 'cantidad de posts'];

function round(n) {
  return Math.round(n);
}

function diasDelPeriodo(periodo) {
  if (!periodo) return null;
  if (periodo.lapso) return LAPSOS.find((l) => l.value === periodo.lapso)?.dias || null;
  if (periodo.desde && periodo.hasta) {
    const ms = new Date(periodo.hasta) - new Date(periodo.desde);
    if (Number.isFinite(ms) && ms > 0) return Math.max(1, Math.round(ms / 86400000));
  }
  return null;
}

function checkS(accion) {
  if (!accion || !accion.trim()) {
    return { pass: false, nota: 'No se declaró una acción — el KPI no arranca con un verbo concreto.' };
  }
  const esEstandar = containsAny(accion, VERBOS_SMART);
  return esEstandar
    ? { pass: true, nota: `Acción concreta: "${accion.trim()}".` }
    : { pass: true, nota: `Verbo no estándar ("${accion.trim()}") — se recomienda usar Captar/Lograr/Reducir/Mantener.` };
}

function checkM(indicador, contexto) {
  const numero = firstNumber(indicador);
  if (numero === null) {
    return { pass: false, nota: 'El indicador no trae un número concreto ("más leads" no es medible; "500 leads" sí).' };
  }
  const roasSobreUtilidad = containsAny(indicador, ['roas']) && containsAny(`${indicador} ${contexto || ''}`, ['utilidad', 'ganancia', 'margen']);
  if (roasSobreUtilidad) {
    return { pass: false, nota: 'El ROAS parece calcularse sobre utilidad/margen en vez de ingresos brutos — invalida la métrica.' };
  }
  return { pass: true, nota: `Número concreto detectado: ${numero}.` };
}

function checkA(category, numero, alcanzable) {
  const b = category.benchmarkKey ? BENCHMARKS[category.benchmarkKey] : null;
  if (b && numero !== null) {
    if (category.modo === 'roas' && numero > b.max * 2.5) {
      return { pass: false, nota: `ROAS ${numero}x es matemáticamente improbable en el corto plazo (benchmark ${b.min}x–${b.max}x).` };
    }
    if (category.modo === 'costo_por_unidad' && numero < b.min * 0.3) {
      return { pass: false, nota: `Costo objetivo muy por debajo del benchmark de mercado (${b.min}–${b.max}) — meta poco realista.` };
    }
  }
  if (alcanzable && alcanzable.trim()) {
    return { pass: true, nota: `Evidencia declarada: "${alcanzable.trim()}".` };
  }
  return { pass: true, nota: 'Sin evidencia declarada, pero el valor pedido es compatible con benchmarks de mercado.' };
}

function checkR(segmento, esVanidad) {
  if (esVanidad) {
    return { pass: false, nota: 'La métrica es de vanidad: mide actividad pero no impacto de negocio.' };
  }
  if (!segmento || !segmento.trim()) {
    return { pass: false, nota: 'No se declaró a quién apunta el KPI (segmento).' };
  }
  return { pass: true, nota: `Segmento definido: "${segmento.trim()}".` };
}

function checkT(periodo) {
  const dias = diasDelPeriodo(periodo);
  if (!dias) {
    return { pass: false, nota: 'Sin plazo definido — no se puede auditar el pacing.' };
  }
  return { pass: true, nota: `Plazo definido: ${dias} días.` };
}

function estimarCostoObjetivo(category, numero, cpcCpaRef) {
  if (numero === null) return 0;
  if (category.modo === 'costo_por_unidad') {
    const refNum = firstNumber(cpcCpaRef);
    const costoUnitario = refNum || (BENCHMARKS[category.costoBenchmarkKey || category.benchmarkKey]
      ? (BENCHMARKS[category.costoBenchmarkKey || category.benchmarkKey].min + BENCHMARKS[category.costoBenchmarkKey || category.benchmarkKey].max) / 2
      : 0);
    return numero * costoUnitario;
  }
  return 0;
}

export function calculateEvaluatorResult(fields) {
  const {
    plataformas = [], accion, indicador, alcanzable, segmento, periodo,
    presupuesto, cpcCpaRef, contexto,
  } = fields || {};

  const category = classifyText(`${accion || ''} ${indicador || ''}`);
  const numero = firstNumber(indicador);
  const esVanidad = containsAny(indicador, VANITY_KEYWORDS) && !containsAny(`${segmento || ''} ${contexto || ''}`, ['venta', 'negocio', 'lead', 'conversion', 'conversión']);

  const smart = {
    s: checkS(accion),
    m: checkM(indicador, contexto),
    a: checkA(category, numero, alcanzable),
    r: checkR(segmento, esVanidad),
    t: checkT(periodo),
  };

  const taxCheck = taxCalc(presupuesto || 0);
  const neto = taxCheck.neto;
  const costoEstimado = presupuesto > 0 ? round(estimarCostoObjetivo(category, numero, cpcCpaRef)) : 0;
  const superavitDeficit = presupuesto > 0 ? round(neto - costoEstimado) : 0;

  const platformValuesSet = new Set(plataformas);
  const tienePlataformaPaga = PAID_VALUES.some((v) => platformValuesSet.has(v));

  let veredicto;
  if (esVanidad) {
    veredicto = 'RECHAZADO_VANIDAD';
  } else if (!smart.a.pass) {
    veredicto = 'RECHAZADO_INVIABILIDAD';
  } else if (presupuesto > 0 && costoEstimado > 0 && costoEstimado > neto) {
    veredicto = 'RECHAZADO_INVIABILIDAD';
  } else if (!smart.s.pass || !smart.m.pass || !smart.t.pass) {
    veredicto = 'CONDICIONADO';
  } else if (!(presupuesto > 0) && tienePlataformaPaga) {
    veredicto = 'CONDICIONADO';
  } else {
    veredicto = 'APROBADO';
  }

  const passes = Object.values(smart).filter((c) => c.pass).length;
  let confianza_pct = Math.min(96, 40 + passes * 12);
  if (veredicto.startsWith('RECHAZADO')) confianza_pct = Math.min(confianza_pct, 55);
  if (veredicto === 'CONDICIONADO') confianza_pct = Math.min(confianza_pct, 70);

  const dias = diasDelPeriodo(periodo);
  const pacing_sugerido = ['25%', '50%', '75%', '100%'].map((bloque) => {
    const pct = parseInt(bloque, 10) / 100;
    if (numero === null) {
      return { bloque, meta_acumulada: dias ? `Día ${round(dias * pct)} del período — checkpoint de avance` : 'Checkpoint de avance (sin plazo definido)' };
    }
    return {
      bloque,
      meta_acumulada: dias
        ? `Día ${round(dias * pct)}: ${round(numero * pct)} acumulado`
        : `${round(numero * pct)} acumulado (sin plazo definido para prorratear por día)`,
    };
  });

  const riesgos = [];
  if (!smart.t.pass) riesgos.push('Sin plazo definido: no hay forma de auditar el pacing ni el ritmo de avance.');
  if (!smart.a.pass) riesgos.push('La meta declarada es matemáticamente poco realista según benchmarks de mercado.');
  if (presupuesto > 0 && costoEstimado > neto) riesgos.push(`El costo estimado (${costoEstimado}) supera el neto disponible (${neto}).`);
  if (riesgos.length === 0 && !smart.m.pass) riesgos.push('El indicador no tiene un número concreto — dificulta medir el progreso real.');

  const recomendaciones = [];
  if (!smart.t.pass) recomendaciones.push('Definir un plazo concreto (lapso o fechas) antes de auditar viabilidad.');
  if (!(presupuesto > 0)) recomendaciones.push('Declarar presupuesto para poder auditar la viabilidad financiera del KPI.');
  if (!smart.a.pass || !alcanzable) recomendaciones.push('Documentar evidencia de alcanzabilidad: histórico similar o benchmark de mercado citado.');
  const rellenos = [
    'Revisar el KPI con el Líder de Ignite antes de presentarlo al cliente.',
    'Confirmar con el cliente que la fuente de verdad del indicador es accesible desde el día 1.',
    'Registrar este KPI y su veredicto en el histórico de la cuenta para referencia futura.',
  ];
  for (const relleno of rellenos) {
    if (recomendaciones.length >= 3) break;
    if (!recomendaciones.includes(relleno)) recomendaciones.push(relleno);
  }

  const kpi_alternativo = veredicto === 'APROBADO'
    ? null
    : `${category.kpi_tecnico} con meta dentro del benchmark ${BENCHMARKS[category.benchmarkKey]?.min ?? ''}–${BENCHMARKS[category.benchmarkKey]?.max ?? ''}${BENCHMARKS[category.benchmarkKey]?.unit === 'moneda' ? '' : (BENCHMARKS[category.benchmarkKey]?.unit || '')}, con plazo y presupuesto declarados.`;

  return {
    veredicto,
    confianza_pct: round(confianza_pct),
    smart,
    viabilidad: {
      presupuesto_bruto: round(taxCheck.bruto),
      presupuesto_neto: round(neto),
      costo_estimado: costoEstimado,
      superavit_deficit: superavitDeficit,
    },
    dias_totales: dias || 0,
    pacing_sugerido,
    riesgos: riesgos.slice(0, 2),
    recomendaciones: recomendaciones.slice(0, 3),
    kpi_alternativo,
  };
}
