// Tasa de captación SOM → Comunidad: % del SOM (gente alcanzable por
// pauta) que efectivamente se termina uniendo al grupo de WhatsApp que
// arma el flujo de ManyChat de cada cliente. Sin fuente externa — no existe
// un benchmark de industria para "tasa de conversión a una comunidad
// propia de WhatsApp", y el historial real de Taquion todavía no alcanza
// para calibrarla (un solo flow de ManyChat corrido a la fecha de este
// commit, sin volumen para sacar un promedio confiable).
//
// Valor de arranque por criterio de agencia — una sola tasa GLOBAL, no por
// rubro: diferenciarla por rubro hoy sería inventar precisión que no
// existe todavía. Reemplazar por un valor calibrado (y eventualmente por
// rubro, una vez que haya ≥5 campañas reales logueadas por rubro) cuando
// el loop de calibración de la Fase 5 del plan esté en marcha — ver
// docs/reference/territorios.md.
export const TASA_CAPTACION_COMUNIDAD = 0.04;
