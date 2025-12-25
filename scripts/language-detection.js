// تشخیص خودکار زبان متن

class LanguageDetector {
    constructor() {
        // الگوهای زبان‌های مختلف برای تشخیص ساده
        this.patterns = {
            'fa': /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
            'ar': /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
            'zh': /[\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF]/,
            'ja': /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,
            'ko': /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
            'ru': /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/,
            'th': /[\u0E00-\u0E7F]/,
            'he': /[\u0590-\u05FF]/,
            'hi': /[\u0900-\u097F]/,
            'bn': /[\u0980-\u09FF]/
        };

        // کلمات رایج برای تشخیص زبان
        this.commonWords = {
            'en': ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i'],
            'fa': ['و', 'در', 'به', 'از', 'که', 'این', 'است', 'را', 'با', 'برای'],
            'ar': ['في', 'من', 'هو', 'على', 'أن', 'كان', 'هذا', 'من', 'إلى', 'عن'],
            'fr': ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir'],
            'de': ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich'],
            'es': ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se'],
            'it': ['il', 'di', 'che', 'e', 'la', 'a', 'per', 'è', 'in', 'un'],
            'ru': ['и', 'в', 'не', 'что', 'он', 'на', 'я', 'с', 'со', 'как'],
            'zh': ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人'],
            'ja': ['の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し'],
            'ko': ['이', '가', '을', '를', '에', '의', '와', '과', '도', '로'],
            'tr': ['ve', 'bir', 'bu', 'için', 'ile', 'olan', 'olan', 'ki', 'olan', 'olan'],
            'hi': ['की', 'के', 'में', 'है', 'और', 'यह', 'इस', 'को', 'से', 'ने'],
            'pt': ['o', 'de', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com'],
            'nl': ['de', 'het', 'en', 'van', 'een', 'in', 'op', 'is', 'te', 'voor'],
            'pl': ['i', 'w', 'na', 'z', 'do', 'się', 'że', 'o', 'po', 'za'],
            'sv': ['och', 'i', 'att', 'det', 'som', 'på', 'är', 'av', 'för', 'med'],
            'uk': ['і', 'в', 'на', 'з', 'до', 'що', 'як', 'для', 'від', 'про']
        };
    }

    /**
     * تشخیص زبان متن با استفاده از الگوها و کلمات رایج
     * @param {string} text - متن ورودی
     * @returns {string} - کد زبان تشخیص داده شده
     */
    detect(text) {
        if (!text || text.trim().length === 0) {
            return 'auto';
        }

        const cleanText = text.toLowerCase().trim();
        
        // بررسی الگوهای کاراکتری
        for (const [lang, pattern] of Object.entries(this.patterns)) {
            if (pattern.test(text)) {
                return lang;
            }
        }

        // شمارش کلمات رایج
        const wordCounts = {};
        for (const [lang, words] of Object.entries(this.commonWords)) {
            let count = 0;
            for (const word of words) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                if (regex.test(cleanText)) {
                    count++;
                }
            }
            if (count > 0) {
                wordCounts[lang] = count;
            }
        }

        // بازگرداندن زبان با بیشترین تعداد کلمات رایج
        if (Object.keys(wordCounts).length > 0) {
            const detectedLang = Object.keys(wordCounts).reduce((a, b) => 
                wordCounts[a] > wordCounts[b] ? a : b
            );
            return detectedLang;
        }

        // اگر نتوانست تشخیص دهد، از API استفاده می‌کنیم
        return this.detectWithAPI(text);
    }

    /**
     * تشخیص زبان با استفاده از API (در صورت نیاز)
     * @param {string} text - متن ورودی
     * @returns {Promise<string>} - کد زبان
     */
    async detectWithAPI(text) {
        // در اینجا می‌توانید از API های تشخیص زبان استفاده کنید
        // برای مثال: Google Cloud Translation API, Microsoft Translator API
        // فعلاً به صورت پیش‌فرض انگلیسی برمی‌گرداند
        return 'en';
    }

    /**
     * دریافت نام زبان از کد
     * @param {string} langCode - کد زبان
     * @returns {string} - نام زبان
     */
    getLanguageName(langCode) {
        return CONFIG.languages[langCode]?.name || 'نامشخص';
    }

    /**
     * دریافت پرچم زبان از کد
     * @param {string} langCode - کد زبان
     * @returns {string} - emoji پرچم
     */
    getLanguageFlag(langCode) {
        return CONFIG.languages[langCode]?.flag || '🌐';
    }
}

// ایجاد نمونه سراسری
const languageDetector = new LanguageDetector();

