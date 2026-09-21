import { fmtN } from '../../utils/tax.js';

export default function TaxCheckStrip({ taxCheck, moneda }) {
  if (!taxCheck || !taxCheck.bruto) return null;
  const descuentos = taxCheck.fee + taxCheck.iva + taxCheck.percepciones;
  return (
    <div className="tax-strip">
      <div className="tax-strip-item">
        <div className="tax-strip-label">Bruto</div>
        <div className="tax-strip-value">{fmtN(taxCheck.bruto, moneda)}</div>
      </div>
      <div className="tax-strip-arrow">→</div>
      <div className="tax-strip-item center">
        <div className="tax-strip-label">Fee + IVA + Perc.</div>
        <div className="tax-strip-value accent">−{fmtN(descuentos, moneda)}</div>
      </div>
      <div className="tax-strip-arrow">→</div>
      <div className="tax-strip-item right">
        <div className="tax-strip-label">Neto invertible</div>
        <div className="tax-strip-value strong">{fmtN(taxCheck.neto, moneda)}</div>
      </div>
    </div>
  );
}
