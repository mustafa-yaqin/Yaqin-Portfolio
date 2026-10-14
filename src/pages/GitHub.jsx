import { useEffect, useState } from "react";
import { GITHUB_USER, FALLBACK_REPOS } from "../data.js";

function GitHub({ t, lang }) {
  // اول لیست آماده نشان داده می‌شود، بعد لیست واقعی گیت‌هاب جایش می‌آید
  const [repos, setRepos] = useState(FALLBACK_REPOS);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // پروژه‌های کپی‌شده (fork) نشان داده نمی‌شوند
          setRepos(data.filter((repo) => !repo.fork));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="page">
      <div className="wrap">
        <h2>{t.github.title}</h2>
        <p className="sub">{t.github.sub}</p>

        <div className="grid grid3">
          {repos.map((repo) => {
            // عکس پروژه: فایل screenshot.png که خودتان داخل مخزن گذاشته‌اید
            const branch = repo.default_branch || "main";
            const image = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${branch}/screenshot.png`;
            const description = repo.description || (repo.desc && repo.desc[lang]) || t.github.noDesc;

            return (
              <div className="card" key={repo.name}>
                <img
                  className="project-img"
                  src={image}
                  alt={repo.name}
                  onError={(e) => (e.target.style.display = "none")}
                />
                <h3>{repo.name}</h3>
                <p>{description}</p>

                <div className="tags">
                  {repo.language && <span>{repo.language}</span>}
                </div>

                <a className="card-link" href={repo.html_url} target="_blank" rel="noreferrer">
                  {t.github.code}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default GitHub;
