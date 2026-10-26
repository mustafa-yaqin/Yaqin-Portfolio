import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import { SOCIALS } from "../../data";
import "./Footer.css";

function Footer({ t }) {
  // ستون «پیوندها» و ستون «تماس با ما» هر دو از منوی بالا ساخته می‌شوند
  const mainLinks = t.nav.filter((item) => item.to !== "/contact" && item.to !== "/about");
  const contactLinks = t.nav.filter((item) => item.to === "/contact" || item.to === "/about");

  return (
    <footer>
      <div className="footer-card">
        <div className="footer-grid">
          {/* ستون ۱: لوگو، توضیح کوتاه و آیکون‌های اجتماعی */}
          <div>
            <Link className="logo" to="/">
              <img className="logo-img" src="./logo.jpg" alt="YAQIN CODE" width="200" height="200" />
              <span className="logo-text">
                <b>YAQIN CODE</b>
                <small>{t.brandSub}</small>
              </span>
            </Link>
            <p className="footer-text">{t.footer.about}</p>

            <h4>{t.footer.social}</h4>
            <div className="socials">
              {SOCIALS.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  style={{ "--color": item.color, "--fg": item.fg }}
                >
                  <Icon name={item.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* ستون ۲: پیوندها */}
          <div>
            <h4>{t.footer.links}</h4>
            <ul>
              {mainLinks.map((item) => (
                <li key={item.to}>
                  <Link className="footer-link" to={item.to}>
                    <Icon name={item.icon} size={15} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون ۳: تماس با ما */}
          <div>
            <h4>{t.footer.contactUs}</h4>
            <ul>
              {contactLinks.map((item) => (
                <li key={item.to}>
                  <Link className="footer-link" to={item.to}>
                    <Icon name={item.icon} size={15} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="copyright">{t.footer.rights}</div>
      </div>
    </footer>
  );
}

export default Footer;
