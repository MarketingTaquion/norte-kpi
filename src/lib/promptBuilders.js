import { STAGES } from '../data/stages.js';
import { PLATFORM_GROUPS } from '../data/platforms.js';
import { LAPSOS } from '../data/lapsos.js';

// Compartido entre el frontend (SetterTab/EvaluatorTab) y los endpoints
// públicos de la API (netlify/functions/kpi-estimate.js, kpi-evaluate.js),
// para que ambos construyan el mismo user prompt a partir de los mismos
// campos, sin duplicar la lógica de resolución de labels.
const ALL_PLATFORMS = PLATFORM_GROUPS.flatMap((g) => g.items);

function resolveLabel(list, value) {
  return list.find((item) => item.value === value)?.label || value;
}

function resolvePeriodo(periodo) {
  if (!periodo) return 'No definido';
  if (periodo.lapso) return resolveLabel(LAPSOS, periodo.lapso);
  if (periodo.desde && periodo.hasta) return `${periodo.desde} a ${periodo.hasta}`;
  return 'No definido';
}

export function buildSetterUserPrompt({
  cliente,
  etapas = [],
  periodo,
  presupuesto,
  moneda = 'ARS',
  plataformas = [],
  pedidos = [],
  nsm,
} = {}) {
  const etapaLabels = etapas.map((v) => resolveLabel(STAGES, v));
  const plataformaLabels = plataformas.map((v) => resolveLabel(ALL_PLATFORMS, v));
  const pedidosValidos = (pedidos || []).map((p) => (p || '').trim()).filter(Boolean);

  const lines = [
    `Cliente: ${cliente || 'Sin cliente'}`,
    `Etapas del proyecto: ${etapaLabels.length ? etapaLabels.join(', ') : 'No especificadas'}`,
    `Período: ${resolvePeriodo(periodo)}`,
    `Presupuesto bruto: ${presupuesto || '0'} ${moneda}`,
    `Plataformas activas: ${plataformaLabels.length ? plataformaLabels.join(', ') : 'No especificadas'}`,
    `North Star Metric declarada: ${nsm || 'No declarada, inferir del conjunto de pedidos'}`,
    'Pedidos del cliente (traducir cada uno a KPI SMART):',
    ...pedidosValidos.map((p, i) => `${i + 1}. ${p}`),
  ];

  return lines.join('\n');
}

export function buildEvaluatorUserPrompt({
  cliente,
  plataformas = [],
  accion,
  indicador,
  alcanzable,
  segmento,
  periodo,
  presupuesto,
  moneda = 'ARS',
  cpcCpaRef,
  cpmRef,
  contexto,
} = {}) {
  const plataformaLabels = plataformas.map((v) => resolveLabel(ALL_PLATFORMS, v));

  const lines = [
    `Cliente: ${cliente || 'Sin cliente específico'}`,
    `Plataformas: ${plataformaLabels.length ? plataformaLabels.join(', ') : 'No especificadas'}`,
    'KPI declarado (SMART):',
    `  S - Acción: ${accion}`,
    `  M - Indicador: ${indicador}`,
    `  A - Por qué es alcanzable: ${alcanzable || 'No declarado'}`,
    `  R - Segmento: ${segmento}`,
    `  T - Período: ${resolvePeriodo(periodo)}`,
    `Presupuesto bruto: ${presupuesto || '0'} ${moneda}`,
    `CPC/CPA referencia: ${cpcCpaRef || 'No declarado'}`,
    `CPM referencia: ${cpmRef || 'No declarado'}`,
    `Contexto adicional: ${contexto || 'Ninguno'}`,
  ];

  return lines.join('\n');
}
