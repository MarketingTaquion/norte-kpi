// API pública (Netlify): POST /api/kpi-estimate (ver netlify.toml para el
// redirect). Calcula la estimación con la calculadora interna determinística
// — sin llamar a ningún modelo de IA. Documentado en docs/reference/api.md.
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

  // Cada pedido puede ser un string (se clasifica por keywords) o
  // { texto, categoria } (categoria explícita, igual que manda el wizard).
  const pedidosValidos = Array.isArray(payload.pedidos)
    ? payload.pedidos.filter((p) => (typeof p === 'string' && p.trim()) || (p && typeof p.texto === 'string' && p.texto.trim()))
    : [];

  if (!payload.cliente || pedidosValidos.length === 0) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: 'Faltan campos obligatorios: "cliente" (string) y al menos un item en "pedidos" (string, o { texto, categoria }).',
      }),
    };
  }

  const { calculateSetterResult } = await import('../../src/lib/calculator/setterCalculator.js');
  const result = calculateSetterResult(payload);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  };
};
