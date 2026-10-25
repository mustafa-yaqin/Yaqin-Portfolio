import Icon from "../../components/Icon/Icon.jsx";
import "../../components/Card/Card.css";
import "../../components/ProjectCard/ProjectCard.css";

// کارت یک مخزن (repository) گیت‌هاب
function RepoCard({ repo, lang, t }) {
  const stars = repo.stargazers_count ?? repo.stars ?? 0;
  const description = repo.description || (repo.desc && repo.desc[lang]) || t.github.noDesc;

  return (
    <div className="card project-card">
      <a className="media" href={repo.html_url} target="_blank" rel="noreferrer" aria-label={repo.name}>
        <div className="media-ph" aria-hidden="true">
          <div className="ph-bar"><i /><i /><i /></div>
          <div className="ph-body">
            <Icon name="github" size={34} />
            <span className="ph-line" />
            <span className="ph-line short" />
          </div>
        </div>
      </a>

      <div className="card-body">
        <h3>{repo.name}</h3>
        <p>{description}</p>

        <div className="tags">
          {repo.language && <span>{repo.language}</span>}
          {stars > 0 && <span className="star">★ {stars}</span>}
        </div>

        <div className="card-foot">
          <a className="card-link" href={repo.html_url} target="_blank" rel="noreferrer">
            {t.github.code}
            <Icon className="arrow" name="arrow" size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default RepoCard;
