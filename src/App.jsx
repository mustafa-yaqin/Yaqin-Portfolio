import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { TEXT } from "./data";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails.jsx";
import GitHub from "./pages/GitHub/GitHub.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import OfflineBanner from "./components/OfflineBanner/OfflineBanner.jsx";
import { PortfolioProvider } from "./context/PortfolioContext.jsx";
import AdminBar from "./components/AdminBar/AdminBar.jsx";
import { request } from "./api/client.js";
import { getToken } from "./api/adminToken.js";

// پنل مدیریت فقط وقتی باز شود دانلود می‌شود؛ بازدیدکننده‌ها کدش را نمی‌گیرند
const AdminApp = lazy(() => import("./pages/Admin/AdminApp.jsx"));

function App() {
  // زبان فعلی سایت: "fa" فارسی یا "en" انگلیسی (بعد از رفرش هم می‌ماند)
  const [lang, setLang] = useState(() =>
    localStorage.getItem("lang") === "en" ? "en" : "fa",
  );
  const t = TEXT[lang]; // همه متن‌های همین زبان

  // حالت نمایش: "light" روشن یا "dark" تاریک
  // پیش‌فرض سایت همیشه روشن است. اگر بازدیدکننده با دکمه ماه/خورشید عوض کند، انتخابش ذخیره می‌شود.
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("yaqin-theme") === "dark" ? "dark" : "light",
  );

  // با عوض شدن حالت، رنگ‌های کل سایت از styles/base.css عوض می‌شوند
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("yaqin-theme", theme);
  }, [theme]);

  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  // شمارنده‌ی بازدید: در هر نشست مرورگر فقط یک بار. هیچ اطلاعات شخصی‌ای فرستاده یا ذخیره نمی‌شود.
  // صفحه‌ی مدیریت و خود ادمین شمرده نمی‌شوند. اگر بک‌اند خاموش باشد، بی‌صدا رد می‌شود.
  useEffect(() => {
    if (isAdmin || sessionStorage.getItem("yaqin-visit") || getToken()) return;
    sessionStorage.setItem("yaqin-visit", "1");
    request("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
  }, [isAdmin]);

  // با عوض شدن زبان، جهت صفحه (راست‌به‌چپ یا چپ‌به‌راست) هم عوض می‌شود
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    document.title = t.pageTitle;
    localStorage.setItem("lang", lang);
  }, [lang, t]);

  return (
    <PortfolioProvider>
      <ScrollToTop />
      <AdminBar />
      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
      />

      {/* هر آدرس یک صفحه جداست. برای صفحه تازه: یک Route اینجا + یک پوشه در pages */}
      <main>
        <Routes>
          <Route path="/" element={<Home t={t} lang={lang} />} />
          <Route path="/about" element={<About t={t} lang={lang} />} />
          <Route path="/projects" element={<Projects t={t} lang={lang} />} />
          <Route
            path="/projects/:id"
            element={<ProjectDetails t={t} lang={lang} />}
          />
          <Route path="/github" element={<GitHub t={t} lang={lang} />} />
          <Route path="/contact" element={<Contact t={t} />} />
          {/* پنل مدیریت (فقط برای صاحب سایت): آدرس  #/admin */}
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<p className="sub">{t.loading}</p>}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound t={t} />} />
        </Routes>
      </main>

      <Footer t={t} />
      <OfflineBanner t={t} />
    </PortfolioProvider>
  );
}

export default App;
