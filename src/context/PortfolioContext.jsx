import { createContext, useContext, useEffect, useState } from "react";
import { request } from "../api/client.js";
import { getToken } from "../api/adminToken.js";
import SNAPSHOT from "../data/snapshot.json";

// ظ¾ط±ظˆعکظ‡â€Œظ‡ط§ ظˆ ظ…ظ‡ط§ط±طھâ€Œظ‡ط§ ط§ط² ط§غŒظ†ط¬ط§ ط¨ظ‡ ظ‡ظ…ظ‡ طµظپط­ظ‡â€Œظ‡ط§ ظ…غŒâ€Œط±ط³ظ†ط¯.
// طھط±طھغŒط¨ ط§ط·ظ…غŒظ†ط§ظ† (ظ‡غŒع†â€Œظˆظ‚طھ طµظپط­ظ‡â€ŒغŒ ط®ط§ظ„غŒ ظ†ظ…غŒâ€Œظ…ط§ظ†ط¯):
//   غ±) ط¢ط®ط±غŒظ† ط¬ظˆط§ط¨ ظ…ظˆظپظ‚ ط¨ع©â€Œط§ظ†ط¯ ع©ظ‡ ط¯ط± ظ…ط±ظˆط±ع¯ط± ط°ط®غŒط±ظ‡ ط´ط¯ظ‡   غ²) ظ†ط³ط®ظ‡â€ŒغŒ ط¯ط§ط®ظ„ ط®ظˆط¯ ط³ط§غŒطھ (src/data/snapshot.json)
// ط¨ظ„ط§ظپط§طµظ„ظ‡ غŒع©غŒ ط§ط² ط§غŒظ† ط¯ظˆ ظ†ط´ط§ظ† ط¯ط§ط¯ظ‡ ظ…غŒâ€Œط´ظˆط¯ ظˆ ط¨ط¹ط¯ ط§ع¯ط± ط¨ع©â€Œط§ظ†ط¯ ط¬ظˆط§ط¨ ط¯ط§ط¯طŒ ط¬ط§غŒع¯ط²غŒظ† ظ…غŒâ€Œط´ظˆط¯.
const KEY = "yaqin-portfolio-cache-v1";
const Ctx = createContext(null);

function readCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(KEY));
    // ط§ع¯ط± ظ†ط³ط®ظ‡â€ŒغŒ ط¯ط§ط®ظ„ ط³ط§غŒطھ طھط§ط²ظ‡â€Œطھط± ط§ط² ط°ط®غŒط±ظ‡â€ŒغŒ ظ…ط±ظˆط±ع¯ط± ط§ط³طھ (ط³ط§غŒطھ ط¯ظˆط¨ط§ط±ظ‡ ظ…ظ†طھط´ط± ط´ط¯ظ‡)طŒ ظ‡ظ…ط§ظ† ط±ط§ ط¨ع¯غŒط±
    if (cache && cache.projects?.length && cache.skills && cache.savedAt >= (SNAPSHOT.exportedAt || "")) return cache;
  } catch {
    /* ط°ط®غŒط±ظ‡ ط®ط±ط§ط¨ ط¨ظˆط¯: ظ†ط§ط¯غŒط¯ظ‡ ع¯ط±ظپطھظ‡ ظ…غŒâ€Œط´ظˆط¯ */
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
  // "loading": ظ‡ظ†ظˆط² ظ…ظ†طھط¸ط± ط¨ع©â€Œط§ظ†ط¯طŒ "live": ط¬ظˆط§ط¨ طھط§ط²ظ‡ ط¢ظ…ط¯طŒ "offline": ط¨ع©â€Œط§ظ†ط¯ ط¬ظˆط§ط¨ ظ†ط¯ط§ط¯
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // ط¨ع©â€Œط§ظ†ط¯ظ‡ط§غŒ ط±ط§غŒع¯ط§ظ† ع¯ط§ظ‡غŒ ط®ظˆط§ط¨â€Œط§ظ†ط¯ ظˆ ط¯غŒط± ط¨غŒط¯ط§ط± ظ…غŒâ€Œط´ظˆظ†ط¯: ط§ظˆظ„ غµ ط«ط§ظ†غŒظ‡طŒ ط¨ط¹ط¯ غŒع© ط¨ط§ط± ط¯غŒع¯ط± طھط§ غ²غµ ط«ط§ظ†غŒظ‡ طµط¨ط± ظ…غŒâ€Œع©ظ†غŒظ…
      for (const timeout of [5000, 25000]) {
        try {
          const [p, s] = await Promise.all([request("/api/projects", { timeout, cache: "no-cache" }), request("/api/skills", { timeout, cache: "no-cache" })]);
          if (cancelled) return;
          // ط§ع¯ط± ط¨ع©â€Œط§ظ†ط¯ ظ„غŒط³طھ ط®ط§ظ„غŒ ط¯ط§ط¯طŒ ظ„غŒط³طھ ظ‚ط¨ظ„غŒ ط±ط§ ظ†ع¯ظ‡ ظ…غŒâ€Œط¯ط§ط±غŒظ… طھط§ ع©ط§ط±ظپط±ظ…ط§ طµظپط­ظ‡â€ŒغŒ ط®ط§ظ„غŒ ظ†ط¨غŒظ†ط¯ (ظ…ع¯ط± ظˆظ‚طھغŒ ط§ط¯ظ…غŒظ† ظˆط§ط±ط¯ ط´ط¯ظ‡ ظˆ ط¹ظ…ط¯ط§ظ‹ ظ‡ظ…ظ‡ ط±ط§ ظ¾ط§ع© ع©ط±ط¯ظ‡)
          if (Array.isArray(p?.projects) && (p.projects.length > 0 || getToken())) {
            const next = { projects: p.projects, skills: Array.isArray(s?.skills) ? s.skills : SNAPSHOT.skills };
            setState({ ...next, source: "live" });
            if (p.projects.length > 0) {
              try {
                localStorage.setItem(KEY, JSON.stringify({ ...next, savedAt: new Date().toISOString() }));
              } catch {
                /* ط­ط§ظپط¸ظ‡â€ŒغŒ ظ…ط±ظˆط±ع¯ط± ظ¾ط± غŒط§ ط¨ط³طھظ‡ ط¨ظˆط¯ */
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
    // ط§غŒظ†طھط±ظ†طھ ط¯ظˆط¨ط§ط±ظ‡ ظˆطµظ„ ط´ط¯طŒ غŒط§ ط§ط¯ظ…غŒظ† ع†غŒط²غŒ ط±ط§ ط¯ط± ظ¾ظ†ظ„ ط°ط®غŒط±ظ‡ ع©ط±ط¯: ظپظˆط±ط§ظ‹ ط¯ظˆط¨ط§ط±ظ‡ ط¨ط®ظˆط§ظ† طھط§ طھط؛غŒغŒط± ط¯ط± ط³ط§غŒطھ ط¯غŒط¯ظ‡ ط´ظˆط¯
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

