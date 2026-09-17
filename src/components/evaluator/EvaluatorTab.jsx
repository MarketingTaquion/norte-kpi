import { useEvaluatorForm } from '../../hooks/useEvaluatorForm.js';
import { useClaude } from '../../hooks/useClaude.js';
import { EVALUATOR_SYSTEM_PROMPT } from '../../prompts/evaluator.js';
import { PLATFORM_GROUPS } from '../../data/platforms.js';
import { LAPSOS } from '../../data/lapsos.js';
import EvaluatorForm from './EvaluatorForm.jsx';
import EvaluatorResult from './EvaluatorResult.jsx';

function buildUserPrompt(form) {
  const cliente = form.clients.find((c) => c.value === form.clientValue)?.label || 'Sin cliente específico';
  const plataformas = form.platformValues
    .map((v) => PLATFORM_GROUPS.flatMap((g) => g.items).find((p) => p.value === v)?.label)
    .filter(Boolean);
  const periodo = form.periodMode === 'lapso'
    ? LAPSOS.find((l) => l.value === form.lapsoValue)?.label || 'No definido'
    : (form.fechaInicio && form.fechaFin ? `${form.fechaInicio} a ${form.fechaFin}` : 'No definido');

  const lines = [
    `Cliente: ${cliente}`,
    `Plataformas: ${plataformas.length ? plataformas.join(', ') : 'No especificadas'}`,
    `KPI declarado (SMART):`,
    `  S - Acción: ${form.accion}`,
    `  M - Indicador: ${form.indicador}`,
    `  A - Por qué es alcanzable: ${form.alcanzable || 'No declarado'}`,
    `  R - Segmento: ${form.segmento}`,
    `  T - Período: ${periodo}`,
    `Presupuesto bruto: ${form.presupuesto || '0'} ${form.moneda}`,
    `CPC/CPA referencia: ${form.cpcCpaRef || 'No declarado'}`,
    `CPM referencia: ${form.cpmRef || 'No declarado'}`,
    `Contexto adicional: ${form.contexto || 'Ninguno'}`,
  ];

  return lines.join('\n');
}

export default function EvaluatorTab() {
  const form = useEvaluatorForm();
  const { data, loading, error, call } = useClaude();

  const handleSubmit = () => {
    const userPrompt = buildUserPrompt(form);
    call(EVALUATOR_SYSTEM_PROMPT, userPrompt, 4000);
  };

  return (
    <div className="split">
      <EvaluatorForm form={form} onSubmit={handleSubmit} loading={loading} />
      <EvaluatorResult data={data} loading={loading} error={error} moneda={form.moneda} />
    </div>
  );
}
