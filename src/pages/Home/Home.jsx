import Hero from "./sections/Hero/Hero.jsx";
import Stats from "./sections/Stats/Stats.jsx";
import Services from "./sections/Services/Services.jsx";
import FeaturedProjects from "./sections/FeaturedProjects/FeaturedProjects.jsx";
import Process from "./sections/Process/Process.jsx";
import CallToAction from "./sections/CallToAction/CallToAction.jsx";

// صفحه خانه: فقط بخش‌ها را زیر هم می‌چیند.
// هر بخش یک پوشه جدا در pages/Home/sections دارد. ترتیب بخش‌ها را همین‌جا عوض کنید.
function Home({ t, lang }) {
  return (
    <>
      <Hero t={t} />
      <Stats t={t} />
      <Services t={t} />
      <FeaturedProjects t={t} lang={lang} />
      <Process t={t} lang={lang} />
      <CallToAction t={t} />
    </>
  );
}

export default Home;
