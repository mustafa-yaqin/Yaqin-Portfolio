import { Link } from "react-router-dom";
import "./Hero.css";

// بالای صفحه: معرفی و عکس (عکس: public/photo.jpg)
function Hero({ t }) {
  return (
    <div className="hero">
      <div className="wrap hero-row">
        <div>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.text}</p>
          <Link className="btn btn-main" to="/projects">{t.hero.btnProjects}</Link>
          <Link className="btn btn-line" to="/contact">{t.hero.btnContact}</Link>
        </div>

        <div className="photo">
          <img src="./photo.jpg" alt={t.hero.photoAlt} width="480" height="480" fetchpriority="high" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
