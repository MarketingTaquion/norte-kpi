import StateEmpty from '../shared/StateEmpty.jsx';
import StateLoading from '../shared/StateLoading.jsx';
import ErrorBox from '../shared/ErrorBox.jsx';
import TaxCheckStrip from './TaxCheckStrip.jsx';
import KpiCards from './KpiCards.jsx';
import { fmtN } from '../../utils/tax.js';

export default function SetterResult({ data, loading, error, moneda, clientLabel, onNewEstimate }) {
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
      <TaxCheckStrip taxCheck={data.tax_check} moneda={moneda} />

      <div className="results-topbar">
        <span className="wizard-step-eyebrow">Estimación · {clientLabel}</span>
        <button type="button" className="btn-secondary" onClick={onNewEstimate}>
          + Nueva estimación
        </button>
      </div>

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

      <KpiCards kpis={data.kpis} />

      {data.resumen_ejecutivo ? (
        <div className="panel">
          <h3 className="panel-title">Resumen ejecutivo</h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{data.resumen_ejecutivo}</p>
        </div>
      ) : null}
    </div>
  );
}
