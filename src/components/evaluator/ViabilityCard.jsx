import { fmtN } from '../../utils/tax.js';

export default function ViabilityCard({ viabilidad, moneda }) {
  if (!viabilidad) return null;
  const superavit = viabilidad.superavit_deficit ?? 0;
  return (
    <div className="section-block">
      <h3 className="section-heading">Viabilidad presupuestaria</h3>
      <div className="viability-grid">
        <div className="viability-item">
          <div className="v-label">Presupuesto bruto</div>
          <div className="v-value">{fmtN(viabilidad.presupuesto_bruto, moneda)}</div>
        </div>
        <div className="viability-item">
          <div className="v-label">Presupuesto neto</div>
          <div className="v-value">{fmtN(viabilidad.presupuesto_neto, moneda)}</div>
        </div>
        <div className="viability-item">
          <div className="v-label">Costo estimado</div>
          <div className="v-value">{fmtN(viabilidad.costo_estimado, moneda)}</div>
        </div>
        <div className="viability-item">
          <div className="v-label">{superavit >= 0 ? 'Superávit' : 'Déficit'}</div>
          <div className="v-value" style={{ color: superavit >= 0 ? 'var(--tq-negro)' : 'var(--tq-fucsia)' }}>
            {fmtN(Math.abs(superavit), moneda)}
          </div>
        </div>
      </div>
    </div>
  );
}
