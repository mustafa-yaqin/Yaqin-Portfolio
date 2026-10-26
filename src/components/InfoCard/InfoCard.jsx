import Icon from "../Icon/Icon.jsx";
import "../Card/Card.css";
import "./InfoCard.css";

// کارت ساده با آیکون: برای «چه کارهایی انجام می‌دهم» و «روش کار من»
// number: اگر شماره بدهید (مثل مراحل کار)، گوشه کارت دیده می‌شود
function InfoCard({ icon, title, text, number }) {
  return (
    <div className="card">
      <div className="card-art">
        {number && <span className="num">{number}</span>}
        <span className="art-icon">
          <Icon name={icon} size={28} />
        </span>
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default InfoCard;
