// Llamada compartida a la API de Anthropic. Usada solo del lado servidor
// (Netlify Functions) — nunca se importa desde código que corre en el browser.
export async function callClaudeText({ system, userPrompt, maxTokens = 8000 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error('ANTHROPIC_API_KEY no está configurada en Netlify.');
    err.statusCode = 500;
    throw err;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data?.error?.message || 'Anthropic API respondió con un error.');
    err.statusCode = response.status;
    err.detail = data;
    throw err;
  }

  const rawText = data?.content?.[0]?.text;
  if (!rawText) {
    const err = new Error('La respuesta de Claude no trae contenido de texto.');
    err.statusCode = 502;
    throw err;
  }

  return rawText;
}
