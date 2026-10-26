import { useEffect, useRef, useState } from "react";
import { api, uploadImage, imageSrc, errorText } from "./adminApi.js";

const EMPTY_LANG = { title: "", text: "", linkText: "", features: "", tags: "" };
const EMPTY = { id: "", image: "", link: "", github: "", published: true, fa: { ...EMPTY_LANG }, en: { ...EMPTY_LANG } };

// ویژگی‌ها: هر خط یک مورد. برچسب‌ها: با ویرگول جدا می‌شوند
const toForm = (p) => ({
  ...p,
  fa: { ...p.fa, features: p.fa.features.join("\n"), tags: p.fa.tags.join("، ") },
  en: { ...p.en, features: p.en.features.join("\n"), tags: p.en.tags.join(", ") },
});
const splitTags = (s) => s.split(/[,،]/).map((x) => x.trim()).filter(Boolean);
const toBody = (f) => ({
  id: f.id,
  image: f.image,
  link: f.link,
  github: f.github,
  published: f.published,
  fa: { ...f.fa, features: f.fa.features.split("\n").map((x) => x.trim()).filter(Boolean), tags: splitTags(f.fa.tags) },
  en: { ...f.en, features: f.en.features.split("\n").map((x) => x.trim()).filter(Boolean), tags: splitTags(f.en.tags) },
});

function LangFields({ value, onChange, dir, label }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <fieldset dir={dir}>
      <legend>{label}</legend>
      <label>عنوان<input value={value.title} onChange={set("title")} maxLength={120} required /></label>
      <label>توضیح کوتاه<textarea rows={3} value={value.text} onChange={set("text")} maxLength={1000} /></label>
      <label>ویژگی‌ها (هر خط یک مورد)<textarea rows={4} value={value.features} onChange={set("features")} /></label>
      <label>فناوری‌ها (با ویرگول جدا کنید)<input value={value.tags} onChange={set("tags")} /></label>
      <label>نوشته‌ی دکمه‌ی لینک پروژه (اختیاری)<input value={value.linkText} onChange={set("linkText")} maxLength={60} /></label>
    </fieldset>
  );
}

function ProjectForm({ initial, creating, onSaved, onCancel }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function pick(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return setError("حجم عکس باید کمتر از ۳ مگابایت باشد.");
    setBusy(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = toBody(form);
      if (creating) await api("/api/admin/projects", { method: "POST", body });
      else await api(`/api/admin/projects/${form.id}`, { method: "PUT", body });
      onSaved();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="adm-card adm-form" onSubmit={submit}>
      <h2>{creating ? "پروژه‌ی تازه" : "ویرایش پروژه"}</h2>

      <label>
        شناسه‌ی آدرس (انگلیسی، مثل <code dir="ltr">my-project</code>)
        <input dir="ltr" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase() })} disabled={!creating} pattern="[a-z0-9]+(-[a-z0-9]+)*" minLength={2} maxLength={60} required />
      </label>

      <div className="adm-image">
        {form.image ? <img src={imageSrc(form.image)} alt="" /> : <div className="adm-noimg">بدون عکس</div>}
        <div>
          <label className="adm-btn">
            انتخاب عکس
            <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={pick} hidden />
          </label>
          {form.image && <button type="button" className="adm-btn" onClick={() => setForm({ ...form, image: "" })}>برداشتن عکس</button>}
          <p className="adm-muted">PNG، JPEG، GIF یا WebP، حداکثر ۳ مگابایت</p>
        </div>
      </div>

      <div className="adm-two">
        <label>لینک پروژه (سایت)<input dir="ltr" type="url" placeholder="https://" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></label>
        <label>لینک گیت‌هاب<input dir="ltr" type="url" placeholder="https://github.com/..." value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></label>
      </div>

      <label className="adm-check">
        <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
        منتشر شده (اگر خاموش باشد، در سایت دیده نمی‌شود)
      </label>

      <div className="adm-two">
        <LangFields label="فارسی" dir="rtl" value={form.fa} onChange={(fa) => setForm({ ...form, fa })} />
        <LangFields label="English" dir="ltr" value={form.en} onChange={(en) => setForm({ ...form, en })} />
      </div>

      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-actions">
        <button className="adm-btn adm-primary" disabled={busy}>{busy ? "..." : "ذخیره"}</button>
        <button type="button" className="adm-btn" onClick={onCancel}>لغو</button>
      </div>
    </form>
  );
}

export default function ProjectsPanel({ editId, openNew, onConsumed }) {
  const [projects, setProjects] = useState(null);
  const [editing, setEditing] = useState(null); // { form, creating }
  const [error, setError] = useState("");

  const load = () => api("/api/admin/projects").then((d) => setProjects(d.projects)).catch((e) => setError(errorText(e)));
  useEffect(() => { load(); }, []);

  // آمدن از نوار ادمین یا دکمه‌ی «ویرایش» روی کارت پروژه: فرم را مستقیم باز کن (فقط یک بار)
  const consumed = useRef(false);
  useEffect(() => {
    if (consumed.current) return;
    if (openNew) {
      consumed.current = true;
      setEditing({ creating: true, form: EMPTY });
      onConsumed?.();
    } else if (editId && projects) {
      consumed.current = true;
      const project = projects.find((p) => p.id === editId);
      if (project) setEditing({ creating: false, form: toForm(project) });
      onConsumed?.();
    }
  }, [openNew, editId, projects]);

  const run = async (fn) => {
    setError("");
    try { await fn(); await load(); } catch (e) { setError(errorText(e)); }
  };
  const remove = (p) => window.confirm(`پروژه «${p.fa.title}» برای همیشه حذف شود؟`) && run(() => api(`/api/admin/projects/${p.id}`, { method: "DELETE" }));
  const togglePublish = (p) => run(() => api(`/api/admin/projects/${p.id}`, { method: "PUT", body: { ...toBody(toForm(p)), published: !p.published } }));
  const move = (index, delta) => {
    const ids = projects.map((p) => p.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => api("/api/admin/projects/order", { method: "PUT", body: { ids } }));
  };

  if (editing) {
    return <ProjectForm initial={editing.form} creating={editing.creating} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />;
  }
  if (!projects) return error ? <p className="adm-error">{error}</p> : <p>در حال دریافت...</p>;

  return (
    <>
      <div className="adm-head">
        <h2>پروژه‌ها</h2>
        <button className="adm-btn adm-primary" onClick={() => setEditing({ creating: true, form: EMPTY })}>+ پروژه‌ی تازه</button>
      </div>
      <p className="adm-muted">سه پروژه‌ی اول در صفحه‌ی خانه نشان داده می‌شوند؛ با فلش‌ها ترتیب را عوض کنید.</p>
      {error && <p className="adm-error">{error}</p>}

      <div className="adm-card">
        {projects.map((p, i) => (
          <div className="adm-row" key={p.id}>
            {p.image ? <img className="adm-thumb" src={imageSrc(p.image)} alt="" /> : <span className="adm-thumb adm-noimg" />}
            <span className="adm-grow">
              {p.fa.title}
              <span className="adm-muted" dir="ltr"> · {p.id}</span>
              {!p.published && <span className="adm-badge">پیش‌نویس</span>}
            </span>
            <button className="adm-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="بالا">↑</button>
            <button className="adm-btn" onClick={() => move(i, 1)} disabled={i === projects.length - 1} aria-label="پایین">↓</button>
            <button className="adm-btn" onClick={() => togglePublish(p)}>{p.published ? "پنهان" : "انتشار"}</button>
            <button className="adm-btn" onClick={() => setEditing({ creating: false, form: toForm(p) })}>ویرایش</button>
            <button className="adm-btn adm-danger" onClick={() => remove(p)}>حذف</button>
          </div>
        ))}
      </div>
    </>
  );
}
