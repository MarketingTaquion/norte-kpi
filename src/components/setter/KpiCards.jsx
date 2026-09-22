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
              {k.confianza?.som ? (
                <div className={`kpi-card-confianza kpi-card-confianza-${k.confianza.som.nivel}`}>
                  {k.confianza.som.label}
                </div>
              ) : null}
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

          {k.tam != null || k.sam != null ? (
            <div className="kpi-card-funnel">
              <div className="kpi-card-funnel-item">
                <div className="kpi-card-col-label">Universo (TAM)</div>
                <div className="kpi-card-funnel-valor">{k.tam != null ? k.tam.toLocaleString('es-AR') : '—'}</div>
              </div>
              <span className="kpi-card-funnel-arrow">→</span>
              <div className="kpi-card-funnel-item">
                <div className="kpi-card-col-label">Zona + intereses (SAM)</div>
                <div className="kpi-card-funnel-valor">{k.sam != null ? k.sam.toLocaleString('es-AR') : '—'}</div>
              </div>
              <span className="kpi-card-funnel-arrow">→</span>
              <div className="kpi-card-funnel-item">
                <div className="kpi-card-col-label">Estimado (SOM)</div>
                <div className="kpi-card-funnel-valor">{k.som.min.toLocaleString('es-AR')}–{k.som.max.toLocaleString('es-AR')}</div>
              </div>
              {k.comunidad ? (
                <>
                  <span className="kpi-card-funnel-arrow">→</span>
                  <div className="kpi-card-funnel-item kpi-card-funnel-item-comunidad">
                    <div className="kpi-card-col-label">Comunidad</div>
                    <div className="kpi-card-funnel-valor">{k.comunidad.min.toLocaleString('es-AR')}–{k.comunidad.max.toLocaleString('es-AR')}</div>
                    <div className="kpi-card-funnel-nota">Grupo de WhatsApp vía ManyChat</div>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {k.comunidad && k.confianza?.comunidad ? (
            <div className={`kpi-card-confianza kpi-card-confianza-${k.confianza.comunidad.nivel} kpi-card-confianza-comunidad`}>
              Comunidad: {k.confianza.comunidad.label}
            </div>
          ) : null}

          {k.desglose_identidad ? (
            <div className="kpi-card-identidad">
              <div className="kpi-card-identidad-item">
                <div className="kpi-card-col-label">Miembros anonimizados</div>
                <div className="kpi-card-identidad-valor">{k.desglose_identidad.anonimizado.toLocaleString('es-AR')}</div>
                <div className="kpi-card-identidad-nota">En el grupo, sin dato identificable más allá del teléfono</div>
              </div>
              <div className="kpi-card-identidad-item">
                <div className="kpi-card-col-label">Miembros nominizados</div>
                <div className="kpi-card-identidad-valor">{k.desglose_identidad.nominizado.toLocaleString('es-AR')}</div>
                <div className="kpi-card-identidad-nota">Se identificaron — CRM, formulario del flujo</div>
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
      <p className="kpi-card-disclaimer">
        Proyección de planificación interna, no es un compromiso — no reemplaza el historial real de la cuenta del cliente.
      </p>
    </div>
  );
}
