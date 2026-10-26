import InfoCard from "../../../../components/InfoCard/InfoCard.jsx";

// آیکون هر کارت (به ترتیب کارت‌ها). نام آیکون‌ها در components/Icon/Icon.jsx است.
const ICONS = ["globe", "database", "calc", "code"];

// چه کارهایی انجام می‌دهم؟
function Services({ t }) {
  return (
    <section>
      <div className="wrap">
        <h2>{t.home.servicesTitle}</h2>
        <p className="sub">{t.home.servicesSub}</p>

        <div className="grid grid4">
          {t.home.services.map((item, index) => (
            <InfoCard key={item.title} icon={ICONS[index]} title={item.title} text={item.text} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
