import { Link, NavLink } from "react-router-dom";

function Header({ t, lang, setLang }) {
  return (
    <header>
      <div className="wrap header-row">
        <Link className="logo" to="/">
          <img className="logo-img" src="./logo.jpg" alt="YAQIN CODE" />
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
