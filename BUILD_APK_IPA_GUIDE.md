# 📦 راهنمای ساخت APK و IPA

این راهنما به شما کمک می‌کند تا برنامه را به فایل APK (Android) یا IPA (iOS) تبدیل کنید.

## 🎯 روش‌های مختلف

### روش 1: استفاده از PWABuilder (ساده‌ترین) ⭐ **پیشنهادی**

این روش ساده‌ترین و سریع‌ترین روش است و نیاز به کدنویسی ندارد.

#### مراحل:

1. **آپلود برنامه روی سرور**:
   - برنامه را روی GitHub Pages، Netlify، یا هر سرور دیگری آپلود کنید
   - مطمئن شوید که با HTTPS کار می‌کند

2. **استفاده از PWABuilder**:
   - به [PWABuilder.com](https://www.pwabuilder.com/) بروید
   - آدرس URL برنامه خود را وارد کنید (مثلاً: `https://your-app.netlify.app`)
   - روی **"Start"** کلیک کنید

3. **ساخت APK**:
   - در صفحه نتایج، به بخش **"Android"** بروید
   - روی **"Generate Package"** کلیک کنید
   - فایل APK را دانلود کنید

4. **ساخت IPA (iOS)**:
   - به بخش **"iOS"** بروید
   - روی **"Generate Package"** کلیک کنید
   - فایل Xcode Project را دانلود کنید
   - در Xcode باز کنید و Build کنید

**مزایا**: ساده، سریع، بدون نیاز به نصب نرم‌افزار

**معایب**: نیاز به آپلود روی سرور

---

### روش 2: استفاده از Capacitor (حرفه‌ای) ⭐⭐

این روش برای توسعه‌دهندگان مناسب است و کنترل بیشتری می‌دهد.

#### پیش‌نیازها:

- Node.js نصب شده باشد
- Android Studio (برای APK)
- Xcode (برای IPA - فقط macOS)

#### مراحل:

##### مرحله 1: نصب Capacitor

```bash
# نصب Capacitor CLI
npm install -g @capacitor/cli

# یا با npx (بدون نصب)
npx @capacitor/cli
```

##### مرحله 2: ایجاد پروژه Capacitor

```bash
# در پوشه پروژه خود
npx cap init

# سوالات:
# App name: Translation App
# App ID: com.yourname.translation
# Web dir: . (یا dist اگر build می‌کنید)
```

##### مرحله 3: اضافه کردن پلتفرم Android

```bash
# اضافه کردن Android
npx cap add android

# کپی فایل‌ها
npx cap copy

# باز کردن در Android Studio
npx cap open android
```

##### مرحله 4: ساخت APK در Android Studio

1. Android Studio را باز کنید
2. پروژه را باز کنید (پوشه `android/`)
3. Build > Generate Signed Bundle / APK
4. APK را انتخاب کنید
5. Key Store ایجاد کنید (یا از قبل موجود)
6. Build را بزنید
7. فایل APK در `android/app/build/outputs/apk/` قرار دارد

##### مرحله 5: ساخت IPA (iOS)

```bash
# اضافه کردن iOS (فقط macOS)
npx cap add ios

# کپی فایل‌ها
npx cap copy

# باز کردن در Xcode
npx cap open ios
```

در Xcode:
1. Signing & Capabilities را تنظیم کنید
2. Product > Archive
3. Distribute App
4. فایل IPA ایجاد می‌شود

---

### روش 3: استفاده از Cordova

#### نصب Cordova:

```bash
npm install -g cordova
```

#### ایجاد پروژه:

```bash
cordova create myapp com.example.translation "Translation App"
cd myapp
```

#### کپی فایل‌ها:

```bash
# کپی فایل‌های HTML, CSS, JS به www/
cp -r ../* www/
```

#### اضافه کردن پلتفرم:

```bash
cordova platform add android
cordova platform add ios
```

#### ساخت:

```bash
# ساخت APK
cordova build android

# ساخت IPA
cordova build ios
```

---

### روش 4: استفاده از Tauri (برای Desktop + Mobile)

Tauri برای ساخت اپلیکیشن‌های Desktop و Mobile مناسب است.

#### نصب:

```bash
npm install -g @tauri-apps/cli
```

#### ایجاد پروژه:

```bash
npm create tauri-app
```

---

## 🔧 تنظیمات پیشرفته

### تنظیمات Android (build.gradle)

در فایل `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.yourname.translation"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
}
```

### تنظیمات iOS (Info.plist)

در فایل `ios/App/App/Info.plist`:

```xml
<key>CFBundleDisplayName</key>
<string>Translation App</string>
<key>CFBundleIdentifier</key>
<string>com.yourname.translation</string>
```

---

## 📱 تست APK/IPA

### تست APK:

1. فایل APK را روی موبایل Android کپی کنید
2. Settings > Security > Unknown Sources را فعال کنید
3. فایل APK را باز کنید و نصب کنید

### تست IPA:

1. نیاز به Apple Developer Account دارد ($99/سال)
2. یا از TestFlight استفاده کنید
3. یا با Xcode روی دستگاه تست کنید

---

## 🚀 بهینه‌سازی

### کاهش حجم APK:

1. استفاده از ProGuard
2. حذف منابع غیرضروری
3. استفاده از Split APKs

### بهبود عملکرد:

1. بهینه‌سازی تصاویر
2. Minify کردن JavaScript
3. استفاده از CDN برای منابع

---

## ⚠️ نکات مهم

### برای Android:

- **Minimum SDK**: حداقل Android 5.0 (API 21)
- **Target SDK**: آخرین نسخه Android
- **Permissions**: در `AndroidManifest.xml` تنظیم کنید

### برای iOS:

- **Minimum iOS**: iOS 12.0 یا بالاتر
- **Apple Developer Account**: برای انتشار نیاز است
- **Signing**: باید Certificate و Provisioning Profile داشته باشید

---

## 🛠️ حل مشکلات

### مشکل: خطا در Build

**راه‌حل**:
- SDK های Android را در Android Studio نصب کنید
- Gradle را به‌روزرسانی کنید
- Cache را پاک کنید: `./gradlew clean`

### مشکل: خطای Signing (iOS)

**راه‌حل**:
- Apple Developer Account ایجاد کنید
- Certificate و Provisioning Profile را تنظیم کنید
- در Xcode > Signing & Capabilities تنظیم کنید

### مشکل: برنامه Crash می‌کند

**راه‌حل**:
- Console را بررسی کنید
- Permissions را بررسی کنید
- Service Worker را بررسی کنید

---

## 📦 انتشار

### انتشار در Google Play:

1. Google Play Console ایجاد کنید
2. APK یا AAB آپلود کنید
3. اطلاعات اپلیکیشن را پر کنید
4. منتشر کنید

### انتشار در App Store:

1. App Store Connect ایجاد کنید
2. IPA آپلود کنید
3. اطلاعات اپلیکیشن را پر کنید
4. برای Review ارسال کنید

---

## 🎯 خلاصه روش‌ها

| روش | سختی | زمان | نیاز به کدنویسی |
|-----|------|-----|-----------------|
| PWABuilder | ⭐ آسان | 5 دقیقه | ❌ خیر |
| Capacitor | ⭐⭐ متوسط | 30 دقیقه | ✅ بله |
| Cordova | ⭐⭐ متوسط | 30 دقیقه | ✅ بله |
| Tauri | ⭐⭐⭐ سخت | 1 ساعت | ✅ بله |

---

## 📚 منابع بیشتر

- [PWABuilder Documentation](https://docs.pwabuilder.com/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Cordova Documentation](https://cordova.apache.org/docs/)
- [Tauri Documentation](https://tauri.app/)

---

**موفق باشید! 🚀**

