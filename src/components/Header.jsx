export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <img className="wordmark" src="/logo/lockup-negro-horizontal.png" alt="Taquion" />
        <span className="divider" />
        <span className="subtitle">Norte-kpi · Estimador de KPIs</span>
      </div>
      <div className="header-meta">v1.0 · Interno</div>
    </header>
  );
}
