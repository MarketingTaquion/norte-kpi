// Indicador de confianza por número — centraliza los strings de fuente para
// no repetirlos sueltos por el código, y para que la UI nunca muestre una
// estimación interna con la misma confianza que un dato oficial/de
// plataforma. `nivel: 'alta'` = fuente externa citable (INDEC, DataReportal,
// o más adelante Meta Marketing API / Google Ads API). `nivel: 'interna'` =
// estimación propia de la agencia sin fuente externa (hoy: cualquier
// proyección, porque todavía no hay integraciones de plataforma reales —
// ver Fase 2/3 del plan).
const FUENTES = {
  INDEC_POBLACION: { nivel: 'alta', fuente: 'INDEC Censo 2022 (actualizado a 2026)' },
  DATAREPORTAL: { nivel: 'alta', fuente: 'DataReportal — Digital 2026: Argentina' },
  INDEC_RANGO_ETARIO: { nivel: 'alta', fuente: 'INDEC Censo 2022 (pirámide etaria)' },
  // El techo poblacional (TAM/SAM) combina población (INDEC) + penetración
  // de internet y de plataforma (DataReportal) + rango etario (INDEC) —
  // ninguno de esos tres factores es una estimación interna, por eso es
  // "alta" siempre que no haya rubro declarado (el factor de rubro sí lo es).
  POBLACION_PLATAFORMA: { nivel: 'alta', fuente: 'INDEC Censo 2022 (2026) + DataReportal Digital 2026' },
  ESTIMACION_INTERNA: { nivel: 'interna', fuente: 'Estimación interna (Taquion)' },
};

export function tagConfianza(key) {
  const base = FUENTES[key] || FUENTES.ESTIMACION_INTERNA;
  const label = base.nivel === 'alta'
    ? `Alta confianza · ${base.fuente}`
    : 'Estimación interna · validar antes de comprometer con el cliente';
  return { ...base, label };
}

// Ensancha un rango [min, max] cuando su confianza es 'interna' — un rango
// angosto nunca debería verse en una pieza sin fuente sólida detrás. No
// toca rangos con confianza 'alta' (dato real de plataforma/oficial).
export function ampliarRangoSiInterna(min, max, confianza, pct = 0.15) {
  if (!confianza || confianza.nivel !== 'interna' || min == null || max == null) {
    return { min, max };
  }
  const centro = (min + max) / 2;
  const mitad = (max - min) / 2 + centro * pct;
  return {
    min: Math.max(0, Math.round(centro - mitad)),
    max: Math.round(centro + mitad),
  };
}
