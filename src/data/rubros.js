// Factor de afinidad por rubro/interés del negocio — a diferencia de
// TERRITORIOS y RANGOS_ETARIOS, esto NO sale de una fuente externa: es una
// estimación interna de la agencia de qué % de la audiencia de una
// plataforma suele mostrar interés real en ese tipo de negocio. Se usa solo
// para acotar más el techo poblacional cuando el usuario declara un rubro;
// si más adelante hay datos propios de campañas (ej. tasa de interés real
// medida en Meta Ads Manager por rubro), este archivo es el que hay que
// actualizar con esos números.
export const RUBROS = [
  { value: 'general', label: 'Consumo masivo / general', factor: 0.6 },
  { value: 'gastronomia', label: 'Gastronomía', factor: 0.45 },
  { value: 'retail-moda', label: 'Retail / Moda', factor: 0.35 },
  { value: 'entretenimiento', label: 'Entretenimiento / Eventos', factor: 0.35 },
  { value: 'salud-belleza', label: 'Salud y belleza', factor: 0.3 },
  { value: 'turismo', label: 'Turismo / Hotelería', factor: 0.3 },
  { value: 'automotor', label: 'Automotor', factor: 0.2 },
  { value: 'educacion', label: 'Educación', factor: 0.2 },
  { value: 'tecnologia', label: 'Tecnología / Software', factor: 0.15 },
  { value: 'inmobiliario', label: 'Inmobiliario', factor: 0.15 },
  { value: 'servicios-profesionales', label: 'Servicios profesionales / B2B', factor: 0.1 },
];
