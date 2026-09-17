// 7 etapas del proyecto: 4 de Setup + 3 de Comunidad.
// Multi-select: el setup puede convivir con captación en simultáneo.
export const STAGES = [
  { value: 'setup-accesos', label: 'Setup · Accesos', description: 'Alta de accesos, permisos, tracking base', group: 'Setup' },
  { value: 'setup-tracking', label: 'Setup · Tracking', description: 'Pixel, conversiones, eventos, UTMs', group: 'Setup' },
  { value: 'setup-cuentas', label: 'Setup · Cuentas Ads', description: 'Estructura de campañas, naming, catálogos', group: 'Setup' },
  { value: 'setup-branding', label: 'Setup · Branding digital', description: 'Identidad visual, guidelines, assets base', group: 'Setup' },
  { value: 'comunidad-captacion', label: 'Comunidad · Captación', description: 'Generación de leads o tráfico calificado', group: 'Comunidad' },
  { value: 'comunidad-engagement', label: 'Comunidad · Engagement', description: 'Interacción, comunidad activa, contenido', group: 'Comunidad' },
  { value: 'comunidad-conversion', label: 'Comunidad · Conversión', description: 'Ventas, conversión, retención', group: 'Comunidad' },
];
