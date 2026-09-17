import { useState } from 'react';
import SelectableItem from '../shared/SelectableItem.jsx';
import ChipItem from '../shared/ChipItem.jsx';
import PeriodPicker from '../shared/PeriodPicker.jsx';
import TaxPreview from '../shared/TaxPreview.jsx';
import { STAGES } from '../../data/stages.js';
import { PLATFORM_GROUPS } from '../../data/platforms.js';
import { LAPSOS } from '../../data/lapsos.js';
import { fmtN } from '../../utils/tax.js';

const STEPS = [
  { key: 'cliente', eyebrow: 'Paso 1 · Contexto', title: '¿Para qué cliente es esta estimación?' },
  { key: 'etapa', eyebrow: 'Paso 2 · Contexto', title: '¿En qué etapa del proyecto está?' },
  { key: 'periodo', eyebrow: 'Paso 3 · Alcance', title: '¿Qué período vamos a proyectar?' },
  { key: 'presupuesto', eyebrow: 'Paso 4 · Alcance', title: '¿Con qué presupuesto contamos?' },
  { key: 'plataformas', eyebrow: 'Paso 5 · Alcance', title: '¿Qué plataformas están activas?' },
  { key: 'pedidos', eyebrow: 'Paso 6 · Pedido del cliente', title: '¿Qué pidió el cliente, en sus palabras?' },
  { key: 'revision', eyebrow: 'Paso 7 · Confirmación', title: 'Revisá antes de generar la estimación' },
];

export default function SetterWizard({ form, onComplete, loading }) {
  const [step, setStep] = useState(0);
  const [newClientName, setNewClientName] = useState('');

  const isLastStep = step === STEPS.length - 1;
  const isFirstStep = step === 0;

  const stepValid = (() => {
    if (STEPS[step].key === 'cliente') return Boolean(form.clientValue);
    if (STEPS[step].key === 'pedidos') return form.pedidos.some((p) => p.trim().length > 0);
    return true;
  })();

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    form.addClient(newClientName.trim());
    setNewClientName('');
  };

  const goNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    if (stepValid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const clienteLabel = form.clients.find((c) => c.value === form.clientValue)?.label;
  const etapaLabels = form.stageValues.map((v) => STAGES.find((s) => s.value === v)?.label).filter(Boolean);
  const plataformaLabels = form.platformValues
    .map((v) => PLATFORM_GROUPS.flatMap((g) => g.items).find((p) => p.value === v)?.label)
    .filter(Boolean);
  const periodoLabel = form.periodMode === 'lapso'
    ? LAPSOS.find((l) => l.value === form.lapsoValue)?.label || 'No definido'
    : (form.fechaInicio && form.fechaFin ? `${form.fechaInicio} → ${form.fechaFin}` : 'No definido');
  const pedidosValidos = form.pedidos.filter((p) => p.trim().length > 0);

  return (
    <div className="wizard-shell">
      <div className="wizard-steps">
        {STEPS.map((s, i) => (
          <span key={s.key} className={`wizard-step-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />
        ))}
      </div>

      <div className="wizard-step-label">
        <div className="wizard-step-eyebrow">{STEPS[step].eyebrow}</div>
        <div className="wizard-step-title">{STEPS[step].title}</div>
      </div>

      <div className="panel">
        {STEPS[step].key === 'cliente' && (
          <div>
            <div className="selectable-list">
              {form.clients.map((c) => (
                <SelectableItem
                  key={c.value}
                  label={c.label}
                  description={c.description}
                  isOn={form.clientValue === c.value}
                  onToggle={() => form.setClientValue(c.value)}
                />
              ))}
            </div>
            <div className="pedido-row" style={{ marginTop: 10 }}>
              <input
                type="text"
                placeholder="Agregar cliente nuevo…"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
              <button type="button" className="icon-btn" onClick={handleAddClient}>+</button>
            </div>
          </div>
        )}

        {STEPS[step].key === 'etapa' && (
          <div>
            <p className="wizard-step-hint" style={{ marginTop: 0, marginBottom: 14 }}>
              Opcional, multi-selección — el setup puede convivir con captación.
            </p>
            <div className="selectable-list">
              {STAGES.map((s) => (
                <SelectableItem
                  key={s.value}
                  label={s.label}
                  description={s.description}
                  isOn={form.stageValues.includes(s.value)}
                  onToggle={() => form.toggleStage(s.value)}
                />
              ))}
            </div>
          </div>
        )}

        {STEPS[step].key === 'periodo' && (
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
        )}

        {STEPS[step].key === 'presupuesto' && (
          <div>
            <div className="budget-row">
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label">Presupuesto bruto</label>
                <input
                  type="number"
                  placeholder="0 = sin presupuesto, KPIs referenciales"
                  value={form.presupuesto}
                  onChange={(e) => form.setPresupuesto(e.target.value)}
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label">Moneda</label>
                <select value={form.moneda} onChange={(e) => form.setMoneda(e.target.value)}>
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <TaxPreview presupuesto={form.presupuesto} moneda={form.moneda} />
            </div>
          </div>
        )}

        {STEPS[step].key === 'plataformas' && (
          <div>
            <p className="wizard-step-hint" style={{ marginTop: 0, marginBottom: 14 }}>
              Opcional — determina qué SOP aplica la IA para cada pedido.
            </p>
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
        )}

        {STEPS[step].key === 'pedidos' && (
          <div>
            {form.pedidos.map((pedido, i) => (
              <div key={i} className="pedido-row">
                <input
                  type="text"
                  placeholder={`Pedido ${i + 1} (ej: "quiero más leads")`}
                  value={pedido}
                  onChange={(e) => form.updatePedido(i, e.target.value)}
                />
                {form.pedidos.length > 1 ? (
                  <button type="button" className="icon-btn" onClick={() => form.removePedido(i)}>×</button>
                ) : null}
              </div>
            ))}
            {form.pedidos.length < form.maxPedidos ? (
              <button type="button" className="btn-add" onClick={form.addPedido}>+ Agregar pedido</button>
            ) : null}

            <div className="field" style={{ marginTop: 20, marginBottom: 0 }}>
              <label className="field-label">North Star Metric (opcional)</label>
              <input
                type="text"
                placeholder="Si no se completa, la IA la infiere del conjunto de pedidos"
                value={form.nsm}
                onChange={(e) => form.setNsm(e.target.value)}
              />
            </div>
          </div>
        )}

        {STEPS[step].key === 'revision' && (
          <div>
            <div className="review-grid">
              <div className="review-row">
                <span className="r-label">Cliente</span>
                <span className="r-value">{clienteLabel || '—'}</span>
              </div>
              <div className="review-row">
                <span className="r-label">Etapas</span>
                <span className="r-value">{etapaLabels.length ? etapaLabels.join(', ') : 'No especificadas'}</span>
              </div>
              <div className="review-row">
                <span className="r-label">Período</span>
                <span className="r-value">{periodoLabel}</span>
              </div>
              <div className="review-row">
                <span className="r-label">Presupuesto</span>
                <span className="r-value">{form.presupuesto ? fmtN(form.presupuesto, form.moneda) : 'No declarado'}</span>
              </div>
              <div className="review-row">
                <span className="r-label">Plataformas</span>
                <span className="r-value">{plataformaLabels.length ? plataformaLabels.join(', ') : 'No especificadas'}</span>
              </div>
              <div className="review-row">
                <span className="r-label">North Star Metric</span>
                <span className="r-value">{form.nsm || 'A inferir por la IA'}</span>
              </div>
            </div>
            <div className="section-heading">Pedidos a traducir</div>
            <ul className="list-plain">
              {pedidosValidos.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="wizard-nav">
        {!isFirstStep ? (
          <button type="button" className="btn-secondary" onClick={goBack} disabled={loading}>
            Atrás
          </button>
        ) : null}
        <button type="button" className="btn-primary" onClick={goNext} disabled={!stepValid || loading}>
          {isLastStep ? (loading ? 'Generando estimación…' : 'Generar estimación') : 'Continuar'}
        </button>
      </div>
    </div>
  );
}
