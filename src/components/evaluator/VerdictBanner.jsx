import SeverityGauge from '../shared/SeverityGauge.jsx';

const LABELS = {
  APROBADO: 'Aprobado',
  RECHAZADO_VANIDAD: 'Rechazado — Vanidad',
  RECHAZADO_INVIABILIDAD: 'Rechazado — Inviabilidad',
  CONDICIONADO: 'Condicionado',
};

export default function VerdictBanner({ veredicto, confianza }) {
  if (!veredicto) return null;
  const cls = `banner verdict-${veredicto.toLowerCase()}`;
  return (
    <div className={cls}>
      <div className="banner-title">Veredicto</div>
      <div className="banner-value">{LABELS[veredicto] || veredicto}</div>
      {confianza != null ? <SeverityGauge value={confianza} lowLabel="Baja" highLabel="Alta" /> : null}
    </div>
  );
}
