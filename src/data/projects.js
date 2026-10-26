// ---------- ۲) پروژه‌های دستی شما ----------
// id: نام کوتاه انگلیسی برای آدرس صفحه جزئیات (مثلا #/projects/erp) - باید یکتا باشد
// image: عکس پروژه. فایل عکس را داخل پوشه public/images بگذارید و اینجا بنویسید
//        مثال: image: "./images/erp.png"     (اگر عکس ندارید خالی بگذارید: "")
// link:  لینک پروژه (اگر ندارید خالی بگذارید: "")
export const PROJECTS = [
  {
    id: "yaqin-code",
    image: "",
    link: "https://yaqin-code.netlify.app/",
    fa: {
      features: ["داشبورد فروش و آمار", "ثبت فروش روزانه", "هشدار کمبود موجودی"],
      title: "یقین کد",
      text: "سیستم مدیریت روغن‌فروشی با داشبورد، فروش و هشدار کمبود موجودی.",
      tags: ["داشبورد", "فروش", "موجودی"],
      linkText: "مشاهده سایت",
    },
    en: {
      features: ["Sales dashboard and stats", "Daily sales entry", "Low-stock alerts"],
      title: "Yaqin Code",
      text: "Oil-shop management system with a dashboard, sales and low-stock alerts.",
      tags: ["Dashboard", "Sales", "Inventory"],
      linkText: "View site",
    },
  },
  {
    id: "erp",
    image: "",
    link: "",
    fa: {
      features: ["جایگزین فایل‌های اکسل", "مشتریان، گدام و صرافی", "تاریخ شمسی و چند ارز", "خروجی PDF و ارسال با واتساپ", "زبان دری، پشتو و انگلیسی"],
      title: "سیستم ERP چندشرکتی",
      text: "جایگزین فایل‌های اکسل: مشتریان، گدام، صرافی، تاریخ شمسی، چند ارز، PDF و واتساپ.",
      tags: ["دری", "پشتو", "English", "چند ارز"],
      linkText: "",
    },
    en: {
      features: ["Replaces Excel files", "Customers, warehouses and money exchange", "Jalali dates and multiple currencies", "PDF export and WhatsApp sharing", "Dari, Pashto and English"],
      title: "Multi-company ERP",
      text: "Replaces Excel files: customers, warehouses, money exchange, Jalali dates, multiple currencies, PDF and WhatsApp.",
      tags: ["Dari", "Pashto", "English", "Multi-currency"],
      linkText: "",
    },
  },
  {
    id: "customers",
    image: "",
    link: "",
    fa: {
      features: ["پروفایل مشتری", "رسیدها و فاکتورها", "مانده حساب به هر ارز", "گزارش مطالبات"],
      title: "سیستم مشتریان و مطالبات",
      text: "مدل‌شده روی جدول‌های واقعی گوگل شیت: پروفایل مشتری، رسیدها، فاکتورها و مانده به هر ارز.",
      tags: ["مطالبات", "فاکتور", "گزارش"],
      linkText: "",
    },
    en: {
      features: ["Customer profiles", "Receipts and invoices", "Balance per currency", "Receivables reports"],
      title: "Customers & receivables",
      text: "Modeled on real Google Sheets: customer profiles, receipts, invoices and balances per currency.",
      tags: ["Receivables", "Invoices", "Reports"],
      linkText: "",
    },
  },
  {
    id: "accounting",
    image: "",
    link: "",
    fa: {
      features: ["دفتر کل دوطرفه", "چندشرکتی", "ثبت سابقه تغییرات", "رابط فارسی راست‌به‌چپ"],
      title: "نرم‌افزار حسابداری",
      text: "سیستم حسابداری چندشرکتی با دفتر کل دوطرفه، سابقه تغییرات و رابط فارسی.",
      tags: ["Next.js", "Django", "PostgreSQL", "JWT"],
      linkText: "",
    },
    en: {
      features: ["Double-entry ledger", "Multi-company", "Change history", "Persian right-to-left interface"],
      title: "Accounting software",
      text: "Multi-company accounting system with a double-entry ledger, change history and a Persian interface.",
      tags: ["Next.js", "Django", "PostgreSQL", "JWT"],
      linkText: "",
    },
  },
  {
    id: "herat-office",
    image: "",
    link: "",
    fa: {
      features: ["جستجوی ملک", "انواع جایداد", "بخش رهنمایی", "مقالات"],
      title: "وب‌سایت دفتر رهنمایی معاملات هرات",
      text: "وب‌سایت فارسی با ساختار املاک: جستجو، انواع جایداد، رهنمایی و مقالات.",
      tags: ["HTML", "CSS", "JS", "RTL"],
      linkText: "",
    },
    en: {
      features: ["Property search", "Property types", "Guidance section", "Articles"],
      title: "Herat Transaction Guidance Office website",
      text: "Persian real-estate style website: search, property types, guidance and articles.",
      tags: ["HTML", "CSS", "JS", "RTL"],
      linkText: "",
    },
  },
  {
    id: "kanban",
    image: "",
    link: "https://github.com/mustafa-yaqin/drag-and-drop",
    fa: {
      features: ["سه ستون: انجام‌نشده، در حال انجام، انجام‌شده", "کارت‌های قابل کشیدن", "ساخته‌شده با React و Vite"],
      title: "بورد کانبان (Drag & Drop)",
      text: "بورد وظایف با ستون‌های انجام‌نشده، در حال انجام و انجام‌شده و کارت‌های قابل کشیدن.",
      tags: ["JavaScript", "React", "Vite"],
      linkText: "کد در گیت‌هاب",
    },
    en: {
      features: ["Three columns: To Do, In Progress, Done", "Draggable cards", "Built with React and Vite"],
      title: "Kanban board (Drag & Drop)",
      text: "Task board with To Do, In Progress and Done columns and draggable cards.",
      tags: ["JavaScript", "React", "Vite"],
      linkText: "Code on GitHub",
    },
  },
  {
    id: "usepopcorn",
    image: "",
    link: "",
    fa: {
      features: ["جستجوی فیلم", "امتیازدهی به فیلم‌ها", "ساخته‌شده با React"],
      title: "usePopcorn",
      text: "برنامه جستجو و امتیازدهی فیلم‌ها با React.",
      tags: ["React"],
      linkText: "",
    },
    en: {
      features: ["Movie search", "Rate movies", "Built with React"],
      title: "usePopcorn",
      text: "A React app for searching and rating movies.",
      tags: ["React"],
      linkText: "",
    },
  },
  {
    id: "color-palette",
    image: "",
    link: "https://github.com/mustafa-yaqin?tab=repositories",
    fa: {
      features: ["ساخت پالت رنگ", "ساخته‌شده با جاوااسکریپت"],
      title: "Color Palette Generator",
      text: "ساخت پالت رنگ با جاوااسکریپت.",
      tags: ["JavaScript"],
      linkText: "کد در گیت‌هاب",
    },
    en: {
      features: ["Generate color palettes", "Built with JavaScript"],
      title: "Color Palette Generator",
      text: "Generate color palettes with JavaScript.",
      tags: ["JavaScript"],
      linkText: "Code on GitHub",
    },
  },
];

