import { useEffect, useState } from "react";
import { api, errorText } from "./adminApi.js";

const when = (iso) => new Date(iso).toLocaleString("fa-IR");

export default function MessagesPanel() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api("/api/admin/messages").then((d) => setMessages(d.messages)).catch((e) => setError(errorText(e)));
  useEffect(() => { load(); }, []);

  async function toggle(m) {
    try {
      await api(`/api/admin/messages/${m.id}`, { method: "PATCH", body: { is_read: !m.is_read } });
      load();
    } catch (e) { setError(errorText(e)); }
  }
  async function remove(m) {
    if (!window.confirm(`پیام «${m.name}» حذف شود؟`)) return;
    try {
      await api(`/api/admin/messages/${m.id}`, { method: "DELETE" });
      load();
    } catch (e) { setError(errorText(e)); }
  }

  if (!messages) return error ? <p className="adm-error">{error}</p> : <p>در حال دریافت...</p>;

  return (
    <>
      <h2>پیام‌های فرم تماس</h2>
      {error && <p className="adm-error">{error}</p>}
      {messages.length === 0 && <p className="adm-muted">هنوز پیامی نرسیده.</p>}
      {messages.map((m) => (
        <article key={m.id} className={"adm-card adm-msg" + (m.is_read ? "" : " unread")}>
          <header>
            <b>{m.name}</b>
            <a dir="ltr" href={`mailto:${m.email}`}>{m.email}</a>
            <span className="adm-muted">{when(m.created_at)}</span>
          </header>
          {/* متن پیام فقط به‌صورت متن ساده نمایش داده می‌شود (React آن را امن می‌کند) */}
          <p className="adm-msg-text">{m.message}</p>
          <footer>
            <button className="adm-btn" onClick={() => toggle(m)}>{m.is_read ? "علامت: خوانده‌نشده" : "علامت: خوانده‌شده"}</button>
            <button className="adm-btn adm-danger" onClick={() => remove(m)}>حذف</button>
          </footer>
        </article>
      ))}
    </>
  );
}
