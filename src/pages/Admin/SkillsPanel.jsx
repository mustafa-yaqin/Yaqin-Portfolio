import { useEffect, useState } from "react";
import { api, errorText } from "./adminApi.js";

export default function SkillsPanel() {
  const [skills, setSkills] = useState(null);
  const [draft, setDraft] = useState({ name_fa: "", name_en: "" });
  const [editing, setEditing] = useState(null); // { id, name_fa, name_en }
  const [error, setError] = useState("");

  const load = () => api("/api/admin/skills").then((d) => setSkills(d.skills)).catch((e) => setError(errorText(e)));
  useEffect(() => { load(); }, []);

  const run = async (fn) => {
    setError("");
    try { await fn(); await load(); } catch (e) { setError(errorText(e)); }
  };

  const add = (e) => {
    e.preventDefault();
    run(async () => {
      await api("/api/admin/skills", { method: "POST", body: draft });
      setDraft({ name_fa: "", name_en: "" });
    });
  };
  const save = () => run(async () => {
    await api(`/api/admin/skills/${editing.id}`, { method: "PUT", body: { name_fa: editing.name_fa, name_en: editing.name_en } });
    setEditing(null);
  });
  const remove = (s) => window.confirm(`مهارت «${s.name_fa}» حذف شود؟`) && run(() => api(`/api/admin/skills/${s.id}`, { method: "DELETE" }));
  const move = (index, delta) => {
    const ids = skills.map((s) => s.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => api("/api/admin/skills/order", { method: "PUT", body: { ids } }));
  };

  if (!skills) return error ? <p className="adm-error">{error}</p> : <p>در حال دریافت...</p>;

  return (
    <>
      <h2>مهارت‌ها</h2>
      {error && <p className="adm-error">{error}</p>}

      <form className="adm-card adm-inline" onSubmit={add}>
        <input placeholder="نام فارسی" value={draft.name_fa} onChange={(e) => setDraft({ ...draft, name_fa: e.target.value })} required maxLength={60} />
        <input dir="ltr" placeholder="English name" value={draft.name_en} onChange={(e) => setDraft({ ...draft, name_en: e.target.value })} required maxLength={60} />
        <button className="adm-btn adm-primary">افزودن</button>
      </form>

      <div className="adm-card">
        {skills.length === 0 && <p className="adm-muted">مهارتی نیست.</p>}
        {skills.map((s, i) => (
          <div className="adm-row" key={s.id}>
            {editing?.id === s.id ? (
              <>
                <input value={editing.name_fa} onChange={(e) => setEditing({ ...editing, name_fa: e.target.value })} maxLength={60} />
                <input dir="ltr" value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} maxLength={60} />
                <button className="adm-btn adm-primary" onClick={save}>ذخیره</button>
                <button className="adm-btn" onClick={() => setEditing(null)}>لغو</button>
              </>
            ) : (
              <>
                <span className="adm-grow">{s.name_fa} <span className="adm-muted" dir="ltr">· {s.name_en}</span></span>
                <button className="adm-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="بالا">↑</button>
                <button className="adm-btn" onClick={() => move(i, 1)} disabled={i === skills.length - 1} aria-label="پایین">↓</button>
                <button className="adm-btn" onClick={() => setEditing({ ...s })}>ویرایش</button>
                <button className="adm-btn adm-danger" onClick={() => remove(s)}>حذف</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
