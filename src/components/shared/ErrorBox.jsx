export default function ErrorBox({ message, raw }) {
  return (
    <div className="error-box">
      <strong>No se pudo procesar la respuesta.</strong>
      <div style={{ marginTop: 6 }}>{message}</div>
      {raw ? <pre>{raw}</pre> : null}
    </div>
  );
}
