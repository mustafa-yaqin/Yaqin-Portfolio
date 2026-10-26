import { Link } from "react-router-dom";
import "./CallToAction.css";

// نوار دعوت به تماس (پایین صفحه خانه)
function CallToAction({ t }) {
  return (
    <div className="wrap">
      <div className="cta">
        <h2>{t.home.ctaTitle}</h2>
        <p>{t.home.ctaText}</p>
        <Link className="btn btn-white" to="/contact">{t.home.ctaBtn}</Link>
      </div>
    </div>
  );
}

export default CallToAction;
