# انتشار روی Render (قدم به قدم)

## قبل از شروع

- **پلن:** باید پلن پولی (Starter، حدود ۷ دلار در ماه) بگیرید. پلن رایگان دیسک ماندگار ندارد و حافظه‌اش با هر دیپلوی و هر راه‌اندازی دوباره پاک می‌شود؛ یعنی هر چه در پنل بسازید از بین می‌رود. دیسک ۱ گیگابایتی حدود ۰٫۲۵ دلار در ماه است. قیمت‌ها را در render.com/pricing دوباره ببینید.
- **حساب GitHub** (رندر پروژه را از آنجا می‌گیرد).

## ۱) پروژه را روی GitHub بگذارید

داخل پوشه‌ی پروژه (پوشه‌ی `node_modules` و `dist` خودکار نادیده گرفته می‌شوند):

```
git init
git add .
git commit -m "portfolio with backend"
git branch -M main
git remote add origin https://github.com/<نام-کاربری>/<نام-مخزن>.git
git push -u origin main
```

(مخزن را قبلش در GitHub بسازید. می‌تواند Private باشد.)

## ۲) ساخت سرویس با Blueprint

1. در Render: **New +** ← **Blueprint**.
2. حساب GitHub را وصل کنید و مخزن را انتخاب کنید.
3. رندر فایل `render.yaml` را می‌خواند و همه‌چیز را خودش تنظیم می‌کند.
4. فقط **SETUP_CODE** را از شما می‌پرسد: یک کد دلخواه بنویسید (مثلاً `k7m2x9qa`) و یادتان بماند. با این کد حساب مدیر را می‌سازید.
5. **Apply** را بزنید. ساخت و اجرا حدود ۳ تا ۶ دقیقه طول می‌کشد.

## ۳) ساخت حساب مدیر

آدرس `https://<نام-سرویس>.onrender.com/#/admin` را باز کنید. چون هنوز ادمینی نیست، فرم «ساخت حساب مدیر» می‌آید: نام کاربری، رمز (حداقل ۱۰ حرف) و همان `SETUP_CODE` را بزنید. بعد از ساخته شدن، این فرم دیگر کار نمی‌کند.

## ۴) بررسی

- `https://<نام-سرویس>.onrender.com` : سایت
- `https://<نام-سرویس>.onrender.com/api/health` : باید `{"ok":true}` بدهد
- `https://<نام-سرویس>.onrender.com/api/projects` : لیست پروژه‌ها
- وارد پنل شوید، یک پروژه تغییر بدهید و در سایت ببینید. بعد در Render دکمه‌ی **Manual Deploy** را بزنید و مطمئن شوید تغییرتان مانده است (یعنی دیسک درست وصل است).

## اگر Blueprint نمی‌خواهید (ساخت دستی)

**New +** ← **Web Service** ← مخزن را انتخاب کنید و این‌ها را بگذارید:

| بخش | مقدار |
|---|---|
| Runtime | Node |
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `npm start` |
| Instance Type | Starter یا بالاتر |
| Health Check Path | `/api/health` |
| Disk (Advanced) | Name: `portfolio-data`، Mount Path: `/var/data`، Size: 1 GB |

متغیرها (Environment):

| کلید | مقدار |
|---|---|
| `DATA_DIR` | `/var/data` |
| `TRUST_PROXY` | `1` |
| `SESSION_SECRET` | یک رشته‌ی تصادفی حداقل ۳۲ حرفی. در رایانه: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SETUP_CODE` | کد دلخواه برای ساخت حساب مدیر |

**`NODE_ENV` را خودتان نگذارید**: رندر در زمان اجرا آن را `production` می‌کند، و اگر در محیط ساخت هم باشد ابزار ساخت (Vite) نصب نمی‌شود. نسخه‌ی Node با فایل `.node-version` روی ۲۲ تنظیم شده است.

## بعد از انتشار

- **بروزرسانی کد:** هر `git push` به شاخه‌ی `main` دوباره منتشر می‌کند. دیتابیس و عکس‌ها روی دیسک می‌مانند.
- **فقط یک نمونه (instance):** دیتابیس SQLite است؛ تعداد نمونه‌ها را بیشتر از ۱ نکنید.
- **دامنه‌ی خودتان:** Settings ← Custom Domains. گواهی HTTPS خودکار ساخته می‌شود.
- **لاگ:** Logs. **ترمینال:** Shell (مثلاً `npm run backup` و `npm run create-admin` برای عوض کردن رمز فراموش‌شده).
- **پشتیبان:** `npm run backup` در Shell یک کپی از دیتابیس در `/var/data/backups` می‌گذارد. پوشه‌ی `/var/data/uploads` (عکس‌ها) را هم گاهی بگیرید. در داشبورد رندر بخش Disks عکس‌های لحظه‌ای (snapshot) دیسک را هم نشان می‌دهد.
- **رمز را فراموش کردید:** در Shell دستور `npm run create-admin` را بزنید.
- **خواب رفتن:** روی پلن پولی سرویس نمی‌خوابد.
