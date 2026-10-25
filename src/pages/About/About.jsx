import { usePortfolio } from "../../context/PortfolioContext.jsx";
import "./About.css";

function About({ t, lang }) {
  const { skills } = usePortfolio();
  return (
    <section className="page">
      <div className="wrap">
        <h2>{t.about.title}</h2>
        <p className="sub">{t.about.sub}</p>
        <p className="about-text">{t.about.text}</p>

        <div className="skills">
          {skills.map((skill) => (
            <span key={skill.id}>{skill[lang]}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
