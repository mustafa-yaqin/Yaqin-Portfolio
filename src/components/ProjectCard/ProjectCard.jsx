import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import "../Card/Card.css";
import "./ProjectCard.css";
import { useAdminToken } from "../../api/adminToken.js";

// کارت یک پروژه (در صفحه خانه و صفحه پروژه‌ها)
// دکمه «جزئیات» به صفحه  /projects/<id>  می‌رود. اگر در پنل مدیریت لینک سایت یا گیت‌هاب نوشته باشید، دکمه‌های بعدی هم می‌آیند.
function ProjectCard({ project, lang, t }) {
  const text = project[lang]; // متن همین زبان
  const detailsUrl = `/projects/${project.id}`;
  const isAdmin = !!useAdminToken();

  return (
    <div className="card project-card">
      {/* فقط ادمین وارد‌شده می‌بیند */}
      {isAdmin && (
        <Link className="card-edit" to={`/admin?tab=projects&edit=${project.id}`}>
          ویرایش
        </Link>
      )}
      {/* بالای کارت: با کلیک روی تصویر هم به جزئیات می‌روید */}
      <Link className="media" to={detailsUrl} aria-label={text.title}>
        <div className="media-ph" aria-hidden="true">
          <div className="ph-bar"><i /><i /><i /></div>
          <div className="ph-body">
            <Icon name="code" size={34} />
            <span className="ph-line" />
            <span className="ph-line short" />
          </div>
        </div>

        {project.image && (
          <img
            className="project-img"
            src={project.image}
            alt={text.title}
            loading="lazy"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </Link>

      <div className="card-body">
        <h3>{text.title}</h3>
        <p>{text.text}</p>

        <div className="tags">
          {text.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="card-foot">
          <Link className="card-link" to={detailsUrl}>
            {t.projects.details}
            <Icon className="arrow" name="arrow" size={16} />
          </Link>

          {project.link && (
            <a className="card-link card-link-out" href={project.link} target="_blank" rel="noreferrer">
              {text.linkText || t.projects.visitBtn}
            </a>
          )}

          {project.github && (
            <a className="card-link card-link-out" href={project.github} target="_blank" rel="noreferrer">
              {t.projects.codeBtn}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
