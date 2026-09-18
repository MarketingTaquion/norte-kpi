// API pública (Vercel): POST /api/kpi-evaluate. Audita el KPI con la
// calculadora interna determinística — sin llamar a ningún modelo de IA.
// Documentado en docs/reference/api.md.
import { checkApiKey } from '../src/lib/apiAuth.js';
import { calculateEvaluatorResult } from '../src/lib/calculator/evaluatorCalculator.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const auth = checkApiKey(req);
  if (!auth.ok) {
    res.status(auth.statusCode).json({ error: auth.message });
    return;
  }

  const payload = req.body || {};
  if (!payload.accion || !payload.indicador || !payload.segmento) {
    res.status(422).json({
      error: 'Faltan campos obligatorios: "accion", "indicador" y "segmento" (todos string).',
    });
    return;
  }

  const result = calculateEvaluatorResult(payload);
  res.status(200).json(result);
}
