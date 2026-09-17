export default function PacingGrid({ pacing, title = 'Pacing por bloques' }) {
  if (!pacing || pacing.length === 0) return null;
  return (
    <div className="section-block">
      <h3 className="section-heading">{title}</h3>
      <div className="pacing-grid">
        {pacing.map((p, i) => (
          <div key={i} className="pacing-card">
            <div className="pacing-pct">{p.bloque}</div>
            <div className="pacing-meta">{p.meta_acumulada}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
