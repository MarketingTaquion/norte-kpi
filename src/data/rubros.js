// Factor de afinidad por rubro/interés del negocio — a diferencia de
// TERRITORIOS y RANGOS_ETARIOS, esto NO sale de una fuente externa: es una
// estimación interna de la agencia de qué % de la audiencia de una
// plataforma suele mostrar interés real en ese tipo de negocio. Se usa solo
// para acotar más el techo poblacional cuando el pedido declara un rubro;
// si más adelante hay datos propios de campañas (ej. tasa de interés real
// medida en Meta Ads Manager por rubro), este archivo es el que hay que
// actualizar con esos números.
//
// `pctNominizado` es otra estimación interna, todavía más blanda que
// `factor`: de esa audiencia alcanzable, qué % es razonable esperar que
// llegue a dejar un dato identificable (formulario, CRM, opt-in) en vez de
// quedar como exposición anónima (pauta/alcance sin retorno). Rubros de
// intención/ticket alto (inmobiliario, servicios B2B) tienden a un
// `pctNominizado` mayor que consumo masivo de bajo compromiso
// (gastronomía, entretenimiento). Ajustar con datos reales de campaña en
// cuanto existan — no tratar este número con la misma confianza que la
// población o la penetración de plataforma.
export const RUBROS = [
  {
    value: 'general', label: 'Consumo masivo / general', factor: 0.6, pctNominizado: 0.05,
    keywords: ['general', 'consumo masivo', 'masivo'],
  },
  {
    value: 'gastronomia', label: 'Gastronomía', factor: 0.45, pctNominizado: 0.05,
    keywords: ['restaurante', 'restaurant', 'gastronomia', 'gastronomía', 'comida', 'bar', 'cafe', 'café', 'delivery', 'menu', 'menú', 'cocina'],
  },
  {
    value: 'retail-moda', label: 'Retail / Moda', factor: 0.35, pctNominizado: 0.08,
    keywords: ['moda', 'ropa', 'indumentaria', 'retail', 'tienda', 'boutique', 'calzado', 'accesorios'],
  },
  {
    value: 'entretenimiento', label: 'Entretenimiento / Eventos', factor: 0.35, pctNominizado: 0.05,
    keywords: ['evento', 'eventos', 'entretenimiento', 'show', 'fiesta', 'boliche', 'recital', 'espectaculo', 'espectáculo'],
  },
  {
    value: 'salud-belleza', label: 'Salud y belleza', factor: 0.3, pctNominizado: 0.12,
    keywords: ['salud', 'belleza', 'estetica', 'estética', 'spa', 'peluqueria', 'peluquería', 'medico', 'médico', 'clinica', 'clínica', 'odontologia', 'odontología', 'nutricion', 'nutrición'],
  },
  {
    value: 'turismo', label: 'Turismo / Hotelería', factor: 0.3, pctNominizado: 0.1,
    keywords: ['turismo', 'hotel', 'hoteleria', 'hotelería', 'viaje', 'viajes', 'turistico', 'turístico', 'alojamiento', 'hosteria', 'hostería'],
  },
  {
    value: 'automotor', label: 'Automotor', factor: 0.2, pctNominizado: 0.15,
    keywords: ['auto', 'autos', 'automotor', 'vehiculo', 'vehículo', 'concesionaria', 'taller', 'repuestos'],
  },
  {
    value: 'educacion', label: 'Educación', factor: 0.2, pctNominizado: 0.25,
    keywords: ['educacion', 'educación', 'curso', 'cursos', 'capacitacion', 'capacitación', 'universidad', 'colegio', 'instituto', 'academia'],
  },
  {
    value: 'tecnologia', label: 'Tecnología / Software', factor: 0.15, pctNominizado: 0.2,
    keywords: ['tecnologia', 'tecnología', 'software', 'app', 'saas', 'sistema', 'startup'],
  },
  {
    value: 'inmobiliario', label: 'Inmobiliario', factor: 0.15, pctNominizado: 0.3,
    keywords: ['inmobiliaria', 'inmobiliario', 'propiedad', 'propiedades', 'departamento', 'departamentos', 'alquiler', 'terreno', 'terrenos'],
  },
  {
    value: 'servicios-profesionales', label: 'Servicios profesionales / B2B', factor: 0.1, pctNominizado: 0.35,
    keywords: ['consultoria', 'consultoría', 'estudio contable', 'estudio juridico', 'estudio jurídico', 'abogado', 'contador', 'servicios profesionales'],
  },
];

export function findRubro(value) {
  return RUBROS.find((r) => r.value === value) || null;
}

// Autocompletado del select de Rubro a partir del texto del pedido — sin
// fallback: si ninguna keyword matcheó, se deja vacío (el usuario elige a
// mano), nunca se asume un rubro sin ninguna señal real en el texto.
export function classifyRubro(text) {
  const normalized = (text || '').toLowerCase();
  for (const rubro of RUBROS) {
    if (rubro.keywords.some((k) => normalized.includes(k))) return rubro;
  }
  return null;
}
