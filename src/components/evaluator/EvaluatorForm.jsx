import ChipItem from '../shared/ChipItem.jsx';
import PeriodPicker from '../shared/PeriodPicker.jsx';
import { PLATFORM_GROUPS } from '../../data/platforms.js';
import { CATEGORY_OPTIONS } from '../../lib/calculator/kpiCatalog.js';
import { ACCION_OPTIONS } from '../../lib/calculator/evaluatorCalculator.js';
import { PRESUPUESTO_OPTIONS } from '../../data/presupuestos.js';

export default function EvaluatorForm({ form, onSubmit, loading }) {
  return (
    <div>
      <div className="panel">
        <h3 className="panel-title">Contexto</h3>
        <div className="field">
          <label className="field-label">Cliente</label>
          <select value={form.clientValue} onChange={(e) => form.setClientValue(e.target.value)}>
            <option value="">Sin cliente específico</option>
            {form.clients.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {PLATFORM_GROUPS.map((g) => (
          <div key={g.group} className="chip-group">
            <div className="chip-group-title">{g.group}</div>
            <div className="chip-row">
              {g.items.map((p) => (
                <ChipItem
                  key={p.value}
                  label={p.label}
                  isOn={form.platformValues.includes(p.value)}
                  onToggle={() => form.togglePlatform(p.value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3 className="panel-title">KPI a auditar</h3>
        <div className="field">
          <label className="field-label">Métrica <span className="required">*</span></label>
          <select value={form.categoria} onChange={(e) => form.setCategoria(e.target.value)}>
            <option value="">Seleccionar métrica…</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Acción (S) <span className="required">*</span></label>
          <select value={form.accion} onChange={(e) => form.setAccion(e.target.value)}>
            <option value="">Seleccionar acción…</option>
            {ACCION_OPTIONS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Indicador + número (M) <span className="required">*</span></label>
          <input type="text" placeholder="500 leads, CPA menor a $800 ARS…" value={form.indicador} onChange={(e) => form.setIndicador(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Por qué es alcanzable (A)</label>
          <input type="text" placeholder="Histórico similar, benchmark de mercado…" value={form.alcanzable} onChange={(e) => form.setAlcanzable(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Segmento (R) <span className="required">*</span></label>
          <input type="text" placeholder="Dueños PyMEs 35-55 CABA…" value={form.segmento} onChange={(e) => form.setSegmento(e.target.value)} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label">Período (T)</label>
          <PeriodPicker
            mode={form.periodMode}
            onModeChange={form.setPeriodMode}
            lapsoValue={form.lapsoValue}
            onLapsoChange={form.setLapsoValue}
            fechaInicio={form.fechaInicio}
            onFechaInicioChange={form.setFechaInicio}
            fechaFin={form.fechaFin}
            onFechaFinChange={form.setFechaFin}
          />
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">Viabilidad financiera</h3>
        <div className="budget-row">
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label">Presupuesto bruto</label>
            <select value={form.presupuesto} onChange={(e) => form.setPresupuesto(e.target.value)}>
              {PRESUPUESTO_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label">Moneda</label>
            <select value={form.moneda} onChange={(e) => form.setMoneda(e.target.value)}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div className="field" style={{ marginTop: 16 }}>
          <label className="field-label">CPC / CPA referencia</label>
          <input type="text" placeholder="Dato histórico" value={form.cpcCpaRef} onChange={(e) => form.setCpcCpaRef(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">CPM referencia</label>
          <input type="text" placeholder="Dato histórico" value={form.cpmRef} onChange={(e) => form.setCpmRef(e.target.value)} />
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">Contexto adicional</h3>
        <textarea
          placeholder="Estacionalidad, competencia, restricciones especiales…"
          value={form.contexto}
          onChange={(e) => form.setContexto(e.target.value)}
        />
      </div>

      <button type="button" className="btn-primary" disabled={!form.isValid || loading} onClick={onSubmit}>
        {loading ? 'Auditando KPI…' : 'Auditar KPI'}
      </button>
    </div>
  );
}
