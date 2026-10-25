import { Link } from "react-router-dom";
import { usePortfolio } from "../../../../context/PortfolioContext.jsx";
import ProjectCard from "../../../../components/ProjectCard/ProjectCard.jsx";

// پروژه‌های برگزیده: سه پروژه اول (ترتیب را در پنل مدیریت عوض کنید)
function FeaturedProjects({ t, lang }) {
  const { projects } = usePortfolio();
  return (
    <section className="band">
      <div className="wrap">
        <h2>{t.home.featuredTitle}</h2>
        <p className="sub">{t.home.featuredSub}</p>

        <div className="grid grid3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} lang={lang} t={t} />
          ))}
        </div>

        <div className="center">
          <Link className="btn btn-line" to="/projects">{t.home.viewAll}</Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
