// Benchmarks de mercado argentino 2025-2026. Misma fuente que antes vivía
// como texto dentro de los system prompts (src/prompts/setter.js,
// evaluator.js) — acá son datos estructurados que la calculadora consume
// directamente, sin pasar por ningún modelo.
export const BENCHMARKS = {
  ctr_meta: { min: 1, max: 3, unit: '%', label: 'CTR Meta Ads' },
  ctr_google: { min: 3, max: 7, unit: '%', label: 'CTR Google Search' },
  cpc_meta: { min: 150, max: 800, unit: 'moneda', label: 'CPC Meta Ads (B2C)' },
  cpc_meta_b2b: { min: 400, max: 1500, unit: 'moneda', label: 'CPC Meta Ads (B2B/nicho)' },
  cpm_meta: { min: 800, max: 2500, unit: 'moneda', label: 'CPM Meta Ads (audiencia amplia)' },
  cpm_meta_nicho: { min: 2000, max: 5000, unit: 'moneda', label: 'CPM Meta Ads (nicho)' },
  cpl_b2c: { min: 300, max: 1500, unit: 'moneda', label: 'CPL B2C' },
  cpl_b2b: { min: 1500, max: 5000, unit: 'moneda', label: 'CPL B2B' },
  roas_minimo: { min: 3, max: 4, unit: 'x', label: 'ROAS mínimo rentable' },
  roas_saludable: { min: 4, max: 8, unit: 'x', label: 'ROAS saludable' },
  roas_ecommerce: { min: 6, max: 12, unit: 'x', label: 'ROAS e-commerce maduro' },
  conversion_ecommerce: { min: 1.5, max: 3, unit: '%', label: 'Tasa de conversión e-commerce' },
  conversion_leads: { min: 3, max: 8, unit: '%', label: 'Tasa de conversión servicios/leads' },
  engagement_ig: { min: 1, max: 3, unit: '%', label: 'Engagement Instagram' },
  engagement_ig_excelente: { min: 3, max: 5, unit: '%', label: 'Engagement Instagram (excelente)' },
  engagement_tiktok: { min: 3, max: 8, unit: '%', label: 'Engagement TikTok' },
  frecuencia: { min: 2, max: 4, unit: 'imp/persona/semana', label: 'Frecuencia de campaña saludable' },
  ltv_cac: { min: 3, max: 3, unit: 'x', label: 'LTV/CAC sostenible (mínimo)' },
};

export function midpoint(key) {
  const b = BENCHMARKS[key];
  if (!b) return 0;
  return (b.min + b.max) / 2;
}
