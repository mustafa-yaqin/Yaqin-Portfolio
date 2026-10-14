import { Link } from "react-router-dom";
import { PROJECTS } from "../data.js";
import ProjectCard from "../components/ProjectCard.jsx";

function Home({ t, lang }) {
  // عدد ۱ تا ۴ را به فارسی یا انگلیسی می‌نویسد
  const number = (n) => n.toLocaleString(lang === "fa" ? "fa-IR" : "en-US");

  return (
    <>
      {/* ۱) بالای صفحه: معرفی و عکس */}
      <div className="hero">
        <div className="wrap hero-row">
          <div>
            <h1>{t.hero.title}</h1>
            <p>{t.hero.text}</p>
            <Link className="btn btn-main" to="/projects">{t.hero.btnProjects}</Link>
            <Link className="btn btn-line" to="/contact">{t.hero.btnContact}</Link>
          </div>

          <div className="photo">
            <img src="./photo.jpg" alt={t.hero.photoAlt} />
          </div>
        </div>
      </div>

      {/* ۲) عددها */}
      <div className="wrap">
        <div className="stats">
          {t.stats.map((item) => (
            <div key={item.label}>
              <b>{item.number}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ۳) چه کارهایی انجام می‌دهم */}
      <section>
        <div className="wrap">
          <h2>{t.home.servicesTitle}</h2>
          <p className="sub">{t.home.servicesSub}</p>

          <div className="grid grid4">
            {t.home.services.map((item, index) => (
              <div className="card" key={item.title}>
                <span className="num">{number(index + 1)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ۴) پروژه‌های برگزیده: سه پروژه اول از data.js */}
      <section className="band">
        <div className="wrap">
          <h2>{t.home.featuredTitle}</h2>
          <p className="sub">{t.home.featuredSub}</p>

          <div className="grid grid3 keep3">
            {PROJECTS.slice(0, 3).map((project) => (
              <ProjectCard key={project.fa.title} project={project} lang={lang} />
            ))}
          </div>

          <div className="center">
            <Link className="btn btn-line" to="/projects">{t.home.viewAll}</Link>
          </div>
        </div>
      </section>

      {/* ۵) روش کار */}
      <section>
        <div className="wrap">
          <h2>{t.home.processTitle}</h2>
          <p className="sub">{t.home.processSub}</p>

          <div className="grid grid4">
            {t.home.steps.map((item, index) => (
              <div className="card" key={item.title}>
                <span className="num">{number(index + 1)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ۶) دعوت به تماس */}
      <div className="wrap">
        <div className="cta">
          <h2>{t.home.ctaTitle}</h2>
          <p>{t.home.ctaText}</p>
          <Link className="btn btn-white" to="/contact">{t.home.ctaBtn}</Link>
        </div>
      </div>
    </>
  );
}

export default Home;
