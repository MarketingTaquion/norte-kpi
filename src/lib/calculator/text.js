// Utilidades de texto para la calculadora: matching de keywords sin depender
// de mayúsculas/acentos. Nada de esto llama a un modelo — es matching literal.
export function normalize(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function containsAny(text, keywords) {
  const n = normalize(text);
  return keywords.some((k) => n.includes(normalize(k)));
}

// Primer número (entero o decimal, con separador , o .) encontrado en el texto.
// El grupo inicial es \d+ (no \d{1,3}) para que "1000" se lea como 1000 y no
// como "100" — solo los grupos SIGUIENTES de miles exigen 3 dígitos.
export function firstNumber(text) {
  const match = (text || '').toString().match(/\d+(?:[.,]\d{3})*(?:[.,]\d+)?/);
  if (!match) return null;
  const raw = match[0].replace(/\.(?=\d{3})/g, '').replace(',', '.');
  const num = parseFloat(raw);
  return Number.isFinite(num) ? num : null;
}
