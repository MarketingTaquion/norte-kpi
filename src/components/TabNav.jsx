export default function TabNav({ tabs, active, onChange }) {
  return (
    <nav className="tab-nav">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          className={`tab-btn${active === t.value ? ' active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
