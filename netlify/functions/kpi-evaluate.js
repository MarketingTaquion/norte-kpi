// API pública (Netlify): POST /api/kpi-evaluate (ver netlify.toml para el
// redirect). Audita el KPI con la calculadora interna determinística — sin
// llamar a ningún modelo de IA. Documentado en docs/reference/api.md.
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

  const { calculateEvaluatorResult } = await import('../../src/lib/calculator/evaluatorCalculator.js');
  const result = calculateEvaluatorResult(payload);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  };
};
