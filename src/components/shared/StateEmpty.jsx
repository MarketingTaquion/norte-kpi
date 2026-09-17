export default function StateEmpty({ title, description }) {
  return (
    <div className="state-box">
      <div className="state-icon">↘</div>
      <div style={{ fontWeight: 600, color: 'var(--tq-text-strong)' }}>{title}</div>
      {description ? <div style={{ maxWidth: 320 }}>{description}</div> : null}
    </div>
  );
}
