// منطق اصلی برنامه

class TranslationApp {
    constructor() {
        this.currentSourceLang = CONFIG.defaultSource;
        this.currentTargetLang = CONFIG.defaultTarget;
    }

    /**
     * مقداردهی اولیه برنامه
     */
    init() {
        // بارگذاری تنظیمات
        Settings.load();
        
        // تنظیم زبان‌های پیش‌فرض
        this.currentSourceLang = CONFIG.defaultSource;
        this.currentTargetLang = CONFIG.defaultTarget;

        // به‌روزرسانی UI
        uiManager.updateSourceLanguage(this.currentSourceLang);
        uiManager.updateTargetLanguage(this.currentTargetLang);

        // تنظیم رویدادها
        this.setupEventListeners();
        
        console.log('اپلیکیشن ترجمه شناور آماده است!');
    }

    /**
     * تنظیم رویدادهای اصلی
     */
    setupEventListeners() {
        // رویدادهای UI
        uiManager.setupEventListeners();

        // دکمه ترجمه
        uiManager.elements.translateBtn.addEventListener('click', () => {
            this.handleTranslate();
        });

        // دکمه جابجایی زبان‌ها
        uiManager.elements.swapBtn.addEventListener('click', () => {
            this.handleSwapLanguages();
        });

        // تشخیص خودکار زبان هنگام تغییر متن
        uiManager.elements.sourceText.addEventListener('input', () => {
            this.handleAutoDetect();
        });
    }

    /**
     * مدیریت ترجمه
     */
    async handleTranslate() {
        const sourceText = uiManager.getSourceText();
        
        if (!sourceText) {
            uiManager.showStatus('لطفاً متنی برای ترجمه وارد کنید', 'error');
            return;
        }

        uiManager.showLoading();

        try {
            // اگر زبان منبع auto است، ابتدا تشخیص می‌دهیم
            let detectedLang = this.currentSourceLang;
            if (detectedLang === 'auto') {
                detectedLang = languageDetector.detect(sourceText);
                this.currentSourceLang = detectedLang;
                translationService.setSourceLanguage(detectedLang);
                uiManager.updateSourceLanguage(detectedLang);
            }

            // ترجمه
            const translatedText = await translationService.translate(
                sourceText,
                detectedLang,
                this.currentTargetLang
            );

            // نمایش نتیجه
            uiManager.displayTranslation(translatedText);
            uiManager.showStatus('ترجمه با موفقیت انجام شد!', 'success');

            // ذخیره در تاریخچه (اگر فعال باشد)
            if (CONFIG.saveHistory) {
                this.saveToHistory(sourceText, translatedText, detectedLang, this.currentTargetLang);
            }
        } catch (error) {
            console.error('خطا در ترجمه:', error);
            uiManager.showStatus(error.message || 'خطا در ترجمه متن', 'error');
            uiManager.displayTranslation('');
        } finally {
            uiManager.hideLoading();
        }
    }

    /**
     * تشخیص خودکار زبان
     */
    handleAutoDetect() {
        const sourceText = uiManager.getSourceText();
        
        if (!sourceText || sourceText.trim().length === 0) {
            // اگر متن خالی است و زبان منبع auto نیست، به auto برمی‌گردیم
            if (this.currentSourceLang !== 'auto') {
                // فقط اگر کاربر به صورت دستی زبان را تغییر نداده باشد
                // اینجا می‌توانید منطق خود را اضافه کنید
            }
            return;
        }

        // اگر زبان منبع auto است، زبان را تشخیص می‌دهیم
        if (this.currentSourceLang === 'auto') {
            const detectedLang = languageDetector.detect(sourceText);
            this.currentSourceLang = detectedLang; // به‌روزرسانی زبان منبع
            translationService.setSourceLanguage(detectedLang);
            uiManager.updateSourceLanguage(detectedLang); // نمایش در کادر منبع (نه کادر هدف)
        }
    }

    /**
     * تنظیم زبان منبع
     */
    setSourceLanguage(langCode) {
        this.currentSourceLang = langCode;
        translationService.setSourceLanguage(langCode);
        uiManager.updateSourceLanguage(langCode);
        uiManager.showStatus(`زبان منبع به ${CONFIG.languages[langCode]?.name || langCode} تغییر کرد`, 'success');
    }

    /**
     * تنظیم زبان هدف
     */
    setTargetLanguage(langCode) {
        this.currentTargetLang = langCode;
        translationService.setTargetLanguage(langCode);
        uiManager.updateTargetLanguage(langCode);
        uiManager.showStatus(`زبان هدف به ${CONFIG.languages[langCode]?.name || langCode} تغییر کرد`, 'success');
    }

    /**
     * جابجایی زبان‌ها
     */
    handleSwapLanguages() {
        // جابجایی در سرویس ترجمه
        translationService.swapLanguages();
        
        // جابجایی در برنامه
        const temp = this.currentSourceLang;
        this.currentSourceLang = this.currentTargetLang;
        this.currentTargetLang = temp;

        // جابجایی متن‌ها
        const sourceText = uiManager.getSourceText();
        const targetText = uiManager.elements.targetText.textContent;
        
        uiManager.elements.sourceText.value = targetText.includes('ترجمه اینجا') ? '' : targetText;
        uiManager.displayTranslation(sourceText);

        // به‌روزرسانی UI
        uiManager.updateSourceLanguage(this.currentSourceLang);
        uiManager.updateTargetLanguage(this.currentTargetLang);

        uiManager.showStatus('زبان‌ها جابجا شدند', 'success');
    }

    /**
     * ذخیره در تاریخچه
     */
    saveToHistory(sourceText, translatedText, sourceLang, targetLang) {
        try {
            let history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
            
            history.unshift({
                source: sourceText,
                translated: translatedText,
                sourceLang: sourceLang,
                targetLang: targetLang,
                timestamp: new Date().toISOString()
            });

            // محدود کردن تعداد آیتم‌ها
            if (history.length > CONFIG.maxHistoryItems) {
                history = history.slice(0, CONFIG.maxHistoryItems);
            }

            localStorage.setItem('translationHistory', JSON.stringify(history));
        } catch (error) {
            console.error('خطا در ذخیره تاریخچه:', error);
        }
    }

    /**
     * دریافت تاریخچه
     */
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('translationHistory') || '[]');
        } catch (error) {
            console.error('خطا در دریافت تاریخچه:', error);
            return [];
        }
    }

    /**
     * پاک کردن تاریخچه
     */
    clearHistory() {
        localStorage.removeItem('translationHistory');
    }
}

// ایجاد نمونه برنامه
const app = new TranslationApp();

// راه‌اندازی برنامه هنگام لود شدن صفحه
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

