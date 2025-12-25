@echo off
REM اسکریپت راه‌اندازی Capacitor برای Windows

echo 🚀 راه‌اندازی Capacitor...

REM بررسی نصب Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js نصب نشده است. لطفاً Node.js را نصب کنید.
    exit /b 1
)

REM بررسی نصب npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm نصب نشده است.
    exit /b 1
)

REM نصب Capacitor CLI
echo 📦 نصب Capacitor CLI...
call npm install -g @capacitor/cli

REM راه‌اندازی Capacitor
echo 🔧 راه‌اندازی پروژه Capacitor...
call npx cap init

REM اضافه کردن Android
echo 🤖 اضافه کردن پلتفرم Android...
call npx cap add android

REM کپی فایل‌ها
echo 📋 کپی فایل‌ها...
call npx cap copy

echo ✅ راه‌اندازی کامل شد!
echo.
echo برای باز کردن در Android Studio:
echo   npx cap open android

pause

