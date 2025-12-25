// مدیریت رابط کاربری

class UIManager {
    constructor() {
        this.elements = {
            floatingBtn: document.getElementById('floatingBtn'),
            translationPanel: document.getElementById('translationPanel'),
            closeBtn: document.getElementById('closeBtn'),
            swapBtn: document.getElementById('swapBtn'),
            sourceText: document.getElementById('sourceText'),
            targetText: document.getElementById('targetText'),
            sourceFlag: document.getElementById('sourceFlag'),
            targetFlag: document.getElementById('targetFlag'),
            sourceLanguage: document.getElementById('sourceLanguage'),
            targetLanguage: document.getElementById('targetLanguage'),
            translateBtn: document.getElementById('translateBtn'),
            copyBtn: document.getElementById('copyBtn'),
            statusMessage: document.getElementById('statusMessage'),
            selectSourceLangBtn: document.getElementById('selectSourceLangBtn'),
            selectTargetLangBtn: document.getElementById('selectTargetLangBtn'),
            languageSelector: document.getElementById('languageSelector')
        };
        
        this.currentSelectorType = null; // 'source' or 'target'

        this.isPanelOpen = false;
        this.autoTranslateTimeout = null;
    }

    /**
     * باز کردن پنل ترجمه
     */
    openPanel() {
        this.elements.translationPanel.classList.remove('hidden');
        this.elements.floatingBtn.classList.add('hidden');
        this.isPanelOpen = true;
        this.elements.sourceText.focus();
    }

    /**
     * بستن پنل ترجمه
     */
    closePanel() {
        this.elements.translationPanel.classList.add('hidden');
        this.elements.floatingBtn.classList.remove('hidden');
        this.isPanelOpen = false;
        this.clearStatus();
    }

    /**
     * به‌روزرسانی پرچم و نام زبان منبع
     */
    updateSourceLanguage(langCode) {
        const lang = CONFIG.languages[langCode];
        if (lang) {
            this.elements.sourceFlag.querySelector('.flag-emoji').textContent = lang.flag;
            this.elements.sourceLanguage.textContent = lang.name;
        }
    }

    /**
     * به‌روزرسانی پرچم و نام زبان هدف
     */
    updateTargetLanguage(langCode) {
        const lang = CONFIG.languages[langCode];
        if (lang) {
            this.elements.targetFlag.querySelector('.flag-emoji').textContent = lang.flag;
            this.elements.targetLanguage.textContent = lang.name;
        }
    }

    /**
     * نمایش متن ترجمه شده
     */
    displayTranslation(text) {
        if (text && text.trim()) {
            this.elements.targetText.innerHTML = '';
            this.elements.targetText.textContent = text;
            this.elements.targetText.classList.remove('placeholder-text');
        } else {
            this.elements.targetText.innerHTML = '<span class="placeholder-text">ترجمه اینجا نمایش داده می‌شود...</span>';
        }
    }

    /**
     * نمایش وضعیت (Loading, Success, Error)
     */
    showStatus(message, type = 'success') {
        this.elements.statusMessage.textContent = message;
        this.elements.statusMessage.className = `status-message ${type}`;
        this.elements.statusMessage.classList.remove('hidden');

        if (type !== 'loading') {
            setTimeout(() => {
                this.clearStatus();
            }, 3000);
        }
    }

    /**
     * پاک کردن پیام وضعیت
     */
    clearStatus() {
        this.elements.statusMessage.classList.add('hidden');
        this.elements.statusMessage.className = 'status-message hidden';
    }

    /**
     * نمایش حالت Loading
     */
    showLoading() {
        this.elements.translateBtn.disabled = true;
        this.elements.translateBtn.innerHTML = '<span>در حال ترجمه...</span>';
        this.showStatus('در حال ترجمه...', 'loading');
    }

    /**
     * پنهان کردن حالت Loading
     */
    hideLoading() {
        this.elements.translateBtn.disabled = false;
        this.elements.translateBtn.innerHTML = '<span>ترجمه</span>';
    }

    /**
     * کپی کردن متن ترجمه شده
     */
    async copyTranslation() {
        const text = this.elements.targetText.textContent;
        if (!text || text.includes('ترجمه اینجا')) {
            this.showStatus('متن ترجمه‌ای برای کپی وجود ندارد', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showStatus('متن با موفقیت کپی شد!', 'success');
            
            // تغییر موقت آیکون کپی
            const originalHTML = this.elements.copyBtn.innerHTML;
            this.elements.copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>';
            
            setTimeout(() => {
                this.elements.copyBtn.innerHTML = originalHTML;
            }, 2000);
        } catch (error) {
            console.error('خطا در کپی:', error);
            this.showStatus('خطا در کپی کردن متن', 'error');
        }
    }

    /**
     * دریافت متن منبع
     */
    getSourceText() {
        return this.elements.sourceText.value.trim();
    }

    /**
     * پاک کردن متن منبع
     */
    clearSourceText() {
        this.elements.sourceText.value = '';
        this.elements.targetText.innerHTML = '<span class="placeholder-text">ترجمه اینجا نمایش داده می‌شود...</span>';
    }

    /**
     * نمایش منوی انتخاب زبان
     */
    showLanguageSelector(type, currentLang, buttonElement) {
        this.currentSelectorType = type;
        const selector = this.elements.languageSelector;
        selector.innerHTML = '';
        
        // موقعیت منو را تنظیم می‌کنیم
        const rect = buttonElement.getBoundingClientRect();
        selector.style.top = (rect.bottom + 5) + 'px';
        selector.style.left = (rect.left - 100) + 'px';
        
        // ایجاد لیست زبان‌ها
        Object.entries(CONFIG.languages).forEach(([code, lang]) => {
            // برای زبان منبع، 'auto' را هم نشان می‌دهیم
            if (type === 'source' || code !== 'auto') {
                const option = document.createElement('div');
                option.className = 'language-option';
                if (code === currentLang) {
                    option.classList.add('selected');
                }
                
                option.innerHTML = `
                    <span class="language-option-flag">${lang.flag}</span>
                    <span class="language-option-name">${lang.name}</span>
                `;
                
                option.addEventListener('click', () => {
                    this.selectLanguage(type, code);
                    this.hideLanguageSelector();
                });
                
                selector.appendChild(option);
            }
        });
        
        selector.classList.add('show');
    }
    
    /**
     * پنهان کردن منوی انتخاب زبان
     */
    hideLanguageSelector() {
        this.elements.languageSelector.classList.remove('show');
        this.currentSelectorType = null;
    }
    
    /**
     * انتخاب زبان
     */
    selectLanguage(type, langCode) {
        if (type === 'source') {
            app.setSourceLanguage(langCode);
        } else {
            app.setTargetLanguage(langCode);
        }
    }

    /**
     * تنظیم رویدادهای UI
     */
    setupEventListeners() {
        // باز کردن پنل
        this.elements.floatingBtn.addEventListener('click', () => {
            this.openPanel();
        });

        // بستن پنل
        this.elements.closeBtn.addEventListener('click', () => {
            this.closePanel();
        });

        // بستن با کلیک خارج از پنل
        document.addEventListener('click', (e) => {
            if (this.isPanelOpen && 
                !this.elements.translationPanel.contains(e.target) && 
                !this.elements.floatingBtn.contains(e.target)) {
                // این قابلیت را می‌توانید فعال کنید اگر می‌خواهید
                // this.closePanel();
            }
            
            // بستن منوی انتخاب زبان
            if (!this.elements.languageSelector.contains(e.target) && 
                !this.elements.selectSourceLangBtn.contains(e.target) &&
                !this.elements.selectTargetLangBtn.contains(e.target)) {
                this.hideLanguageSelector();
            }
        });

        // انتخاب زبان منبع
        this.elements.selectSourceLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentLang = app.currentSourceLang;
            this.showLanguageSelector('source', currentLang, this.elements.selectSourceLangBtn);
        });

        // انتخاب زبان هدف
        this.elements.selectTargetLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentLang = app.currentTargetLang;
            this.showLanguageSelector('target', currentLang, this.elements.selectTargetLangBtn);
        });

        // کپی کردن
        this.elements.copyBtn.addEventListener('click', () => {
            this.copyTranslation();
        });

        // ترجمه خودکار هنگام تایپ (اگر فعال باشد)
        if (CONFIG.autoTranslate) {
            this.elements.sourceText.addEventListener('input', () => {
                clearTimeout(this.autoTranslateTimeout);
                this.autoTranslateTimeout = setTimeout(() => {
                    if (this.getSourceText()) {
                        app.handleTranslate();
                    }
                }, CONFIG.autoTranslateDelay);
            });
        }

        // ترجمه با Enter + Ctrl
        this.elements.sourceText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                app.handleTranslate();
            }
        });
    }
}

// ایجاد نمونه سراسری
const uiManager = new UIManager();

