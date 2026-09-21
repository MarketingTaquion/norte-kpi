export default function PacingTracker({ pacing, title = 'Pacing por bloques' }) {
  if (!pacing || pacing.length === 0) return null;
  return (
    <div className="section-block">
      <h3 className="section-heading">{title}</h3>
      <div className="pacing-tracker">
        <div className="pacing-tracker-line" />
        <div className="pacing-tracker-nodes">
          {pacing.map((p, i) => (
            <div key={i} className="pacing-tracker-node">
              <span className="pacing-tracker-dot" />
              <div className="pacing-tracker-pct">{p.bloque}</div>
              <div className="pacing-tracker-meta">{p.meta_acumulada}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
