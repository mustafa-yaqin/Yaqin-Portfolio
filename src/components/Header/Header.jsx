import { Link, NavLink } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import "./Header.css";

function Header({ t, lang, setLang, theme, setTheme }) {
  return (
    <header>
      <div className="wrap header-row">
        <Link className="logo" to="/">
          <img className="logo-img" src="./logo.jpg" alt="YAQIN CODE" width="200" height="200" />
          <span className="logo-text">
            <b>YAQIN CODE</b>
            <small>{t.brandSub}</small>
          </span>
        </Link>

        <nav>
          {t.nav.map((item) => (
            // NavLink صفحه فعلی را خودش با کلاس active مشخص می‌کند
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {/* دکمه روشن / تاریک */}
          <button
            className="theme-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? t.themeToLight : t.themeToDark}
            title={theme === "dark" ? t.themeToLight : t.themeToDark}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>

          {/* دکمه عوض کردن زبان */}
          <button className="lang-btn" onClick={() => setLang(lang === "fa" ? "en" : "fa")}>
            {t.langButton}
          </button>
          <Link className="header-btn" to="/contact">
            {t.contactBtn}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
