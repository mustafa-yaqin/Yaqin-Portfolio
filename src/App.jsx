import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { TEXT } from "./data.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import GitHub from "./pages/GitHub.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  // زبان فعلی سایت: "fa" فارسی یا "en" انگلیسی
  // زبان انتخاب‌شده در مرورگر ذخیره می‌شود تا بعد از رفرش هم بماند
  const [lang, setLang] = useState(() => (localStorage.getItem("lang") === "en" ? "en" : "fa"));
  const t = TEXT[lang]; // همه متن‌های همین زبان

  // با عوض شدن زبان، جهت صفحه (راست‌به‌چپ یا چپ‌به‌راست) هم عوض می‌شود
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    document.title = t.pageTitle;
    localStorage.setItem("lang", lang);
  }, [lang, t]);

  return (
    <>
      <ScrollToTop />
      <Header t={t} lang={lang} setLang={setLang} />

      {/* هر آدرس یک صفحه جداست */}
      <main>
      <Routes>
        <Route path="/" element={<Home t={t} lang={lang} />} />
        <Route path="/about" element={<About t={t} />} />
        <Route path="/projects" element={<Projects t={t} lang={lang} />} />
        <Route path="/github" element={<GitHub t={t} lang={lang} />} />
        <Route path="/contact" element={<Contact t={t} />} />
        <Route path="*" element={<NotFound t={t} />} />
      </Routes>
      </main>

      <Footer t={t} />
    </>
  );
}

export default App;
