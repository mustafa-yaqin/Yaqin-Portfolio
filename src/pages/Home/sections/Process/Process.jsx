import InfoCard from "../../../../components/InfoCard/InfoCard.jsx";

const ICONS = ["search", "pen", "code", "rocket"];

// روش کار من (۴ مرحله با شماره)
function Process({ t, lang }) {
  // عدد ۱ تا ۴ را به فارسی یا انگلیسی می‌نویسد
  const number = (n) => n.toLocaleString(lang === "fa" ? "fa-IR" : "en-US");

  return (
    <section>
      <div className="wrap">
        <h2>{t.home.processTitle}</h2>
        <p className="sub">{t.home.processSub}</p>

        <div className="grid grid4">
          {t.home.steps.map((item, index) => (
            <InfoCard key={item.title} icon={ICONS[index]} number={number(index + 1)} title={item.title} text={item.text} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
