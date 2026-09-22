// Pirámide etaria de Argentina — % de la población nacional en cada franja.
// Fuente: INDEC, Censo Nacional 2022, vía agregador secundario que cita el
// censo como fuente (no es una lectura directa de la tabla INDEC, que está
// en PDFs escaneados) — tratar como estimación de trabajo razonable, no como
// dato exacto al decimal. Sin franja de menores (13–17): fuera de targeting
// de pauta publicitaria estándar.
export const RANGOS_ETARIOS = [
  { value: '18-24', label: '18–24 años', pct: 0.108 },
  { value: '25-34', label: '25–34 años', pct: 0.154 },
  { value: '35-44', label: '35–44 años', pct: 0.145 },
  { value: '45-54', label: '45–54 años', pct: 0.117 },
  { value: '55-64', label: '55–64 años', pct: 0.091 },
  { value: '65+', label: '65+ años', pct: 0.119 },
];
