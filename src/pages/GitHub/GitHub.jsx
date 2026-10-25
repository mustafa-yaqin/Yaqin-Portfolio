import { useEffect, useState } from "react";
import { GITHUB_USER, FALLBACK_REPOS, SOCIALS } from "../../data";
import RepoCard from "./RepoCard.jsx";
import "./GitHub.css";

function GitHub({ t, lang }) {
  // اول لیست آماده نشان داده می‌شود، بعد لیست واقعی گیت‌هاب جایش می‌آید
  const [repos, setRepos] = useState(FALLBACK_REPOS);
  // وضعیت دریافت: "loading" در حال دریافت، "done" تمام شد، "failed" نشد
  const [status, setStatus] = useState("loading");
  // با هر بار زدن «تلاش دوباره» این عدد بیشتر می‌شود و دریافت از نو شروع می‌شود
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // اگر چند دقیقه پیش لیست را گرفته‌ایم، دوباره از گیت‌هاب نمی‌پرسیم (گیت‌هاب تعداد درخواست را محدود می‌کند)
    const saved = sessionStorage.getItem("yaqin-repos");
    if (saved) {
      setRepos(JSON.parse(saved));
      setStatus("done");
      return;
    }

    setStatus("loading");

    // اگر اینترنت ضعیف باشد، بعد از ۸ ثانیه صبر را تمام می‌کنیم
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // پروژه‌های کپی‌شده (fork) نشان داده نمی‌شوند و بیشترین ستاره اول می‌آید
          const list = data.filter((repo) => !repo.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);
          setRepos(list);
          sessionStorage.setItem("yaqin-repos", JSON.stringify(list));
          setStatus("done");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed")) // اینترنت نبود: همان لیست آماده می‌ماند
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);

  // وقتی اینترنت دوباره وصل شد، خودکار دوباره تلاش می‌کند
  useEffect(() => {
    const retry = () => setAttempt((n) => n + 1);
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, []);

  return (
    <section className="page">
      <div className="wrap">
        <h2>{t.github.title}</h2>
        <p className="sub">{t.github.sub}</p>

        {/* پیام وضعیت: در حال دریافت یا نشدن اتصال */}
        {status === "loading" && <p className="repo-status">{t.github.loading}</p>}
        {status === "failed" && (
          <p className="repo-status">
            {t.github.failed}{" "}
            <button className="repo-retry" onClick={() => setAttempt((n) => n + 1)}>
              {t.github.retry}
            </button>
          </p>
        )}

        <div className="grid grid3">
          {repos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} lang={lang} t={t} />
          ))}
        </div>

        <div className="center">
          <a className="btn btn-line" href={SOCIALS[0].url} target="_blank" rel="noreferrer">
            {t.github.viewAll}
          </a>
        </div>
      </div>
    </section>
  );
}

export default GitHub;
