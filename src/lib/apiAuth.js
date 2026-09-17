// Auth de la API pública (kpi-estimate, kpi-evaluate). Distinta de
// ANTHROPIC_API_KEY: esta es la key que le damos a herramientas externas
// para que llamen a Norte-kpi, nunca se usa para llamar a Anthropic.
export function checkApiKey(event) {
  const expected = process.env.NORTE_API_KEY;
  if (!expected) {
    return {
      ok: false,
      statusCode: 500,
      message: 'NORTE_API_KEY no está configurada en Netlify. La API pública está deshabilitada hasta que se cargue.',
    };
  }

  const headers = event.headers || {};
  const provided = headers['x-api-key'] || headers['X-Api-Key'] || headers['X-API-KEY'];

  if (!provided || provided !== expected) {
    return {
      ok: false,
      statusCode: 401,
      message: 'API key inválida o ausente. Enviá el header "X-Api-Key".',
    };
  }

  return { ok: true };
}
