// API pública: POST /api/kpi-evaluate (ver netlify.toml para el redirect).
// Contrato completo en docs/reference/api.md — pensado para que herramientas
// externas auditen un KPI ya redactado sin pasar por el formulario del
// browser. Requiere el header X-Api-Key (NORTE_API_KEY).
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const { checkApiKey } = await import('../../src/lib/apiAuth.js');
  const auth = checkApiKey(event);
  if (!auth.ok) {
    return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.message }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Body inválido: no es JSON.' }) };
  }

  if (!payload.accion || !payload.indicador || !payload.segmento) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: 'Faltan campos obligatorios: "accion", "indicador" y "segmento" (todos string).',
      }),
    };
  }

  try {
    const { buildEvaluatorUserPrompt } = await import('../../src/lib/promptBuilders.js');
    const { EVALUATOR_SYSTEM_PROMPT } = await import('../../src/prompts/evaluator.js');
    const { callClaudeText } = await import('../../src/lib/anthropic.js');
    const { parseResponse } = await import('../../src/utils/json.js');
    const { taxCalc } = await import('../../src/utils/tax.js');

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 502,
      body: JSON.stringify({ error: err.message, detail: err.detail, raw: err.raw }),
    };
  }
};
