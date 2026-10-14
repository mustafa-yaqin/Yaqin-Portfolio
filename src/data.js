// =====================================================
//  همه لینک‌ها و متن‌های سایت فقط در همین فایل هستند.
//  برای عوض کردن چیزی، فقط همین فایل را ویرایش کنید.
//  Everything you may want to change is in this file.
// =====================================================

// نام کاربری شما در گیت‌هاب
export const GITHUB_USER = "mustafa-yaqin";

// ---------- ۱) لینک‌های شبکه‌های اجتماعی و راه‌های ارتباطی ----------
// url: لینکی که با کلیک باز می‌شود      handle: نوشته‌ای که کنار آیکون دیده می‌شود
export const SOCIALS = [
  { name: "GitHub", icon: "github", url: "https://github.com/mustafa-yaqin", handle: "mustafa-yaqin", color: "#343a40" },
  // واتساپ: شماره را بدون + و بدون صفر اول بنویسید. مثال: 93 و بعد شماره
  { name: "WhatsApp", icon: "whatsapp", url: "https://wa.me/93700000000", handle: "+93 700 000 000", color: "#69db7c" },
  // تلگرام: به جای mustafa_yaqin آیدی خودتان را بنویسید
  { name: "Telegram", icon: "telegram", url: "https://t.me/mustafa_yaqin", handle: "@mustafa_yaqin", color: "#74c0fc" },
];

// ---------- ۲) پروژه‌های دستی شما ----------
// image: عکس پروژه. فایل عکس را داخل پوشه public/images بگذارید و اینجا بنویسید
//        مثال: image: "./images/erp.png"     (اگر عکس ندارید خالی بگذارید: "")
// link:  لینک پروژه (اگر ندارید خالی بگذارید: "")
export const PROJECTS = [
  {
    image: "",
    link: "https://yaqin-code.netlify.app/",
    fa: {
      title: "یقین کد",
      text: "سیستم مدیریت روغن‌فروشی با داشبورد، فروش و هشدار کمبود موجودی.",
      tags: ["داشبورد", "فروش", "موجودی"],
      linkText: "مشاهده سایت",
    },
    en: {
      title: "Yaqin Code",
      text: "Oil-shop management system with a dashboard, sales and low-stock alerts.",
      tags: ["Dashboard", "Sales", "Inventory"],
      linkText: "View site",
    },
  },
  {
    image: "",
    link: "",
    fa: {
      title: "سیستم ERP چندشرکتی",
      text: "جایگزین فایل‌های اکسل: مشتریان، گدام، صرافی، تاریخ شمسی، چند ارز، PDF و واتساپ.",
      tags: ["دری", "پشتو", "English", "چند ارز"],
      linkText: "",
    },
    en: {
      title: "Multi-company ERP",
      text: "Replaces Excel files: customers, warehouses, money exchange, Jalali dates, multiple currencies, PDF and WhatsApp.",
      tags: ["Dari", "Pashto", "English", "Multi-currency"],
      linkText: "",
    },
  },
  {
    image: "",
    link: "",
    fa: {
      title: "سیستم مشتریان و مطالبات",
      text: "مدل‌شده روی جدول‌های واقعی گوگل شیت: پروفایل مشتری، رسیدها، فاکتورها و مانده به هر ارز.",
      tags: ["مطالبات", "فاکتور", "گزارش"],
      linkText: "",
    },
    en: {
      title: "Customers & receivables",
      text: "Modeled on real Google Sheets: customer profiles, receipts, invoices and balances per currency.",
      tags: ["Receivables", "Invoices", "Reports"],
      linkText: "",
    },
  },
  {
    image: "",
    link: "",
    fa: {
      title: "نرم‌افزار حسابداری",
      text: "سیستم حسابداری چندشرکتی با دفتر کل دوطرفه، سابقه تغییرات و رابط فارسی.",
      tags: ["Next.js", "Django", "PostgreSQL", "JWT"],
      linkText: "",
    },
    en: {
      title: "Accounting software",
      text: "Multi-company accounting system with a double-entry ledger, change history and a Persian interface.",
      tags: ["Next.js", "Django", "PostgreSQL", "JWT"],
      linkText: "",
    },
  },
  {
    image: "",
    link: "",
    fa: {
      title: "وب‌سایت دفتر رهنمایی معاملات هرات",
      text: "وب‌سایت فارسی با ساختار املاک: جستجو، انواع جایداد، رهنمایی و مقالات.",
      tags: ["HTML", "CSS", "JS", "RTL"],
      linkText: "",
    },
    en: {
      title: "Herat Transaction Guidance Office website",
      text: "Persian real-estate style website: search, property types, guidance and articles.",
      tags: ["HTML", "CSS", "JS", "RTL"],
      linkText: "",
    },
  },
  {
    image: "",
    link: "https://github.com/mustafa-yaqin/drag-and-drop",
    fa: {
      title: "بورد کانبان (Drag & Drop)",
      text: "بورد وظایف با ستون‌های انجام‌نشده، در حال انجام و انجام‌شده و کارت‌های قابل کشیدن.",
      tags: ["JavaScript", "React", "Vite"],
      linkText: "کد در گیت‌هاب",
    },
    en: {
      title: "Kanban board (Drag & Drop)",
      text: "Task board with To Do, In Progress and Done columns and draggable cards.",
      tags: ["JavaScript", "React", "Vite"],
      linkText: "Code on GitHub",
    },
  },
  {
    image: "",
    link: "",
    fa: {
      title: "usePopcorn",
      text: "برنامه جستجو و امتیازدهی فیلم‌ها با React.",
      tags: ["React"],
      linkText: "",
    },
    en: {
      title: "usePopcorn",
      text: "A React app for searching and rating movies.",
      tags: ["React"],
      linkText: "",
    },
  },
  {
    image: "",
    link: "https://github.com/mustafa-yaqin?tab=repositories",
    fa: {
      title: "Color Palette Generator",
      text: "ساخت پالت رنگ با جاوااسکریپت.",
      tags: ["JavaScript"],
      linkText: "کد در گیت‌هاب",
    },
    en: {
      title: "Color Palette Generator",
      text: "Generate color palettes with JavaScript.",
      tags: ["JavaScript"],
      linkText: "Code on GitHub",
    },
  },
];

// ---------- ۳) اگر اینترنت یا گیت‌هاب کار نکرد، این‌ها نشان داده می‌شوند ----------
export const FALLBACK_REPOS = [
  { name: "html-portfolio", language: "HTML", html_url: "https://github.com/mustafa-yaqin/html-portfolio", desc: { fa: "قالب پورتفولیو با HTML.", en: "Portfolio template in HTML." } },
  { name: "html-start-page", language: "SCSS", html_url: "https://github.com/mustafa-yaqin/html-start-page", desc: { fa: "صفحه شروع با HTML و SCSS.", en: "Start page in HTML and SCSS." } },
  { name: "Zay", language: "SCSS", html_url: "https://github.com/mustafa-yaqin/Zay", desc: { fa: "قالب فروشگاهی با SCSS.", en: "Shop template in SCSS." } },
  { name: "Coder_Yaqin", language: "HTML", html_url: "https://github.com/mustafa-yaqin/Coder_Yaqin", desc: { fa: "صفحه معرفی با HTML.", en: "Intro page in HTML." } },
  { name: "Sun-moon", language: "CSS", html_url: "https://github.com/mustafa-yaqin/Sun-moon", desc: { fa: "انیمیشن خورشید و ماه با CSS.", en: "Sun and moon animation in CSS." } },
  { name: "Adventures-Game", language: "SCSS", html_url: "https://github.com/mustafa-yaqin/Adventures-Game", desc: { fa: "بازی ماجراجویی با SCSS.", en: "Adventure game in SCSS." } },
];

// ---------- ۴) همه متن‌های سایت: فارسی (fa) و انگلیسی (en) ----------
export const TEXT = {
  fa: {
    pageTitle: "مصطفی یقین | توسعه‌دهنده وب",
    langButton: "English",
    brandSub: "مصطفی یقین",
    contactBtn: "تماس با من",
    nav: [
      { to: "/", icon: "home", label: "خانه" },
      { to: "/about", icon: "info", label: "درباره من" },
      { to: "/projects", icon: "grid", label: "پروژه‌ها" },
      { to: "/github", icon: "github", label: "گیت‌هاب" },
      { to: "/contact", icon: "phone", label: "تماس" },
    ],
    hero: {
      title: "پروژه‌ها و سیستم‌های رویایی شما را با مصطفی یقین بسازید",
      text: "سیستم‌های مدیریتی، حسابداری و وب‌سایت‌های فارسی با راست‌به‌چپ کامل می‌سازم تا کار روزانه شما سریع‌تر و ساده‌تر شود.",
      btnProjects: "دیدن پروژه‌ها",
      btnContact: "تماس با من",
      photoAlt: "عکس مصطفی یقین",
    },
    stats: [
      { number: "۸", label: "پروژه واقعی" },
      { number: "۳", label: "زبان در سیستم‌ها: دری، پشتو، انگلیسی" },
      { number: "۱۶", label: "مخزن عمومی در گیت‌هاب" },
    ],
    about: {
      title: "درباره من",
      sub: "برنامه‌نویسی که از نیاز واقعی کسب‌وکارها شروع می‌کند",
      text: "من فایل‌های اکسل و کارهای دستی را به سیستم‌های وب تبدیل می‌کنم. پروژه‌هایم چندزبانه (دری، پشتو، انگلیسی) هستند، از تاریخ شمسی و چند واحد پولی پشتیبانی می‌کنند و برای کار روزانه ساخته شده‌اند. تمام کدها در گیت‌هاب من موجود است.",
    },
    skills: [
      "HTML", "CSS / SCSS", "JavaScript", "React", "Vite", "Next.js",
      "TypeScript", "Tailwind", "Python / Django", "PostgreSQL",
      "طراحی راست‌به‌چپ", "Git و GitHub",
    ],
    projects: {
      title: "پروژه‌های من",
      sub: "سیستم‌هایی که ساخته‌ام و روی آن‌ها کار می‌کنم",
    },
    home: {
      servicesTitle: "چه کارهایی انجام می‌دهم؟",
      servicesSub: "از ایده تا سیستم آماده، مناسب نیاز کار شما",
      services: [
        { title: "وب‌سایت‌های فارسی و چندزبانه", text: "وب‌سایت‌های سریع و واکنش‌گرا با راست‌به‌چپ کامل، در سه زبان دری، پشتو و انگلیسی." },
        { title: "سیستم‌های مدیریتی", text: "تبدیل فایل‌های اکسل و کارهای دستی به سیستم وب: مشتریان، گدام، فاکتور و گزارش." },
        { title: "نرم‌افزار حسابداری", text: "دفتر کل، چند ارز، تاریخ شمسی و ثبت سابقه تغییرات برای شرکت‌ها." },
        { title: "رابط کاربری با React", text: "صفحه‌های تمیز، سریع و قابل نگهداری با React و Vite." },
      ],
      featuredTitle: "پروژه‌های برگزیده",
      featuredSub: "چند نمونه از کارهای من",
      viewAll: "مشاهده همه پروژه‌ها",
      processTitle: "روش کار من",
      processSub: "ساده، شفاف و قدم‌به‌قدم",
      steps: [
        { title: "شناخت نیاز", text: "با شما صحبت می‌کنم تا دقیقاً بفهمم چه چیزی لازم دارید." },
        { title: "طراحی", text: "ساختار و ظاهر کار را ساده و واضح طراحی می‌کنم." },
        { title: "ساخت", text: "کد را تمیز و مرحله‌به‌مرحله می‌نویسم و آزمایش می‌کنم." },
        { title: "تحویل و پشتیبانی", text: "پروژه را تحویل می‌دهم و در استفاده از آن کمک می‌کنم." },
      ],
      ctaTitle: "پروژه‌ای در ذهن دارید؟",
      ctaText: "بیایید با هم آن را بسازیم. همین حالا پیام بدهید.",
      ctaBtn: "شروع گفتگو",
    },
    contactPage: {
      title: "تماس با من",
      sub: "برای ساخت سیستم یا وب‌سایت، از یکی از این راه‌ها پیام بدهید",
    },
    notFound: { title: "این صفحه پیدا نشد", back: "برگشت به خانه" },
    github: {
      title: "پروژه‌های گیت‌هاب",
      sub: "این بخش خودکار از گیت‌هاب ساخته می‌شود. برای نمایش عکس پروژه، فایل screenshot.png را در مخزن بگذارید.",
      code: "کد در گیت‌هاب",
      noDesc: "پروژه‌ای در گیت‌هاب",
    },
    footer: {
      about: "توسعه سیستم‌ها و وب‌سایت‌های فارسی، از ایده تا اجرا.",
      social: "شبکه‌های اجتماعی",
      links: "پیوندها",
      contactUs: "تماس با ما",
      rights: "تمامی حقوق مادی و معنوی برای مصطفی یقین محفوظ است.",
    },
  },

  en: {
    pageTitle: "Mustafa Yaqin | Web Developer",
    langButton: "فارسی",
    brandSub: "Mustafa Yaqin",
    contactBtn: "Contact me",
    nav: [
      { to: "/", icon: "home", label: "Home" },
      { to: "/about", icon: "info", label: "About" },
      { to: "/projects", icon: "grid", label: "Projects" },
      { to: "/github", icon: "github", label: "GitHub" },
      { to: "/contact", icon: "phone", label: "Contact" },
    ],
    hero: {
      title: "Build your dream projects and systems with Mustafa Yaqin",
      text: "I build management systems, accounting systems and Persian websites with full right-to-left support, to make your daily work faster and simpler.",
      btnProjects: "View projects",
      btnContact: "Contact me",
      photoAlt: "Photo of Mustafa Yaqin",
    },
    stats: [
      { number: "8", label: "Real projects" },
      { number: "3", label: "System languages: Dari, Pashto, English" },
      { number: "16", label: "Public GitHub repositories" },
    ],
    about: {
      title: "About me",
      sub: "A developer who starts from real business needs",
      text: "I turn Excel files and manual work into web systems. My projects are multilingual (Dari, Pashto, English), support the Jalali calendar and multiple currencies, and are built for daily work. All my code is on my GitHub.",
    },
    skills: [
      "HTML", "CSS / SCSS", "JavaScript", "React", "Vite", "Next.js",
      "TypeScript", "Tailwind", "Python / Django", "PostgreSQL",
      "RTL design", "Git & GitHub",
    ],
    projects: {
      title: "My projects",
      sub: "Systems I have built and am working on",
    },
    home: {
      servicesTitle: "What I do",
      servicesSub: "From idea to a finished system, built around your needs",
      services: [
        { title: "Persian & multilingual websites", text: "Fast, responsive websites with full right-to-left support in Dari, Pashto and English." },
        { title: "Management systems", text: "Turning Excel files and manual work into web systems: customers, warehouses, invoices and reports." },
        { title: "Accounting software", text: "General ledger, multiple currencies, Jalali dates and change history for companies." },
        { title: "React user interfaces", text: "Clean, fast and maintainable pages built with React and Vite." },
      ],
      featuredTitle: "Featured projects",
      featuredSub: "A few examples of my work",
      viewAll: "View all projects",
      processTitle: "How I work",
      processSub: "Simple, clear and step by step",
      steps: [
        { title: "Understand the need", text: "I talk with you to understand exactly what you need." },
        { title: "Design", text: "I design the structure and look to be simple and clear." },
        { title: "Build", text: "I write clean code step by step and test it." },
        { title: "Deliver & support", text: "I deliver the project and help you use it." },
      ],
      ctaTitle: "Have a project in mind?",
      ctaText: "Let's build it together. Send me a message today.",
      ctaBtn: "Start a conversation",
    },
    contactPage: {
      title: "Contact me",
      sub: "To build a system or a website, message me in any of these ways",
    },
    notFound: { title: "Page not found", back: "Back to home" },
    github: {
      title: "GitHub projects",
      sub: "This section is built automatically from GitHub. To show a project image, add a file named screenshot.png to the repository.",
      code: "Code on GitHub",
      noDesc: "A project on GitHub",
    },
    footer: {
      about: "Building Persian systems and websites, from idea to launch.",
      social: "Social media",
      links: "Links",
      contactUs: "Contact us",
      rights: "© Mustafa Yaqin. All rights reserved.",
    },
  },
};
