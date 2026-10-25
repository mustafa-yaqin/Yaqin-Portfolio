import "./Stats.css";

// عددها (زیر عکس). متن و عددها در data/text.fa.js و text.en.js هستند.
function Stats({ t }) {
  return (
    <div className="wrap">
      <div className="stats">
        {t.stats.map((item) => (
          <div key={item.label}>
            <b>{item.number}</b>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
