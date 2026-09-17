import { LAPSOS } from '../../data/lapsos.js';

export default function PeriodPicker({ mode, onModeChange, lapsoValue, onLapsoChange, fechaInicio, onFechaInicioChange, fechaFin, onFechaFinChange }) {
  return (
    <div>
      <div className="period-tabs">
        <button
          type="button"
          className={`period-tab${mode === 'lapso' ? ' active' : ''}`}
          onClick={() => onModeChange('lapso')}
        >
          Lapso predefinido
        </button>
        <button
          type="button"
          className={`period-tab${mode === 'custom' ? ' active' : ''}`}
          onClick={() => onModeChange('custom')}
        >
          Fechas custom
        </button>
      </div>
      {mode === 'lapso' ? (
        <div className="lapso-grid">
          {LAPSOS.map((l) => (
            <div
              key={l.value}
              className={`chip${lapsoValue === l.value ? ' on' : ''}`}
              onClick={() => onLapsoChange(l.value)}
              role="button"
              tabIndex={0}
              style={{ textAlign: 'center' }}
            >
              {l.label}
            </div>
          ))}
        </div>
      ) : (
        <div className="custom-dates">
          <div className="field">
            <label className="field-label">Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => onFechaInicioChange(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => onFechaFinChange(e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
