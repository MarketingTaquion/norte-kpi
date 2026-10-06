// Tax Check: bruto → -10% fee -21% IVA -4% percepciones -4% Dual → neto
// invertible. Dual es el partner de crédito en cuenta publicitaria (cobra 4%).
// neto = bruto * 0.61 (10 + 21 + 4 + 4 = 39% de descuento total).
const FEE_RATE = 0.10;
const IVA_RATE = 0.21;
const PERCEPCIONES_RATE = 0.04;
const DUAL_RATE = 0.04;
export const NETO_RATE = 1 - FEE_RATE - IVA_RATE - PERCEPCIONES_RATE - DUAL_RATE; // 0.61

export function taxCalc(bruto) {
  const brutoNum = Number(bruto) || 0;
  const fee = brutoNum * FEE_RATE;
  const iva = brutoNum * IVA_RATE;
  const percepciones = brutoNum * PERCEPCIONES_RATE;
  const dual = brutoNum * DUAL_RATE;
  const neto = brutoNum * NETO_RATE;
  return { bruto: brutoNum, fee, iva, percepciones, dual, neto };
}

export function fmtN(value, currency = 'ARS') {
  const num = Number(value) || 0;
  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(num);
  return currency ? `${currency === 'USD' ? 'US$' : '$'} ${formatted}` : formatted;
}
