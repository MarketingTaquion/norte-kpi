// Tax Check: bruto → -10% fee -21% IVA -4% percepciones → neto invertible.
// neto = bruto * 0.65 (10 + 21 + 4 = 35% de descuento total).
const FEE_RATE = 0.10;
const IVA_RATE = 0.21;
const PERCEPCIONES_RATE = 0.04;
export const NETO_RATE = 1 - FEE_RATE - IVA_RATE - PERCEPCIONES_RATE; // 0.65

export function taxCalc(bruto) {
  const brutoNum = Number(bruto) || 0;
  const fee = brutoNum * FEE_RATE;
  const iva = brutoNum * IVA_RATE;
  const percepciones = brutoNum * PERCEPCIONES_RATE;
  const neto = brutoNum * NETO_RATE;
  return { bruto: brutoNum, fee, iva, percepciones, neto };
}

export function fmtN(value, currency = 'ARS') {
  const num = Number(value) || 0;
  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(num);
  return currency ? `${currency === 'USD' ? 'US$' : '$'} ${formatted}` : formatted;
}
