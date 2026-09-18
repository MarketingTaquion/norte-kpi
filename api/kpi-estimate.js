// API pública (Vercel): POST /api/kpi-estimate. Calcula la estimación con la
// calculadora interna determinística — sin llamar a ningún modelo de IA.
// Documentado en docs/reference/api.md.
import { checkApiKey } from '../src/lib/apiAuth.js';
import { calculateSetterResult } from '../src/lib/calculator/setterCalculator.js';

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
  // Cada pedido puede ser un string (se clasifica por keywords) o
  // { texto, categoria } (categoria explícita, igual que manda el wizard).
  const pedidosValidos = Array.isArray(payload.pedidos)
    ? payload.pedidos.filter((p) => (typeof p === 'string' && p.trim()) || (p && typeof p.texto === 'string' && p.texto.trim()))
    : [];

  if (!payload.cliente || pedidosValidos.length === 0) {
    res.status(422).json({
      error: 'Faltan campos obligatorios: "cliente" (string) y al menos un item en "pedidos" (string, o { texto, categoria }).',
    });
    return;
  }

  const result = calculateSetterResult(payload);
  res.status(200).json(result);
}
