import { usePortfolio } from "../../context/PortfolioContext.jsx";
import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";

// همه پروژه‌ها. پروژه‌ها از بک‌اند می‌آیند و با پنل مدیریت (#/admin) ویرایش می‌شوند.
function Projects({ t, lang }) {
  const { projects } = usePortfolio();
  return (
    <section className="page">
      <div className="wrap">
        <h2>{t.projects.title}</h2>
        <p className="sub">{t.projects.sub}</p>

        <div className="grid grid4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} lang={lang} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
