export default function StateLoading({ label = 'Calculando…' }) {
  return (
    <div className="state-box">
      <div className="spinner" />
      <div>{label}</div>
    </div>
  );
}
