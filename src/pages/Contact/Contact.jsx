import { useState } from "react";
import Icon from "../../components/Icon/Icon.jsx";
import "../../components/Card/Card.css";
import "./Contact.css";
import { SOCIALS } from "../../data";
import { request } from "../../api/client.js";
import { usePortfolio } from "../../context/PortfolioContext.jsx";

function Contact({ t }) {
  const f = t.contactPage.form;
  const { status: backend } = usePortfolio(); // "live" یعنی بک‌اند جواب داده
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" });
  // وضعیت فرم: "idle" آماده، "sending" در حال ارسال، "sent" ارسال شد، یا یکی از خطاها
  const [status, setStatus] = useState("idle");

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (status === "sending") return;
    if (!values.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.message.trim().length < 5) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      await request("/api/contact", { method: "POST", body: values, timeout: 15000 });
      setValues({ name: "", email: "", message: "", website: "" });
      setStatus("sent");
    } catch (error) {
      // متن نوشته‌شده پاک نمی‌شود تا کاربر دوباره تلاش کند
      setStatus(error.status === 429 ? "tooMany" : "failed");
    }
  }

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
              style={{ "--color": item.color, "--fg": item.fg }}
            >
              <span className="contact-icon">
                <Icon name={item.icon} size={26} />
              </span>
              <h3>{item.name}</h3>
              <p dir="ltr">{item.handle}</p>
              <span className="contact-go">
                <Icon className="arrow" name="arrow" size={16} />
              </span>
            </a>
          ))}
        </div>

        {/* فرم فقط وقتی بک‌اند در دسترس است دیده می‌شود (روی سایت ایستا بدون بک‌اند، فقط راه‌های بالا می‌ماند) */}
        {backend === "live" && (
          <form className="contact-form" onSubmit={submit} noValidate>
            <h3>{f.title}</h3>

            <label>
              {f.name}
              <input name="name" value={values.name} onChange={change} maxLength={100} autoComplete="name" required />
            </label>
            <label>
              {f.email}
              <input name="email" type="email" dir="ltr" value={values.email} onChange={change} maxLength={150} autoComplete="email" required />
            </label>
            <label>
              {f.message}
              <textarea name="message" rows={5} value={values.message} onChange={change} maxLength={3000} required />
            </label>

            {/* تله‌ی ربات‌ها: آدم‌ها این فیلد را نمی‌بینند و خالی می‌گذارند */}
            <input className="hp-field" name="website" value={values.website} onChange={change} tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <button className="btn btn-main" type="submit" disabled={status === "sending"}>
              {status === "sending" ? f.sending : f.send}
            </button>

            <p className={"form-note" + (status === "sent" ? " ok" : "")} role="status" aria-live="polite">
              {status === "sent" && f.sent}
              {status === "failed" && f.failed}
              {status === "tooMany" && f.tooMany}
              {status === "invalid" && f.invalid}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

export default Contact;
