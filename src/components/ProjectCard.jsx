// یک کارت پروژه. هم در صفحه خانه و هم در صفحه پروژه‌ها استفاده می‌شود.
function ProjectCard({ project, lang }) {
  // متن همین زبان: project.fa یا project.en
  const text = project[lang];

  return (
    <div className="card">
      {/* عکس فقط وقتی نشان داده می‌شود که در data.js نوشته باشید */}
      {project.image && (
        <img
          className="project-img"
          src={project.image}
          alt={text.title}
          loading="lazy"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <h3>{text.title}</h3>
      <p>{text.text}</p>

      <div className="tags">
        {text.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {project.link && (
        <a className="card-link" href={project.link} target="_blank" rel="noreferrer">
          {text.linkText}
        </a>
      )}
    </div>
  );
}

export default ProjectCard;
