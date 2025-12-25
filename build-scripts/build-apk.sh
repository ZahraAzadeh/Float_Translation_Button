#!/bin/bash

# اسکریپت ساخت APK با Capacitor

echo "🔨 شروع ساخت APK..."

# بررسی وجود پوشه android
if [ ! -d "android" ]; then
    echo "❌ پوشه android یافت نشد. ابتدا Capacitor را راه‌اندازی کنید:"
    echo "   ./build-scripts/setup-capacitor.sh"
    exit 1
fi

# کپی فایل‌های جدید
echo "📋 کپی فایل‌های جدید..."
npx cap copy

# Sync با پلتفرم
echo "🔄 همگام‌سازی با پلتفرم..."
npx cap sync android

echo "✅ آماده برای Build!"
echo ""
echo "برای ساخت APK:"
echo "1. Android Studio را باز کنید:"
echo "   npx cap open android"
echo ""
echo "2. در Android Studio:"
echo "   Build > Generate Signed Bundle / APK"
echo "   APK را انتخاب کنید"
echo "   Key Store ایجاد کنید (یا از قبل موجود)"
echo "   Build را بزنید"
echo ""
echo "3. فایل APK در این مسیر قرار دارد:"
echo "   android/app/build/outputs/apk/"

