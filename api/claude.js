// Vercel Function: proxy seguro a la API de Anthropic (equivalente Vercel de
// netlify/functions/claude.js). Usada por el wizard del browser vía
// src/hooks/useClaude.js — no requiere API key propia, solo la llama el
// propio frontend. Convención Vercel: este archivo en /api/ se sirve
// automáticamente en /api/claude, sin necesidad de rewrites.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY no está configurada en Vercel.' });
    return;
  }

  const { system, messages, max_tokens } = req.body || {};

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 8000,
        system,
        messages,
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'No se pudo contactar a Anthropic API.', detail: String(err) });
  }
}
