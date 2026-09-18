// Catálogo de categorías de KPI. Cada pedido en lenguaje coloquial se
// clasifica contra este catálogo por keywords (ver classify.js) — es la
// versión determinística de lo que antes le pedíamos a la IA que infiera.
// El orden importa: se evalúa de arriba a abajo y gana el primer match.
import { containsAny } from './text.js';

export const CATEGORIES = [
  {
    key: 'ventas',
    keywords: ['venta', 'ventas', 'vender', 'comprar', 'compra', 'roas', 'facturacion', 'facturación', 'ingresos'],
    sop: 'SOP Ignite',
    kpi_tecnico: 'ROAS (Retorno sobre inversión publicitaria)',
    formula: 'ROAS = Ingresos por publicidad / Inversión en publicidad',
    benchmarkKey: 'roas_saludable',
    unidad: 'x',
    modo: 'roas',
  },
  {
    key: 'leads',
    keywords: ['lead', 'leads', 'contacto', 'contactos', 'formulario', 'consulta', 'consultas'],
    sop: 'SOP Ignite',
    kpi_tecnico: 'CPL (Costo por Lead) y volumen de leads',
    formula: 'CPL = Inversión / Leads',
    benchmarkKey: 'cpl_b2c',
    unidad: 'cantidad',
    modo: 'costo_por_unidad',
  },
  {
    key: 'trafico',
    keywords: ['trafico', 'tráfico', 'visitas', 'clics', 'clicks', 'ctr'],
    sop: 'SOP Ignite',
    kpi_tecnico: 'CTR y volumen de clics',
    formula: 'CTR = Clics / Impresiones * 100',
    benchmarkKey: 'ctr_meta',
    unidad: 'cantidad',
    modo: 'costo_por_unidad',
    costoBenchmarkKey: 'cpc_meta',
  },
  {
    key: 'alcance',
    keywords: ['alcance', 'reach', 'impresiones', 'awareness', 'marca', 'posicionamiento', 'notoriedad', 'visibilidad'],
    sop: 'SOP Comunidad',
    kpi_tecnico: 'Alcance / Impresiones',
    formula: 'CPM = (Inversión / Impresiones) * 1000',
    benchmarkKey: 'cpm_meta',
    unidad: 'cantidad',
    modo: 'alcance',
  },
  {
    key: 'engagement',
    keywords: ['engagement', 'interaccion', 'interacción', 'comentarios', 'me gusta', 'likes', 'reacciones'],
    sop: 'SOP Comunidad',
    kpi_tecnico: 'Tasa de Engagement',
    formula: 'Engagement = (Likes + Comentarios + Compartidos) / Alcance * 100',
    benchmarkKey: 'engagement_ig',
    unidad: '%',
    modo: 'porcentaje',
  },
  {
    key: 'seguidores',
    keywords: ['seguidor', 'seguidores', 'followers', 'audiencia', 'comunidad', 'crecimiento'],
    sop: 'SOP Comunidad',
    kpi_tecnico: 'Crecimiento de audiencia',
    formula: 'Crecimiento = (Seguidores fin - Seguidores inicio) / Seguidores inicio * 100',
    benchmarkKey: 'engagement_ig',
    unidad: 'cantidad',
    modo: 'referencial',
  },
  {
    key: 'retencion',
    keywords: ['retencion', 'retención', 'churn', 'fidelizacion', 'fidelización', 'recompra'],
    sop: 'SOP Comunidad',
    kpi_tecnico: 'Tasa de Retención / Churn',
    formula: 'Churn Rate = Clientes perdidos en el período / Clientes al inicio del período * 100',
    benchmarkKey: 'ltv_cac',
    unidad: '%',
    modo: 'referencial',
  },
  {
    key: 'setup',
    keywords: ['acceso', 'accesos', 'tracking', 'pixel', 'implementacion', 'implementación', 'setup', 'estructura', 'naming', 'catalogo', 'catálogo'],
    sop: 'SOP Setup',
    kpi_tecnico: 'Hito de implementación completado',
    formula: 'Checklist binario: hito cumplido / no cumplido',
    benchmarkKey: null,
    unidad: 'cantidad',
    modo: 'hito',
  },
  {
    key: 'conversion',
    keywords: ['conversion', 'conversión', 'tasa de conversion'],
    sop: 'SOP Ignite',
    kpi_tecnico: 'Tasa de Conversión',
    formula: 'Tasa de conversión = Conversiones / Visitas o Clics * 100',
    benchmarkKey: 'conversion_leads',
    unidad: '%',
    modo: 'porcentaje',
  },
];

export const DEFAULT_CATEGORY = CATEGORIES.find((c) => c.key === 'conversion');

// Labels cortos para el select de "Métrica" en el formulario — separados de
// kpi_tecnico (que es más largo y técnico, pensado para la tabla de resultado).
const CATEGORY_LABELS = {
  ventas: 'Ventas / ROAS',
  leads: 'Leads',
  trafico: 'Tráfico / Clics',
  alcance: 'Alcance / Awareness',
  engagement: 'Engagement',
  seguidores: 'Seguidores / Audiencia',
  retencion: 'Retención / Churn',
  setup: 'Setup / Implementación',
  conversion: 'Conversión (genérico)',
};

export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.key, label: CATEGORY_LABELS[c.key] || c.key }));

export function findCategory(key) {
  return CATEGORIES.find((c) => c.key === key) || null;
}

export function classifyText(text) {
  for (const category of CATEGORIES) {
    if (containsAny(text, category.keywords)) return category;
  }
  return DEFAULT_CATEGORY;
}

export function fuenteDeVerdad(plataformaLabels) {
  const p = (plataformaLabels || []).join(' ').toLowerCase();
  if (p.includes('google')) return 'Google Ads / Google Analytics';
  if (p.includes('meta') || p.includes('instagram') || p.includes('facebook')) return 'Meta Ads Manager';
  if (p.includes('tiktok')) return 'TikTok Ads Manager';
  if (p.includes('linkedin')) return 'LinkedIn Campaign Manager';
  if (p.includes('seo')) return 'Google Search Console';
  if (p.includes('email')) return 'Plataforma de email marketing';
  if (plataformaLabels && plataformaLabels.length > 0) return `Panel nativo de ${plataformaLabels[0]}`;
  return 'CRM / reporte interno';
}
