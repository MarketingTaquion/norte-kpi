export default function StateLoading({ label = 'Consultando a Claude…' }) {
  return (
    <div className="state-box">
      <div className="spinner" />
      <div>{label}</div>
    </div>
  );
}
