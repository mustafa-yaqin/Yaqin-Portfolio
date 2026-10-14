import Icon from "../Icons.jsx";
import { SOCIALS } from "../data.js";

function Contact({ t }) {
  return (
    <section className="page">
      <div className="wrap">
        <h2>{t.contactPage.title}</h2>
        <p className="sub">{t.contactPage.sub}</p>

        <div className="grid grid3 keep3">
          {SOCIALS.map((item) => (
            <a
              className="card contact-card"
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={{ "--color": item.color }}
            >
              <span className="contact-icon">
                <Icon name={item.icon} size={26} />
              </span>
              <h3>{item.name}</h3>
              <p dir="ltr">{item.handle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;
