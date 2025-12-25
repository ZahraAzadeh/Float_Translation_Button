// User interface management

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
            translateIconBtn: document.getElementById('translateIconBtn'),
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
     * Open translation panel
     */
    openPanel() {
        this.elements.translationPanel.classList.remove('hidden');
        this.elements.floatingBtn.classList.add('hidden');
        this.isPanelOpen = true;
        this.elements.sourceText.focus();
    }

    /**
     * Close translation panel
     */
    closePanel() {
        this.elements.translationPanel.classList.add('hidden');
        this.elements.floatingBtn.classList.remove('hidden');
        this.isPanelOpen = false;
        this.clearStatus();
    }

    /**
     * Update source language flag and name
     */
    updateSourceLanguage(langCode) {
        const lang = CONFIG.languages[langCode];
        if (lang) {
            this.elements.sourceFlag.querySelector('.flag-emoji').textContent = lang.flag;
            this.elements.sourceLanguage.textContent = lang.name;
        }
    }

    /**
     * Update target language flag and name
     */
    updateTargetLanguage(langCode) {
        const lang = CONFIG.languages[langCode];
        if (lang) {
            this.elements.targetFlag.querySelector('.flag-emoji').textContent = lang.flag;
            this.elements.targetLanguage.textContent = lang.name;
        }
    }

    /**
     * Display translated text
     */
    displayTranslation(text) {
        if (text && text.trim()) {
            this.elements.targetText.innerHTML = '';
            this.elements.targetText.textContent = text;
            this.elements.targetText.classList.remove('placeholder-text');
        } else {
            this.elements.targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
        }
    }

    /**
     * Show status message (Loading, Success, Error)
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
     * Clear status message
     */
    clearStatus() {
        this.elements.statusMessage.classList.add('hidden');
        this.elements.statusMessage.className = 'status-message hidden';
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.elements.translateIconBtn) {
            this.elements.translateIconBtn.disabled = true;
        }
        this.showStatus('Translating...', 'loading');
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.elements.translateIconBtn) {
            this.elements.translateIconBtn.disabled = false;
        }
    }

    /**
     * Copy translated text
     */
    async copyTranslation() {
        const text = this.elements.targetText.textContent;
        if (!text || text.includes('Translation will appear here')) {
            this.showStatus('No translation text to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showStatus('Text copied successfully!', 'success');
            
            // Temporarily change copy icon
            const originalHTML = this.elements.copyBtn.innerHTML;
            this.elements.copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>';
            
            setTimeout(() => {
                this.elements.copyBtn.innerHTML = originalHTML;
            }, 2000);
        } catch (error) {
            console.error('Copy error:', error);
            this.showStatus('Error copying text', 'error');
        }
    }

    /**
     * Get source text
     */
    getSourceText() {
        return this.elements.sourceText.value.trim();
    }

    /**
     * Clear source text
     */
    clearSourceText() {
        this.elements.sourceText.value = '';
        this.elements.targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
    }

    /**
     * Show language selector menu
     */
    showLanguageSelector(type, currentLang, buttonElement) {
        // If another menu is open, close it
        if (this.elements.languageSelector.classList.contains('show')) {
            this.hideLanguageSelector();
            // If it's the same button, just close
            if (this.currentSelectorType === type) {
                return;
            }
        }
        
        this.currentSelectorType = type;
        const selector = this.elements.languageSelector;
        selector.innerHTML = '';
        
        // Calculate menu position (better for RTL)
        const rect = buttonElement.getBoundingClientRect();
        const panelRect = this.elements.translationPanel.getBoundingClientRect();
        
        // Calculate better position
        let top = rect.bottom - panelRect.top + 5;
        let left = rect.left - panelRect.left - 150; // For RTL
        
        // If it goes off the right side, show from the left
        if (left < 10) {
            left = rect.right - panelRect.left + 5;
        }
        
        selector.style.top = top + 'px';
        selector.style.left = left + 'px';
        
        // Create language list
        Object.entries(CONFIG.languages).forEach(([code, lang]) => {
            // For source language, show 'auto' too
            // For target language, don't show 'auto'
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
                
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectLanguage(type, code);
                    this.hideLanguageSelector();
                });
                
                selector.appendChild(option);
            }
        });
        
        selector.classList.add('show');
    }
    
    /**
     * Hide language selector menu
     */
    hideLanguageSelector() {
        this.elements.languageSelector.classList.remove('show');
        this.currentSelectorType = null;
    }
    
    /**
     * Select language
     */
    selectLanguage(type, langCode) {
        if (type === 'source') {
            app.setSourceLanguage(langCode);
        } else {
            app.setTargetLanguage(langCode);
        }
    }

    /**
     * Setup UI event listeners
     */
    setupEventListeners() {
        // Open panel
        this.elements.floatingBtn.addEventListener('click', () => {
            this.openPanel();
        });

        // Close panel
        this.elements.closeBtn.addEventListener('click', () => {
            this.closePanel();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isPanelOpen && 
                !this.elements.translationPanel.contains(e.target) && 
                !this.elements.floatingBtn.contains(e.target)) {
                // You can enable this feature if you want
                // this.closePanel();
            }
            
            // Close language selector
            if (!this.elements.languageSelector.contains(e.target) && 
                !this.elements.selectSourceLangBtn.contains(e.target) &&
                !this.elements.selectTargetLangBtn.contains(e.target)) {
                this.hideLanguageSelector();
            }
        });

        // Select source language
        this.elements.selectSourceLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentLang = app.currentSourceLang;
            this.showLanguageSelector('source', currentLang, this.elements.selectSourceLangBtn);
        });

        // Select target language
        this.elements.selectTargetLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentLang = app.currentTargetLang;
            this.showLanguageSelector('target', currentLang, this.elements.selectTargetLangBtn);
        });

        // Copy
        this.elements.copyBtn.addEventListener('click', () => {
            this.copyTranslation();
        });

        // Auto translate while typing (if enabled)
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

        // Translate with Ctrl + Enter
        this.elements.sourceText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                app.handleTranslate();
            }
        });
    }
}

// Create global instance
const uiManager = new UIManager();
