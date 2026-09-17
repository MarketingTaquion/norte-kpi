const LETTERS = ['s', 'm', 'a', 'r', 't'];

export default function SmartGrid({ smart }) {
  if (!smart) return null;
  return (
    <div className="section-block">
      <h3 className="section-heading">Análisis S.M.A.R.T</h3>
      <div className="smart-grid">
        {LETTERS.map((letter) => {
          const item = smart[letter];
          if (!item) return null;
          return (
            <div key={letter} className={`smart-card${item.pass ? ' pass' : ' fail'}`}>
              <div className="smart-letter">{letter.toUpperCase()}</div>
              <div className="smart-note">{item.nota}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
