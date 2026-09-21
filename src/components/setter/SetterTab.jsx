import { useState } from 'react';
import { useSetterForm } from '../../hooks/useSetterForm.js';
import { calculateSetterResult } from '../../lib/calculator/setterCalculator.js';
import SetterWizard from './SetterWizard.jsx';
import SetterResult from './SetterResult.jsx';

// Mismo shape que espera /api/kpi-estimate en el body — un solo lugar
// (src/lib/calculator/) calcula el resultado, lo use el wizard o una
// herramienta externa vía la API pública.
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
    territorio: form.territorio,
    rangoEtario: form.rangoEtario,
    pedidos: form.pedidos,
    nsm: form.nsm,
  };
}

export default function SetterTab() {
  const form = useSetterForm();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('wizard'); // 'wizard' | 'result'

  const handleComplete = () => {
    try {
      const result = calculateSetterResult(formToFields(form));
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'No se pudo calcular la estimación con los datos ingresados.');
      setData(null);
    }
    setPhase('result');
  };

  const handleNewEstimate = () => {
    setData(null);
    setError(null);
    form.resetForm();
    setPhase('wizard');
  };

  if (phase === 'wizard') {
    return <SetterWizard form={form} onComplete={handleComplete} loading={false} />;
  }

  return (
    <SetterResult
      data={data}
      loading={false}
      error={error}
      moneda={form.moneda}
      clientLabel={form.clients.find((c) => c.value === form.clientValue)?.label}
      onNewEstimate={handleNewEstimate}
    />
  );
}
