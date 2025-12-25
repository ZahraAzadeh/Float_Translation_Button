// Main application logic

class TranslationApp {
    constructor() {
        this.currentSourceLang = CONFIG.defaultSource;
        this.currentTargetLang = CONFIG.defaultTarget;
    }

    /**
     * Initialize the application
     */
    init() {
        // Load settings
        Settings.load();
        
        // Set default languages
        this.currentSourceLang = CONFIG.defaultSource;
        this.currentTargetLang = CONFIG.defaultTarget;

        // Update UI
        uiManager.updateSourceLanguage(this.currentSourceLang);
        uiManager.updateTargetLanguage(this.currentTargetLang);

        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Floating Translation App is ready!');
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        // UI event listeners
        uiManager.setupEventListeners();

        // Translation icon button
        uiManager.elements.translateIconBtn.addEventListener('click', () => {
            this.handleTranslate();
        });
        
        // Translate with Enter
        uiManager.elements.sourceText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleTranslate();
            }
        });

        // Swap languages button
        uiManager.elements.swapBtn.addEventListener('click', () => {
            this.handleSwapLanguages();
        });

        // Auto detect disabled - user must select source language manually
    }

    /**
     * Handle translation
     */
    async handleTranslate() {
        const sourceText = uiManager.getSourceText();
        
        if (!sourceText) {
            uiManager.showStatus('Please enter text to translate', 'error');
            return;
        }

        uiManager.showLoading();

        try {
            // Use selected source language (no auto detection)
            const sourceLang = this.currentSourceLang;

            // Translate
            const translatedText = await translationService.translate(
                sourceText,
                sourceLang,
                this.currentTargetLang
            );

            // Display result
            uiManager.displayTranslation(translatedText);
            uiManager.showStatus('Translation completed successfully!', 'success');

            // Save to history (if enabled)
            if (CONFIG.saveHistory) {
                this.saveToHistory(sourceText, translatedText, sourceLang, this.currentTargetLang);
            }
        } catch (error) {
            console.error('Translation error:', error);
            uiManager.showStatus(error.message || 'Error translating text', 'error');
            uiManager.displayTranslation('');
        } finally {
            uiManager.hideLoading();
        }
    }

    /**
     * Auto detect language
     */
    handleAutoDetect() {
        // Auto detection disabled - user must manually select source language
        return;
    }

    /**
     * Set source language
     */
    setSourceLanguage(langCode) {
        this.currentSourceLang = langCode;
        translationService.setSourceLanguage(langCode);
        uiManager.updateSourceLanguage(langCode);
        uiManager.showStatus(`Source language changed to ${CONFIG.languages[langCode]?.name || langCode}`, 'success');
    }

    /**
     * Set target language
     */
    setTargetLanguage(langCode) {
        this.currentTargetLang = langCode;
        translationService.setTargetLanguage(langCode);
        uiManager.updateTargetLanguage(langCode);
        uiManager.showStatus(`Target language changed to ${CONFIG.languages[langCode]?.name || langCode}`, 'success');
        
        // If source text exists, retranslate
        const sourceText = uiManager.getSourceText();
        if (sourceText && sourceText.trim().length > 0) {
            // Retranslate with new language
            setTimeout(() => {
                this.handleTranslate();
            }, 300);
        }
    }

    /**
     * Swap languages
     */
    handleSwapLanguages() {
        // Swap in translation service
        translationService.swapLanguages();
        
        // Swap in application
        const temp = this.currentSourceLang;
        this.currentSourceLang = this.currentTargetLang;
        this.currentTargetLang = temp;

        // Swap texts
        const sourceText = uiManager.getSourceText();
        const targetText = uiManager.elements.targetText.textContent;
        
        uiManager.elements.sourceText.value = targetText.includes('Translation will appear here') ? '' : targetText;
        uiManager.displayTranslation(sourceText);

        // Update UI
        uiManager.updateSourceLanguage(this.currentSourceLang);
        uiManager.updateTargetLanguage(this.currentTargetLang);

        uiManager.showStatus('Languages swapped', 'success');
    }

    /**
     * Save to history
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

            // Limit number of items
            if (history.length > CONFIG.maxHistoryItems) {
                history = history.slice(0, CONFIG.maxHistoryItems);
            }

            localStorage.setItem('translationHistory', JSON.stringify(history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    /**
     * Get history
     */
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('translationHistory') || '[]');
        } catch (error) {
            console.error('Error getting history:', error);
            return [];
        }
    }

    /**
     * Clear history
     */
    clearHistory() {
        localStorage.removeItem('translationHistory');
    }
}

// Create application instance
const app = new TranslationApp();

// Initialize application on page load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
