function About({ t }) {
  return (
    <section className="page">
      <div className="wrap">
        <h2>{t.about.title}</h2>
        <p className="sub">{t.about.sub}</p>
        <p className="about-text">{t.about.text}</p>

        <div className="skills">
          {t.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
