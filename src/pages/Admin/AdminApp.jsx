import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, setToken, errorText } from "./adminApi.js";
import { useAdminToken } from "../../api/adminToken.js";
import Overview from "./Overview.jsx";
import ProjectsPanel from "./ProjectsPanel.jsx";
import SkillsPanel from "./SkillsPanel.jsx";
import MessagesPanel from "./MessagesPanel.jsx";
import PasswordPanel from "./PasswordPanel.jsx";
import "./Admin.css";

// ورود. اگر هنوز هیچ ادمینی ساخته نشده باشد، فرم ساخت حساب (با کد راه‌اندازی که در لاگ سرور چاپ شده) نشان داده می‌شود
function Login() {
  const [needsSetup, setNeedsSetup] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/api/admin/status")
      .then((d) => setNeedsSetup(d.needsSetup))
      .catch((e) => {
        setNeedsSetup(false);
        setError(errorText(e));
      });
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const path = needsSetup ? "/api/admin/setup" : "/api/admin/login";
      const body = needsSetup ? form : { username: form.username, password: form.password };
      const data = await api(path, { method: "POST", body });
      setToken(data.token);
    } catch (err) {
      const m = err.message || "";
      if (err.status === 401) setError("نام کاربری یا رمز اشتباه است.");
      else if (m === "Wrong setup code") setError("کد راه‌اندازی درست نیست. کد فعلی را با دستور  npm run setup-code  ببینید.");
      else if (m === "Admin already exists") {
        setNeedsSetup(false); // حساب قبلاً ساخته شده؛ فرم به حالت ورود برمی‌گردد
        setError("حساب مدیر قبلاً ساخته شده است. با همان نام کاربری و رمز وارد شوید.");
      } else if (m.startsWith("Username must")) setError("نام کاربری باید ۳ تا ۴۰ حرف انگلیسی، عدد یا _ . - باشد.");
      else if (m.startsWith("Password must")) setError("رمز باید حداقل ۱۰ حرف باشد.");
      else setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  if (needsSetup === null) return <div className="adm-login"><p>{error || "..."}</p></div>;

  return (
    <div className="adm-login" dir="rtl" lang="fa">
      <form className="adm-card" onSubmit={submit}>
        <h1>{needsSetup ? "ساخت حساب مدیر" : "ورود به پنل"}</h1>
        {needsSetup && <p className="adm-muted">اولین بار است. کد راه‌اندازی در ترمینالی که سرور را اجرا کرده چاپ شده است (یا دستور npm run setup-code را بزنید).</p>}
        <label>
          نام کاربری
          <input dir="ltr" autoComplete="username" value={form.username} onChange={set("username")} required />
        </label>
        <label>
          {needsSetup ? "رمز عبور (حداقل ۱۰ حرف)" : "رمز عبور"}
          <input dir="ltr" type="password" autoComplete={needsSetup ? "new-password" : "current-password"} value={form.password} onChange={set("password")} minLength={needsSetup ? 10 : undefined} required />
        </label>
        {needsSetup && (
          <label>
            کد راه‌اندازی
            <input dir="ltr" value={form.code} onChange={set("code")} required />
          </label>
        )}
        <button className="adm-btn adm-primary" disabled={busy}>{busy ? "..." : needsSetup ? "ساخت حساب و ورود" : "ورود"}</button>
        {error && <p className="adm-error" role="alert">{error}</p>}
      </form>
    </div>
  );
}

const TABS = [
  ["overview", "نمای کلی"],
  ["projects", "پروژه‌ها"],
  ["skills", "مهارت‌ها"],
  ["messages", "پیام‌ها"],
  ["password", "رمز عبور"],
];

// پنل مدیریت: فقط یک ادمین (خود شما). ثبت‌نام برای بازدیدکننده‌ها وجود ندارد.
// این صفحه داخل خود سایت (با هدر و فوتر) نشان داده می‌شود.
function AdminApp() {
  const token = useAdminToken();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "overview";
  const goTo = (id) => setParams({ tab: id });

  useEffect(() => {
    const previous = document.title;
    document.title = "پنل مدیریت";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      meta.remove();
      document.title = previous;
    };
  }, []);

  // اگر توکن ذخیره‌شده دیگر معتبر نباشد، به صفحه‌ی ورود برمی‌گردیم
  useEffect(() => {
    if (token) api("/api/admin/me").catch(() => {});
  }, [token]);

  if (!token) return <Login />;

  return (
    <div className="adm" dir="rtl" lang="fa">
      <nav className="adm-tabs">
        {TABS.map(([id, label]) => (
          <button key={id} className={tab === id ? "on" : ""} onClick={() => goTo(id)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="adm-main">
        {tab === "overview" && <Overview goTo={goTo} />}
        {tab === "projects" && (
          <ProjectsPanel
            key={params.toString()}
            editId={params.get("edit")}
            openNew={params.get("new") === "1"}
            onConsumed={() => setParams({ tab: "projects" }, { replace: true })}
          />
        )}
        {tab === "skills" && <SkillsPanel />}
        {tab === "messages" && <MessagesPanel />}
        {tab === "password" && <PasswordPanel />}
      </div>
    </div>
  );
}

export default AdminApp;
