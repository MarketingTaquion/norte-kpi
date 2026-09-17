import { useState } from 'react';
import { useSetterForm } from '../../hooks/useSetterForm.js';
import { useClaude } from '../../hooks/useClaude.js';
import { SETTER_SYSTEM_PROMPT } from '../../prompts/setter.js';
import { buildSetterUserPrompt } from '../../lib/promptBuilders.js';
import SetterWizard from './SetterWizard.jsx';
import SetterResult from './SetterResult.jsx';

// Adapta el shape del hook de formulario al shape que espera buildSetterUserPrompt
// (el mismo que recibe /api/kpi-estimate en el body) — un solo lugar construye
// el texto del prompt, lo use el wizard o una herramienta externa.
function formToFields(form) {
  return {
    cliente: form.clients.find((c) => c.value === form.clientValue)?.label,
    etapas: form.stageValues,
    periodo: form.periodMode === 'lapso'
      ? { lapso: form.lapsoValue }
      : { desde: form.fechaInicio, hasta: form.fechaFin },
    presupuesto: form.presupuesto,
    moneda: form.moneda,
    plataformas: form.platformValues,
    pedidos: form.pedidos,
    nsm: form.nsm,
  };
}

export default function SetterTab() {
  const form = useSetterForm();
  const { data, loading, error, call, reset } = useClaude();
  const [phase, setPhase] = useState('wizard'); // 'wizard' | 'result'

  const handleComplete = async () => {
    setPhase('result');
    const userPrompt = buildSetterUserPrompt(formToFields(form));
    await call(SETTER_SYSTEM_PROMPT, userPrompt, 8000);
  };

  const handleNewEstimate = () => {
    reset();
    form.resetForm();
    setPhase('wizard');
  };

  if (phase === 'wizard') {
    return <SetterWizard form={form} onComplete={handleComplete} loading={loading} />;
  }

  return (
    <div>
      <div className="results-topbar">
        <span className="wizard-step-eyebrow">Estimación · {form.clients.find((c) => c.value === form.clientValue)?.label}</span>
        <button type="button" className="btn-secondary" onClick={handleNewEstimate}>
          + Nueva estimación
        </button>
      </div>
      <SetterResult data={data} loading={loading} error={error} moneda={form.moneda} />
    </div>
  );
}
