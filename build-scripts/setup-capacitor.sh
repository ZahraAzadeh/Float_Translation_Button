#!/bin/bash

# اسکریپت راه‌اندازی Capacitor برای ساخت APK/IPA

echo "🚀 راه‌اندازی Capacitor..."

# بررسی نصب Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js نصب نشده است. لطفاً Node.js را نصب کنید."
    exit 1
fi

# بررسی نصب npm
if ! command -v npm &> /dev/null
then
    echo "❌ npm نصب نشده است."
    exit 1
fi

# نصب Capacitor CLI
echo "📦 نصب Capacitor CLI..."
npm install -g @capacitor/cli

# راه‌اندازی Capacitor
echo "🔧 راه‌اندازی پروژه Capacitor..."
npx cap init

# اضافه کردن Android
echo "🤖 اضافه کردن پلتفرم Android..."
npx cap add android

# اضافه کردن iOS (فقط macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 اضافه کردن پلتفرم iOS..."
    npx cap add ios
fi

# کپی فایل‌ها
echo "📋 کپی فایل‌ها..."
npx cap copy

echo "✅ راه‌اندازی کامل شد!"
echo ""
echo "برای باز کردن در Android Studio:"
echo "  npx cap open android"
echo ""
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "برای باز کردن در Xcode:"
    echo "  npx cap open ios"
fi

