import RangeMeter from '../shared/RangeMeter.jsx';
import SeverityGauge from '../shared/SeverityGauge.jsx';

export default function KpiCards({ kpis }) {
  if (!kpis || kpis.length === 0) return null;
  return (
    <div className="section-block">
      <h3 className="section-heading">Matriz de KPIs SMART</h3>
      {kpis.map((k, i) => (
        <div key={i} className="kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-card-pedido">&quot;{k.pedido_original}&quot;</div>
            <span className="tag-sop">{k.sop}</span>
          </div>
          <div className="kpi-card-title">{k.kpi_tecnico}</div>
          {k.formula ? <div className="kpi-card-formula">{k.formula}</div> : null}

          <div className="kpi-card-grid">
            <div>
              <div className="kpi-card-col-label">Meta realista</div>
              <div className="kpi-card-meta">{k.meta_realista}</div>
              <div className="kpi-card-fuente">Fuente de verdad: {k.fuente_verdad}</div>
            </div>
            <div>
              <div className="kpi-card-col-label">Proyección</div>
              <div className="kpi-card-proyeccion">{k.proyeccion_min} — {k.proyeccion_max}</div>
              <RangeMeter min={k.proyeccion_min} max={k.proyeccion_max} />
              <div className="range-meter-labels">
                <span>min</span><span>max</span>
              </div>
            </div>
            <div className="kpi-card-gauge-col">
              <div className="kpi-card-col-label" style={{ textAlign: 'center' }}>Agresividad</div>
              <SeverityGauge
                value={k.agresividad_pct}
                lowLabel="Conservador"
                highLabel="Agresivo"
                levels={['Conservador', 'Moderado', 'Agresivo']}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
