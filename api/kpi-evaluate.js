// API pública (Vercel): POST /api/kpi-evaluate — equivalente Vercel de
// netlify/functions/kpi-evaluate.js. Mismo contrato, documentado en
// docs/reference/api.md. Requiere el header X-Api-Key (NORTE_API_KEY).
import { checkApiKey } from '../src/lib/apiAuth.js';
import { buildEvaluatorUserPrompt } from '../src/lib/promptBuilders.js';
import { EVALUATOR_SYSTEM_PROMPT } from '../src/prompts/evaluator.js';
import { callClaudeText } from '../src/lib/anthropic.js';
import { parseResponse } from '../src/utils/json.js';
import { taxCalc } from '../src/utils/tax.js';

export default async function handler(req, res) {
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

  try {
    const userPrompt = buildEvaluatorUserPrompt(payload);
    const rawText = await callClaudeText({ system: EVALUATOR_SYSTEM_PROMPT, userPrompt, maxTokens: 4000 });
    const result = parseResponse(rawText);

    // Igual que en kpi-estimate: la viabilidad presupuestaria es determinística,
    // se recalcula en código en vez de confiar en el número de la IA.
    if (payload.presupuesto && result.viabilidad) {
      const { neto } = taxCalc(payload.presupuesto);
      result.viabilidad.presupuesto_bruto = Number(payload.presupuesto) || 0;
      result.viabilidad.presupuesto_neto = neto;
      result.viabilidad.superavit_deficit = neto - (result.viabilidad.costo_estimado || 0);
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message, detail: err.detail, raw: err.raw });
  }
}
