export default function SelectableItem({ label, description, isOn, onToggle }) {
  return (
    <div className={`selectable-item${isOn ? ' on' : ''}`} onClick={onToggle} role="button" tabIndex={0}>
      <span className="dot" />
      <span className="item-text">
        <span className="item-label">{label}</span>
        {description ? <span className="item-desc">{description}</span> : null}
      </span>
    </div>
  );
}
