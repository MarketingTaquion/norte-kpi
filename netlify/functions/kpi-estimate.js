// API pública: POST /api/kpi-estimate (ver netlify.toml para el redirect).
// Contrato completo en docs/reference/api.md — pensado para que herramientas
// externas (n8n, CRM, etc.) generen una estimación de KPIs sin pasar por el
// wizard del browser. Requiere el header X-Api-Key (NORTE_API_KEY).
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

  const pedidosValidos = Array.isArray(payload.pedidos)
    ? payload.pedidos.filter((p) => typeof p === 'string' && p.trim().length > 0)
    : [];

  if (!payload.cliente || pedidosValidos.length === 0) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: 'Faltan campos obligatorios: "cliente" (string) y al menos un item en "pedidos" (array de strings).',
      }),
    };
  }

  try {
    const { buildSetterUserPrompt } = await import('../../src/lib/promptBuilders.js');
    const { SETTER_SYSTEM_PROMPT } = await import('../../src/prompts/setter.js');
    const { callClaudeText } = await import('../../src/lib/anthropic.js');
    const { parseResponse } = await import('../../src/utils/json.js');
    const { taxCalc } = await import('../../src/utils/tax.js');

    const userPrompt = buildSetterUserPrompt(payload);
    const rawText = await callClaudeText({ system: SETTER_SYSTEM_PROMPT, userPrompt, maxTokens: 8000 });
    const result = parseResponse(rawText);

    // El Tax Check es determinístico: se recalcula en código y se pisa lo que
    // haya devuelto la IA, en vez de confiar en su número (ver
    // docs/explanation/calculation-engine.md).
    if (payload.presupuesto) {
      result.tax_check = taxCalc(payload.presupuesto);
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
