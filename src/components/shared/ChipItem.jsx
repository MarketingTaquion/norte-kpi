export default function ChipItem({ label, isOn, onToggle }) {
  return (
    <div className={`chip${isOn ? ' on' : ''}`} onClick={onToggle} role="button" tabIndex={0}>
      {label}
    </div>
  );
}
