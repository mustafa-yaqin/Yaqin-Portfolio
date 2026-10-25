import { useState } from "react";
import { api, setToken, errorText } from "./adminApi.js";

export default function PasswordPanel() {
  const [form, setForm] = useState({ current: "", next: "", again: "" });
  const [note, setNote] = useState({ type: "", text: "" });

  async function submit(e) {
    e.preventDefault();
    if (form.next.length < 10) return setNote({ type: "error", text: "رمز تازه باید حداقل ۱۰ حرف باشد." });
    if (form.next !== form.again) return setNote({ type: "error", text: "تکرار رمز تازه یکسان نیست." });
    try {
      const data = await api("/api/admin/password", { method: "POST", body: { current: form.current, next: form.next } });
      setToken(data.token); // ورودهای قدیمی باطل شدند؛ توکن تازه جایگزین می‌شود
      setForm({ current: "", next: "", again: "" });
      setNote({ type: "ok", text: "رمز عوض شد. ورود در سایر دستگاه‌ها باطل شد." });
    } catch (err) {
      setNote({ type: "error", text: err.status === 403 ? "رمز فعلی اشتباه است." : errorText(err) });
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form className="adm-card adm-form narrow" onSubmit={submit}>
      <h2>تغییر رمز عبور</h2>
      <label>رمز فعلی<input dir="ltr" type="password" autoComplete="current-password" value={form.current} onChange={set("current")} required /></label>
      <label>رمز تازه (حداقل ۱۰ حرف)<input dir="ltr" type="password" autoComplete="new-password" value={form.next} onChange={set("next")} required /></label>
      <label>تکرار رمز تازه<input dir="ltr" type="password" autoComplete="new-password" value={form.again} onChange={set("again")} required /></label>
      <button className="adm-btn adm-primary">ذخیره</button>
      {note.text && <p className={note.type === "ok" ? "adm-ok" : "adm-error"} role="status">{note.text}</p>}
    </form>
  );
}
