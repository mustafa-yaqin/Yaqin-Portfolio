import { createContext, useContext, useEffect, useState } from "react";
import { request } from "../api/client.js";
import { getToken } from "../api/adminToken.js";
import { SNAPSHOT } from "../data";

// پروژه‌ها و مهارت‌ها از اینجا به همه صفحه‌ها می‌رسند.
// ترتیب اطمینان (هیچ‌وقت صفحه‌ی خالی نمی‌ماند):
//   ۱) آخرین جواب موفق بک‌اند که در مرورگر ذخیره شده   ۲) نسخه‌ی داخل خود سایت (src/data/snapshot.json)
// بلافاصله یکی از این دو نشان داده می‌شود و بعد اگر بک‌اند جواب داد، جایگزین می‌شود.
const KEY = "yaqin-portfolio-cache-v1";
const Ctx = createContext(null);

function readCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(KEY));
    // اگر نسخه‌ی داخل سایت تازه‌تر از ذخیره‌ی مرورگر است (سایت دوباره منتشر شده)، همان را بگیر
    if (cache && cache.projects?.length && cache.skills && cache.savedAt >= (SNAPSHOT.exportedAt || "")) return cache;
  } catch {
    /* ذخیره خراب بود: نادیده گرفته می‌شود */
  }
  return null;
}

export function PortfolioProvider({ children }) {
  const [state, setState] = useState(() => {
    const cache = readCache();
    return cache
      ? { projects: cache.projects, skills: cache.skills, source: "cached" }
      : { projects: SNAPSHOT.projects, skills: SNAPSHOT.skills, source: "builtin" };
  });
  // "loading": هنوز منتظر بک‌اند، "live": جواب تازه آمد، "offline": بک‌اند جواب نداد
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // بک‌اندهای رایگان گاهی خواب‌اند و دیر بیدار می‌شوند: اول ۵ ثانیه، بعد یک بار دیگر تا ۲۵ ثانیه صبر می‌کنیم
      for (const timeout of [5000, 25000]) {
        try {
          const [p, s] = await Promise.all([request("/api/projects", { timeout, cache: "no-cache" }), request("/api/skills", { timeout, cache: "no-cache" })]);
          if (cancelled) return;
          // اگر بک‌اند لیست خالی داد، لیست قبلی را نگه می‌داریم تا کارفرما صفحه‌ی خالی نبیند (مگر وقتی ادمین وارد شده و عمداً همه را پاک کرده)
          if (Array.isArray(p?.projects) && (p.projects.length > 0 || getToken())) {
            const next = { projects: p.projects, skills: Array.isArray(s?.skills) ? s.skills : SNAPSHOT.skills };
            setState({ ...next, source: "live" });
            if (p.projects.length > 0) {
              try {
                localStorage.setItem(KEY, JSON.stringify({ ...next, savedAt: new Date().toISOString() }));
              } catch {
                /* حافظه‌ی مرورگر پر یا بسته بود */
              }
            }
            setStatus("live");
          } else {
            setStatus("offline");
          }
          return;
        } catch {
          if (cancelled) return;
        }
      }
      setStatus("offline");
    }

    load();
    // اینترنت دوباره وصل شد، یا ادمین چیزی را در پنل ذخیره کرد: فوراً دوباره بخوان تا تغییر در سایت دیده شود
    const retry = () => load();
    window.addEventListener("online", retry);
    window.addEventListener("portfolio-changed", retry);
    return () => {
      cancelled = true;
      window.removeEventListener("online", retry);
      window.removeEventListener("portfolio-changed", retry);
    };
  }, []);

  return <Ctx.Provider value={{ ...state, status }}>{children}</Ctx.Provider>;
}

export function usePortfolio() {
  return useContext(Ctx);
}
