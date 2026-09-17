// API pública (Vercel): POST /api/kpi-estimate — equivalente Vercel de
// netlify/functions/kpi-estimate.js. Mismo contrato, documentado en
// docs/reference/api.md. Requiere el header X-Api-Key (NORTE_API_KEY).
import { checkApiKey } from '../src/lib/apiAuth.js';
import { buildSetterUserPrompt } from '../src/lib/promptBuilders.js';
import { SETTER_SYSTEM_PROMPT } from '../src/prompts/setter.js';
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
  const pedidosValidos = Array.isArray(payload.pedidos)
    ? payload.pedidos.filter((p) => typeof p === 'string' && p.trim().length > 0)
    : [];

  if (!payload.cliente || pedidosValidos.length === 0) {
    res.status(422).json({
      error: 'Faltan campos obligatorios: "cliente" (string) y al menos un item en "pedidos" (array de strings).',
    });
    return;
  }

  try {
    const userPrompt = buildSetterUserPrompt(payload);
    const rawText = await callClaudeText({ system: SETTER_SYSTEM_PROMPT, userPrompt, maxTokens: 8000 });
    const result = parseResponse(rawText);

    // El Tax Check es determinístico: se recalcula en código y se pisa lo que
    // haya devuelto la IA (ver docs/explanation/calculation-engine.md).
    if (payload.presupuesto) {
      result.tax_check = taxCalc(payload.presupuesto);
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message, detail: err.detail, raw: err.raw });
  }
}
