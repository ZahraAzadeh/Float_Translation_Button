# ⚡ راهنمای سریع ساخت APK/IPA

## 🎯 روش سریع (PWABuilder) - 5 دقیقه

### مرحله 1: آپلود برنامه
1. برنامه را روی GitHub Pages یا Netlify آپلود کنید
2. آدرس HTTPS بگیرید (مثلاً: `https://your-app.netlify.app`)

### مرحله 2: ساخت APK
1. به [PWABuilder.com](https://www.pwabuilder.com/) بروید
2. URL برنامه را وارد کنید
3. روی **"Build My PWA"** کلیک کنید
4. در بخش Android، **"Generate Package"** را بزنید
5. APK را دانلود کنید ✅

### مرحله 3: ساخت IPA
1. در همان صفحه PWABuilder
2. در بخش iOS، **"Generate Package"** را بزنید
3. فایل Xcode Project را دانلود کنید
4. در Xcode باز کنید و Build کنید

---

## 🔧 روش حرفه‌ای (Capacitor)

### نصب:
```bash
npm install -g @capacitor/cli
```

### راه‌اندازی:
```bash
# در پوشه پروژه
npx cap init
# App name: Translation App
# App ID: com.yourname.translation

# اضافه کردن Android
npx cap add android
npx cap copy
npx cap open android

# در Android Studio:
# Build > Generate Signed Bundle / APK
```

### برای iOS (فقط macOS):
```bash
npx cap add ios
npx cap copy
npx cap open ios

# در Xcode:
# Product > Archive
```

---

## 📝 فایل‌های آماده

- `package.json` - برای npm scripts
- `capacitor.config.json` - تنظیمات Capacitor
- `cordova-config.xml` - تنظیمات Cordova

---

**برای راهنمای کامل، `BUILD_APK_IPA_GUIDE.md` را بخوانید.**

