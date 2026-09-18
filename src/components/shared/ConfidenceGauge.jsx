// Gauge tipo "Audience definition" de Meta Ads Manager, adaptado a la
// confianza del veredicto del Evaluador (0-100%) en vez de specific/broad.
// Reusa los colores que ya usa VerdictBanner por severidad: fucsia (baja),
// naranja (media), negro (alta) — nunca color solo, siempre con texto.
const CX = 100;
const CY = 95;
const RADIUS = 78;
const GAP_DEG = 6;
const BAND_DEG = (180 - GAP_DEG * 2) / 3;

function polar(angleDeg, r = RADIUS) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

function arcPath(startAngle, endAngle) {
  const start = polar(startAngle);
  const end = polar(endAngle);
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`;
}

const BANDS = [
  { start: 180, end: 180 - BAND_DEG, color: 'var(--tq-fucsia)' },
  { start: 180 - BAND_DEG - GAP_DEG, end: 180 - 2 * BAND_DEG - GAP_DEG, color: 'var(--tq-naranja)' },
  { start: 180 - 2 * BAND_DEG - 2 * GAP_DEG, end: 0, color: 'var(--tq-negro)' },
];

export default function ConfidenceGauge({ confianza }) {
  if (confianza == null || !Number.isFinite(confianza)) return null;
  const pct = Math.max(0, Math.min(100, confianza));
  const needleAngle = 180 - pct * 1.8;
  const tip = polar(needleAngle, RADIUS - 16);
  const nivel = pct >= 66 ? 'Alta' : pct >= 33 ? 'Media' : 'Baja';

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 110" width="180" height="99" role="img" aria-label={`Confianza ${pct}%, nivel ${nivel}`}>
        {BANDS.map((b) => (
          <path key={b.color} d={arcPath(b.start, b.end)} stroke={b.color} strokeWidth="14" fill="none" />
        ))}
        <line x1={CX} y1={CY} x2={tip.x} y2={tip.y} stroke="var(--tq-text-strong)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="5" fill="var(--tq-text-strong)" />
      </svg>
      <div className="gauge-labels">
        <span>Baja</span>
        <span>Alta</span>
      </div>
      <div className="gauge-value">{pct}% de confianza · {nivel}</div>
    </div>
  );
}
