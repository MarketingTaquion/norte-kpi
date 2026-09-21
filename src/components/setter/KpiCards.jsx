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
          {k.territorio || k.rubro ? (
            <div className="kpi-card-tags">
              {k.territorio ? <span className="kpi-card-territorio">Territorio: {k.territorio}</span> : null}
              {k.rubro ? <span className="kpi-card-territorio">Rubro: {k.rubro}</span> : null}
            </div>
          ) : null}

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

          {k.desglose_identidad ? (
            <div className="kpi-card-identidad">
              <div className="kpi-card-identidad-item">
                <div className="kpi-card-col-label">Alcanzable anónimo</div>
                <div className="kpi-card-identidad-valor">{k.desglose_identidad.anonimizado.toLocaleString('es-AR')}</div>
                <div className="kpi-card-identidad-nota">Exposición vía pauta/alcance, sin retorno identificable</div>
              </div>
              <div className="kpi-card-identidad-item">
                <div className="kpi-card-col-label">Con identidad conocida</div>
                <div className="kpi-card-identidad-valor">{k.desglose_identidad.nominizado.toLocaleString('es-AR')}</div>
                <div className="kpi-card-identidad-nota">Estimado — deja un dato identificable (CRM, opt-in)</div>
              </div>
            </div>
          ) : null}

          {k.por_plataforma && k.por_plataforma.length > 0 ? (
            <div className="kpi-card-plataformas">
              <div className="kpi-card-col-label">Por plataforma</div>
              {k.por_plataforma.map((p, j) => (
                <div key={j} className="kpi-card-plataforma-row">
                  <span className="kpi-card-plataforma-nombre">{p.plataforma}</span>
                  <span className="kpi-card-plataforma-valor">
                    {p.proyeccion_min} — {p.proyeccion_max}
                    {p.techo_poblacional != null ? ' (limitado por población)' : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
