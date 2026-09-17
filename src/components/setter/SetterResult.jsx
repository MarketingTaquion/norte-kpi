import StateEmpty from '../shared/StateEmpty.jsx';
import StateLoading from '../shared/StateLoading.jsx';
import ErrorBox from '../shared/ErrorBox.jsx';
import NsmBanner from './NsmBanner.jsx';
import KpiTable from './KpiTable.jsx';
import PacingGrid from './PacingGrid.jsx';
import { fmtN } from '../../utils/tax.js';

export default function SetterResult({ data, loading, error, moneda }) {
  if (loading) return <div className="panel"><StateLoading label="Traduciendo pedidos a KPIs SMART…" /></div>;
  if (error) return <div className="panel"><ErrorBox message={error} /></div>;
  if (!data) {
    return (
      <div className="panel">
        <StateEmpty
          title="Todavía no hay KPIs generados"
          description="Completá el formulario de la izquierda y generá la matriz de KPIs SMART con proyección y pacing."
        />
      </div>
    );
  }

  const stats = data.stats || {};

  return (
    <div>
      <NsmBanner nsm={data.nsm} />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">KPIs seteados</div>
          <div className="stat-value">{stats.kpis_seteados ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Neto disponible</div>
          <div className="stat-value">{fmtN(stats.neto_disponible, moneda)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Metas originales</div>
          <div className="stat-value">{stats.metas_originales ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Metas ajustadas</div>
          <div className="stat-value">{stats.metas_ajustadas ?? '—'}</div>
        </div>
      </div>

      {data.tax_check && data.tax_check.bruto > 0 ? (
        <div className="section-block">
          <h3 className="section-heading">Tax Check</h3>
          <div className="tax-preview">
            <div className="tax-preview-row"><span>Bruto</span><span>{fmtN(data.tax_check.bruto, moneda)}</span></div>
            <div className="tax-preview-row"><span>Fee</span><span>−{fmtN(data.tax_check.fee, moneda)}</span></div>
            <div className="tax-preview-row"><span>IVA</span><span>−{fmtN(data.tax_check.iva, moneda)}</span></div>
            <div className="tax-preview-row"><span>Percepciones</span><span>−{fmtN(data.tax_check.percepciones, moneda)}</span></div>
            <div className="tax-preview-row total"><span>Neto</span><span>{fmtN(data.tax_check.neto, moneda)}</span></div>
          </div>
        </div>
      ) : null}

      <KpiTable kpis={data.kpis} />
      <PacingGrid pacing={data.pacing} />

      {data.checklist_nsm && data.checklist_nsm.length > 0 ? (
        <div className="section-block">
          <h3 className="section-heading">Checklist NSM</h3>
          <ul className="list-plain">
            {data.checklist_nsm.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      ) : null}

      {data.proximos_pasos && data.proximos_pasos.length > 0 ? (
        <div className="section-block">
          <h3 className="section-heading">Próximos pasos</h3>
          <ul className="list-plain">
            {data.proximos_pasos.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      ) : null}

      {data.resumen_ejecutivo ? (
        <div className="panel">
          <h3 className="panel-title">Resumen ejecutivo</h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{data.resumen_ejecutivo}</p>
        </div>
      ) : null}
    </div>
  );
}
