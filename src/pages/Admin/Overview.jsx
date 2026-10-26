import { useEffect, useState } from "react";
import { api, errorText } from "./adminApi.js";

const fa = (n) => Number(n).toLocaleString("fa-IR");

export default function Overview({ goTo }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/stats").then(setStats).catch((e) => setError(errorText(e)));
  }, []);

  if (error) return <p className="adm-error">{error}</p>;
  if (!stats) return <p>در حال دریافت...</p>;

  const days = stats.visits.last30;
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <>
      <div className="adm-stats">
        <div className="adm-card"><b>{fa(stats.visits.total)}</b><span>کل بازدیدها</span></div>
        <div className="adm-card"><b>{fa(stats.visits.today)}</b><span>بازدید امروز</span></div>
        <div className="adm-card clickable" onClick={() => goTo("messages")}><b>{fa(stats.messages.unread)}</b><span>پیام خوانده‌نشده (از {fa(stats.messages.total)})</span></div>
        <div className="adm-card clickable" onClick={() => goTo("projects")}><b>{fa(stats.projects)}</b><span>پروژه</span></div>
      </div>

      <div className="adm-card">
        <h2>بازدید ۳۰ روز اخیر</h2>
        {days.length === 0 ? (
          <p className="adm-muted">هنوز بازدیدی ثبت نشده.</p>
        ) : (
          <div className="adm-bars" dir="ltr">
            {days.map((d) => (
              <div key={d.day} title={`${d.day}: ${d.count}`} style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }} />
            ))}
          </div>
        )}
        <p className="adm-muted">هر نشست مرورگر یک بار شمرده می‌شود و هیچ اطلاعات شخصی‌ای ذخیره نمی‌شود.</p>
      </div>
    </>
  );
}
