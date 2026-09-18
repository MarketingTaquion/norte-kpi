// Barra de rango tipo "Estimated daily results" de Meta Ads Manager, adaptada
// a nuestros datos: el segmento resaltado flota entre min y max dentro de un
// dominio con margen (max * 1.3), en vez de arrancar siempre en cero.
export default function RangeMeter({ min, max }) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= 0) return null;

  const domainMax = max * 1.3;
  const leftPct = Math.max(0, (min / domainMax) * 100);
  const rightPct = Math.min(100, (max / domainMax) * 100);
  const widthPct = Math.max(rightPct - leftPct, 3);

  return (
    <div className="range-meter">
      <div className="range-meter-track">
        <div className="range-meter-fill" style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />
      </div>
    </div>
  );
}
