export default function KpiTable({ kpis }) {
  if (!kpis || kpis.length === 0) return null;
  return (
    <div className="section-block">
      <h3 className="section-heading">Matriz de KPIs SMART</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="kpi-table">
          <thead>
            <tr>
              <th>Pedido original</th>
              <th>SOP</th>
              <th>KPI técnico</th>
              <th>Fuente de verdad</th>
              <th>Meta realista</th>
              <th>Proyección</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((k, i) => (
              <tr key={i}>
                <td>{k.pedido_original}</td>
                <td><span className="tag-sop">{k.sop}</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{k.kpi_tecnico}</div>
                  {k.formula ? <div style={{ fontSize: 12, color: 'var(--tq-text-faint)' }}>{k.formula}</div> : null}
                </td>
                <td>{k.fuente_verdad}</td>
                <td>{k.meta_realista}</td>
                <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {k.proyeccion_min} – {k.proyeccion_max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
