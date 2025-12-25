// تنظیمات و پیکربندی برنامه

const CONFIG = {
    // زبان‌های پشتیبانی شده با کد ISO و پرچم
    languages: {
        'auto': { name: 'تشخیص خودکار', flag: '🌐', code: 'auto' },
        'en': { name: 'انگلیسی', flag: '🇬🇧', code: 'en' },
        'fa': { name: 'فارسی', flag: '🇮🇷', code: 'fa' },
        'ar': { name: 'عربی', flag: '🇸🇦', code: 'ar' },
        'fr': { name: 'فرانسوی', flag: '🇫🇷', code: 'fr' },
        'de': { name: 'آلمانی', flag: '🇩🇪', code: 'de' },
        'es': { name: 'اسپانیایی', flag: '🇪🇸', code: 'es' },
        'it': { name: 'ایتالیایی', flag: '🇮🇹', code: 'it' },
        'ru': { name: 'روسی', flag: '🇷🇺', code: 'ru' },
        'zh': { name: 'چینی', flag: '🇨🇳', code: 'zh' },
        'ja': { name: 'ژاپنی', flag: '🇯🇵', code: 'ja' },
        'ko': { name: 'کره‌ای', flag: '🇰🇷', code: 'ko' },
        'tr': { name: 'ترکی', flag: '🇹🇷', code: 'tr' },
        'hi': { name: 'هندی', flag: '🇮🇳', code: 'hi' },
        'pt': { name: 'پرتغالی', flag: '🇵🇹', code: 'pt' },
        'nl': { name: 'هلندی', flag: '🇳🇱', code: 'nl' },
        'pl': { name: 'لهستانی', flag: '🇵🇱', code: 'pl' },
        'sv': { name: 'سوئدی', flag: '🇸🇪', code: 'sv' },
        'uk': { name: 'اوکراینی', flag: '🇺🇦', code: 'uk' }
    },

    // زبان پیش‌فرض منبع و هدف
    defaultSource: 'auto',
    defaultTarget: 'fr',

    // استفاده از API ترجمه
    // گزینه 1: استفاده از LibreTranslate (رایگان و Open Source)
    useLibreTranslate: true,
    libreTranslateUrl: 'https://libretranslate.com/translate', // یا سرور محلی خودتان

    // گزینه 2: استفاده از Google Translate (نیاز به API Key)
    useGoogleTranslate: false,
    googleTranslateApiKey: '', // API Key خود را اینجا قرار دهید

    // گزینه 3: استفاده از Microsoft Translator (نیاز به API Key)
    useMicrosoftTranslate: false,
    microsoftTranslateKey: '', // API Key خود را اینجا قرار دهید
    microsoftTranslateRegion: 'global',

    // تنظیمات UI
    autoTranslate: false, // ترجمه خودکار هنگام تایپ
    autoTranslateDelay: 500, // تاخیر برای ترجمه خودکار (میلی‌ثانیه)
    saveHistory: true, // ذخیره تاریخچه ترجمه‌ها
    maxHistoryItems: 50 // حداکثر تعداد آیتم‌های تاریخچه
};

// ذخیره و بارگذاری تنظیمات از LocalStorage
const Settings = {
    save: function() {
        const settings = {
            sourceLanguage: CONFIG.defaultSource,
            targetLanguage: CONFIG.defaultTarget,
            autoTranslate: CONFIG.autoTranslate
        };
        localStorage.setItem('translationSettings', JSON.stringify(settings));
    },

    load: function() {
        const saved = localStorage.getItem('translationSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                CONFIG.defaultSource = settings.sourceLanguage || CONFIG.defaultSource;
                CONFIG.defaultTarget = settings.targetLanguage || CONFIG.defaultTarget;
                CONFIG.autoTranslate = settings.autoTranslate || CONFIG.autoTranslate;
            } catch (e) {
                console.error('خطا در بارگذاری تنظیمات:', e);
            }
        }
    }
};

// بارگذاری تنظیمات هنگام لود شدن
Settings.load();

