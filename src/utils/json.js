// Limpia la respuesta cruda de Claude (puede venir envuelta en fences ```json ... ```)
// y la parsea a objeto JS. Nunca crashea silenciosamente: lanza con el raw adjunto.
export function cleanJSON(raw) {
  let t = (raw || '').trim();
  const cb = t.indexOf('```');
  if (cb === 0) {
    const nl = t.indexOf('\n');
    t = nl >= 0 ? t.slice(nl + 1) : t.slice(3);
  }
  const lb = t.lastIndexOf('```');
  if (lb >= 0) t = t.slice(0, lb).trim();
  return t;
}

export function parseResponse(raw) {
  const cleaned = cleanJSON(raw);
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const error = new Error('No se pudo interpretar la respuesta de la IA como JSON.');
    error.raw = raw;
    throw error;
  }
}
