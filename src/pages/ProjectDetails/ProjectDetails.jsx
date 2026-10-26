import { Link, useParams } from "react-router-dom";
import { SOCIALS } from "../../data";
import { usePortfolio } from "../../context/PortfolioContext.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import NotFound from "../NotFound/NotFound.jsx";
import "../../components/ProjectCard/ProjectCard.css";
import "./ProjectDetails.css";

// صفحه جزئیات یک پروژه. آدرس: /projects/<id>   (useParams همان <id> را از آدرس می‌دهد)
function ProjectDetails({ t, lang }) {
  const { id } = useParams();
  const { projects, status } = usePortfolio();
  const project = projects.find((item) => item.id === id);

  // پروژه‌ی تازه‌ای که هنوز در نسخه‌ی ذخیره‌شده نیست: تا آمدن جواب بک‌اند صبر کن، نه «پیدا نشد»
  if (!project && status === "loading") return <section className="page"><p className="repo-status">{t.loading}</p></section>;
  // آدرس اشتباه: صفحه «پیدا نشد» نشان بده
  if (!project) return <NotFound t={t} />;

  const text = project[lang];

  return (
    <section className="page">
      <div className="wrap details">
        <Link className="details-back" to="/projects">
          <Icon className="arrow back-arrow" name="arrow" size={16} />
          {t.projects.back}
        </Link>

        <h1>{text.title}</h1>
        <p className="details-text">{text.text}</p>

        <div className="details-grid">
          <div className="details-box">
            <h3>{t.projects.features}</h3>
            <ul>
              {text.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="details-box">
            <h3>{t.projects.technologies}</h3>
            <div className="tags">
              {text.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="details-actions">
          {project.link && (
            <a className="btn btn-main" href={project.link} target="_blank" rel="noreferrer">
              {text.linkText}
            </a>
          )}
          {project.github && (
            <a className="btn btn-line" href={project.github} target="_blank" rel="noreferrer">
              {t.projects.codeBtn}
            </a>
          )}
          <a className="btn btn-line" href={SOCIALS[0].url} target="_blank" rel="noreferrer">
            {t.projects.githubBtn}
          </a>
          <Link className="btn btn-line" to="/contact">
            {t.projects.orderBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProjectDetails;
