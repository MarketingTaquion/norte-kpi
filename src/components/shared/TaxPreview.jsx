import { taxCalc, fmtN } from '../../utils/tax.js';

export default function TaxPreview({ presupuesto, moneda }) {
  const bruto = Number(presupuesto);
  if (!bruto || bruto <= 0) return null;
  const { fee, iva, percepciones, neto } = taxCalc(bruto);

  return (
    <div className="tax-preview">
      <div className="tax-preview-row">
        <span>Bruto</span>
        <span>{fmtN(bruto, moneda)}</span>
      </div>
      <div className="tax-preview-row">
        <span>Fee (−10%)</span>
        <span>−{fmtN(fee, moneda)}</span>
      </div>
      <div className="tax-preview-row">
        <span>IVA (−21%)</span>
        <span>−{fmtN(iva, moneda)}</span>
      </div>
      <div className="tax-preview-row">
        <span>Percepciones (−4%)</span>
        <span>−{fmtN(percepciones, moneda)}</span>
      </div>
      <div className="tax-preview-row total">
        <span>Neto invertible</span>
        <span>{fmtN(neto, moneda)}</span>
      </div>
    </div>
  );
}
