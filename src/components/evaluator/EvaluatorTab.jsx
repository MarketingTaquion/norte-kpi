import { useState } from 'react';
import { useEvaluatorForm } from '../../hooks/useEvaluatorForm.js';
import { calculateEvaluatorResult } from '../../lib/calculator/evaluatorCalculator.js';
import EvaluatorForm from './EvaluatorForm.jsx';
import EvaluatorResult from './EvaluatorResult.jsx';

// Mismo shape que espera /api/kpi-evaluate en el body — un solo lugar
// (src/lib/calculator/) calcula el resultado, lo use el formulario o una
// herramienta externa vía la API pública.
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
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    try {
      const result = calculateEvaluatorResult(formToFields(form));
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'No se pudo auditar el KPI con los datos ingresados.');
      setData(null);
    }
  };

  return (
    <div className="split">
      <EvaluatorForm form={form} onSubmit={handleSubmit} loading={false} />
      <EvaluatorResult data={data} loading={false} error={error} moneda={form.moneda} />
    </div>
  );
}
