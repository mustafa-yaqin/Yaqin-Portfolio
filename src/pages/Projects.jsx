import { PROJECTS } from "../data.js";
import ProjectCard from "../components/ProjectCard.jsx";

function Projects({ t, lang }) {
  return (
    <section className="page">
      <div className="wrap">
        <h2>{t.projects.title}</h2>
        <p className="sub">{t.projects.sub}</p>

        <div className="grid grid4">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.fa.title} project={project} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
