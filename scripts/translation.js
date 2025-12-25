// مدیریت ترجمه متن

class TranslationService {
    constructor() {
        this.currentSourceLang = CONFIG.defaultSource;
        this.currentTargetLang = CONFIG.defaultTarget;
    }

    /**
     * ترجمه متن
     * @param {string} text - متن برای ترجمه
     * @param {string} sourceLang - زبان منبع
     * @param {string} targetLang - زبان هدف
     * @returns {Promise<string>} - متن ترجمه شده
     */
    async translate(text, sourceLang = 'auto', targetLang = null) {
        if (!text || text.trim().length === 0) {
            return '';
        }

        const target = targetLang || this.currentTargetLang;

        // اگر زبان منبع auto است، ابتدا زبان را تشخیص می‌دهیم
        if (sourceLang === 'auto') {
            sourceLang = languageDetector.detect(text);
        }

        // اگر زبان منبع و هدف یکسان باشند
        if (sourceLang === target) {
            return text;
        }

        try {
            let translatedText = '';

            if (CONFIG.useLibreTranslate) {
                translatedText = await this.translateWithLibreTranslate(text, sourceLang, target);
            } else if (CONFIG.useGoogleTranslate) {
                translatedText = await this.translateWithGoogle(text, sourceLang, target);
            } else if (CONFIG.useMicrosoftTranslate) {
                translatedText = await this.translateWithMicrosoft(text, sourceLang, target);
            } else {
                // استفاده از LibreTranslate به صورت پیش‌فرض
                translatedText = await this.translateWithLibreTranslate(text, sourceLang, target);
            }

            return translatedText;
        } catch (error) {
            console.error('خطا در ترجمه:', error);
            throw new Error('خطا در ترجمه متن. لطفاً دوباره تلاش کنید.');
        }
    }

    /**
     * ترجمه با استفاده از LibreTranslate
     */
    async translateWithLibreTranslate(text, sourceLang, targetLang) {
        try {
            // اگر sourceLang 'auto' است، باید از 'auto' استفاده کنیم
            const source = sourceLang === 'auto' ? 'auto' : sourceLang;
            
            const response = await fetch(CONFIG.libreTranslateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: source,
                    target: targetLang,
                    format: 'text'
                })
            });

            if (!response.ok) {
                // اگر خطای CORS یا دیگر خطاها رخ داد
                if (response.status === 0 || response.status >= 500) {
                    throw new Error('خطا در اتصال به سرور ترجمه. لطفاً از API Key استفاده کنید.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.translatedText || text;
        } catch (error) {
            console.error('خطا در LibreTranslate:', error);
            
            // اگر خطای CORS باشد، راهنمایی به کاربر
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                throw new Error('برای استفاده از LibreTranslate، نیاز به سرور با CORS فعال است. لطفاً از Google Translate API یا Microsoft Translator استفاده کنید.');
            }
            
            // در صورت خطا، از ترجمه ساده استفاده می‌کنیم
            return this.fallbackTranslation(text, sourceLang, targetLang);
        }
    }

    /**
     * ترجمه با استفاده از Google Translate API
     */
    async translateWithGoogle(text, sourceLang, targetLang) {
        if (!CONFIG.googleTranslateApiKey) {
            throw new Error('Google Translate API Key تنظیم نشده است');
        }

        const url = `https://translation.googleapis.com/language/translate/v2?key=${CONFIG.googleTranslateApiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.translations[0].translatedText;
    }

    /**
     * ترجمه با استفاده از Microsoft Translator API
     */
    async translateWithMicrosoft(text, sourceLang, targetLang) {
        if (!CONFIG.microsoftTranslateKey) {
            throw new Error('Microsoft Translator API Key تنظیم نشده است');
        }

        // ابتدا باید token دریافت کنیم
        const tokenResponse = await fetch(
            `https://${CONFIG.microsoftTranslateRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
            {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': CONFIG.microsoftTranslateKey
                }
            }
        );

        const token = await tokenResponse.text();

        const translateUrl = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLang}&to=${targetLang}`;
        
        const response = await fetch(translateUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ Text: text }])
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data[0].translations[0].text;
    }

    /**
     * ترجمه ساده به عنوان جایگزین (Fallback)
     */
    fallbackTranslation(text, sourceLang, targetLang) {
        // این یک ترجمه ساده است که فقط برای نمایش استفاده می‌شود
        // در واقعیت باید از یک API واقعی استفاده کنید
        return `[ترجمه: ${text}]`;
    }

    /**
     * تنظیم زبان منبع
     */
    setSourceLanguage(lang) {
        this.currentSourceLang = lang;
    }

    /**
     * تنظیم زبان هدف
     */
    setTargetLanguage(lang) {
        this.currentTargetLang = lang;
    }

    /**
     * جابجایی زبان‌ها
     */
    swapLanguages() {
        const temp = this.currentSourceLang;
        this.currentSourceLang = this.currentTargetLang;
        this.currentTargetLang = temp;
    }
}

// ایجاد نمونه سراسری
const translationService = new TranslationService();

