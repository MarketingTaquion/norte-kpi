import { useEvaluatorForm } from '../../hooks/useEvaluatorForm.js';
import { useClaude } from '../../hooks/useClaude.js';
import { EVALUATOR_SYSTEM_PROMPT } from '../../prompts/evaluator.js';
import { buildEvaluatorUserPrompt } from '../../lib/promptBuilders.js';
import EvaluatorForm from './EvaluatorForm.jsx';
import EvaluatorResult from './EvaluatorResult.jsx';

// Mismo shape que espera /api/kpi-evaluate en el body — un solo lugar
// construye el texto del prompt, lo use el formulario o una herramienta externa.
function formToFields(form) {
  return {
    cliente: form.clients.find((c) => c.value === form.clientValue)?.label,
    plataformas: form.platformValues,
    accion: form.accion,
    indicador: form.indicador,
    alcanzable: form.alcanzable,
    segmento: form.segmento,
    periodo: form.periodMode === 'lapso'
      ? { lapso: form.lapsoValue }
      : { desde: form.fechaInicio, hasta: form.fechaFin },
    presupuesto: form.presupuesto,
    moneda: form.moneda,
    cpcCpaRef: form.cpcCpaRef,
    cpmRef: form.cpmRef,
    contexto: form.contexto,
  };
}

export default function EvaluatorTab() {
  const form = useEvaluatorForm();
  const { data, loading, error, call } = useClaude();

  const handleSubmit = () => {
    const userPrompt = buildEvaluatorUserPrompt(formToFields(form));
    call(EVALUATOR_SYSTEM_PROMPT, userPrompt, 4000);
  };

  return (
    <div className="split">
      <EvaluatorForm form={form} onSubmit={handleSubmit} loading={loading} />
      <EvaluatorResult data={data} loading={loading} error={error} moneda={form.moneda} />
    </div>
  );
}
