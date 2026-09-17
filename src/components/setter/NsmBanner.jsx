export default function NsmBanner({ nsm }) {
  if (!nsm) return null;
  return (
    <div className="banner nsm">
      <div className="banner-title">North Star Metric</div>
      <div className="banner-value">{nsm.metrica}</div>
      {nsm.razon ? <div className="banner-sub">{nsm.razon}</div> : null}
    </div>
  );
}
