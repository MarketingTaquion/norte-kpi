import StateEmpty from '../shared/StateEmpty.jsx';
import StateLoading from '../shared/StateLoading.jsx';
import ErrorBox from '../shared/ErrorBox.jsx';
import VerdictBanner from './VerdictBanner.jsx';
import SmartGrid from './SmartGrid.jsx';
import ViabilityCard from './ViabilityCard.jsx';
import PacingGrid from '../setter/PacingGrid.jsx';

export default function EvaluatorResult({ data, loading, error, moneda }) {
  if (loading) return <div className="panel"><StateLoading label="Auditando el KPI contra el framework SMART…" /></div>;
  if (error) return <div className="panel"><ErrorBox message={error} /></div>;
  if (!data) {
    return (
      <div className="panel">
        <StateEmpty
          title="Todavía no hay auditoría"
          description="Completá el KPI a auditar en el formulario de la izquierda y obtené el veredicto independiente."
        />
      </div>
    );
  }

  return (
    <div>
      <VerdictBanner veredicto={data.veredicto} confianza={data.confianza_pct} />
      <SmartGrid smart={data.smart} />
      <ViabilityCard viabilidad={data.viabilidad} moneda={moneda} />
      <PacingGrid pacing={data.pacing_sugerido} title="Pacing sugerido" />

      {data.riesgos && data.riesgos.length > 0 ? (
        <div className="section-block">
          <h3 className="section-heading">Riesgos identificados</h3>
          <ul className="list-plain">
            {data.riesgos.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      ) : null}

      {data.recomendaciones && data.recomendaciones.length > 0 ? (
        <div className="section-block">
          <h3 className="section-heading">Recomendaciones</h3>
          <ul className="list-plain">
            {data.recomendaciones.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      ) : null}

      {data.kpi_alternativo ? (
        <div className="panel">
          <h3 className="panel-title">KPI alternativo sugerido</h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{data.kpi_alternativo}</p>
        </div>
      ) : null}
    </div>
  );
}
