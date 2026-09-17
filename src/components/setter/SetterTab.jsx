import { useState } from 'react';
import { useSetterForm } from '../../hooks/useSetterForm.js';
import { useClaude } from '../../hooks/useClaude.js';
import { SETTER_SYSTEM_PROMPT } from '../../prompts/setter.js';
import { STAGES } from '../../data/stages.js';
import { PLATFORM_GROUPS } from '../../data/platforms.js';
import { LAPSOS } from '../../data/lapsos.js';
import SetterWizard from './SetterWizard.jsx';
import SetterResult from './SetterResult.jsx';

function buildUserPrompt(form) {
  const cliente = form.clients.find((c) => c.value === form.clientValue)?.label || 'Sin cliente';
  const etapas = form.stageValues.map((v) => STAGES.find((s) => s.value === v)?.label).filter(Boolean);
  const plataformas = form.platformValues
    .map((v) => PLATFORM_GROUPS.flatMap((g) => g.items).find((p) => p.value === v)?.label)
    .filter(Boolean);
  const periodo = form.periodMode === 'lapso'
    ? LAPSOS.find((l) => l.value === form.lapsoValue)?.label || 'No definido'
    : `${form.fechaInicio || '?'} a ${form.fechaFin || '?'}`;
  const pedidos = form.pedidos.filter((p) => p.trim().length > 0);

  const lines = [
    `Cliente: ${cliente}`,
    `Etapas del proyecto: ${etapas.length ? etapas.join(', ') : 'No especificadas'}`,
    `Período: ${periodo}`,
    `Presupuesto bruto: ${form.presupuesto || '0'} ${form.moneda}`,
    `Plataformas activas: ${plataformas.length ? plataformas.join(', ') : 'No especificadas'}`,
    `North Star Metric declarada: ${form.nsm || 'No declarada, inferir del conjunto de pedidos'}`,
    'Pedidos del cliente (traducir cada uno a KPI SMART):',
    ...pedidos.map((p, i) => `${i + 1}. ${p}`),
  ];

  return lines.join('\n');
}

export default function SetterTab() {
  const form = useSetterForm();
  const { data, loading, error, call, reset } = useClaude();
  const [phase, setPhase] = useState('wizard'); // 'wizard' | 'result'

  const handleComplete = async () => {
    setPhase('result');
    const userPrompt = buildUserPrompt(form);
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
