// Text translation management

class TranslationService {
    constructor() {
        this.currentSourceLang = CONFIG.defaultSource;
        this.currentTargetLang = CONFIG.defaultTarget;
    }

    /**
     * Translate text
     * @param {string} text - Text to translate
     * @param {string} sourceLang - Source language
     * @param {string} targetLang - Target language
     * @returns {Promise<string>} - Translated text
     */
    async translate(text, sourceLang = 'auto', targetLang = null) {
        if (!text || text.trim().length === 0) {
            return '';
        }

        const target = targetLang || this.currentTargetLang;

        // No auto detection - use provided source language directly
        // If source and target languages are the same
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
                // Use free Google Translate as default
                translatedText = await this.fallbackTranslation(text, sourceLang, target);
            }

            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            throw new Error('Error translating text. Please try again.');
        }
    }

    /**
     * Translate using LibreTranslate
     */
    async translateWithLibreTranslate(text, sourceLang, targetLang) {
        try {
            // If sourceLang is 'auto', we should use 'auto'
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
                // If CORS error or other errors occur
                if (response.status === 0 || response.status >= 500) {
                    throw new Error('Error connecting to translation server. Please use an API Key.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.translatedText || text;
        } catch (error) {
            console.error('LibreTranslate error:', error);
            
            // If CORS error, use free Google Translate
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                console.log('Using free Google Translate as fallback...');
                return await this.fallbackTranslation(text, sourceLang, targetLang);
            }
            
            // For other errors, use fallback translation
            return await this.fallbackTranslation(text, sourceLang, targetLang);
        }
    }

    /**
     * Translate using Google Translate API
     */
    async translateWithGoogle(text, sourceLang, targetLang) {
        if (!CONFIG.googleTranslateApiKey) {
            throw new Error('Google Translate API Key is not set');
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
     * Translate using Microsoft Translator API
     */
    async translateWithMicrosoft(text, sourceLang, targetLang) {
        if (!CONFIG.microsoftTranslateKey) {
            throw new Error('Microsoft Translator API Key is not set');
        }

        // First, we need to get a token
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
     * Fallback translation using free Google Translate API (no API Key required)
     */
    async fallbackTranslation(text, sourceLang, targetLang) {
        try {
            // Use MyMemory Translation API as primary method (free and reliable)
            const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
            
            const myMemoryResponse = await fetch(myMemoryUrl);
            
            if (myMemoryResponse.ok) {
                const myMemoryData = await myMemoryResponse.json();
                if (myMemoryData && myMemoryData.responseData && myMemoryData.responseData.translatedText) {
                    const translated = myMemoryData.responseData.translatedText;
                    if (translated && translated.trim() !== text.trim() && translated !== 'MYMEMORY WARNING') {
                        return translated;
                    }
                }
            }
            
            // Fallback to Google Translate API
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extract translated text from response
            // Response format: [[["translated text", "original text", null, null, 0]], null, "en"]
            if (data && Array.isArray(data) && data[0] && Array.isArray(data[0])) {
                let translated = '';
                for (let i = 0; i < data[0].length; i++) {
                    if (data[0][i] && Array.isArray(data[0][i]) && data[0][i][0]) {
                        translated += data[0][i][0];
                    }
                }
                if (translated && translated.trim() !== text.trim()) {
                    return translated;
                }
            }
            
            throw new Error('Invalid response format or translation failed');
        } catch (error) {
            console.error('Fallback translation error:', error);
            // On error, throw to show error message instead of returning original text
            throw new Error('Translation service unavailable. Please check your internet connection.');
        }
    }

    /**
     * Set source language
     */
    setSourceLanguage(lang) {
        this.currentSourceLang = lang;
    }

    /**
     * Set target language
     */
    setTargetLanguage(lang) {
        this.currentTargetLang = lang;
    }

    /**
     * Swap languages
     */
    swapLanguages() {
        const temp = this.currentSourceLang;
        this.currentSourceLang = this.currentTargetLang;
        this.currentTargetLang = temp;
    }
}

// Create global instance
const translationService = new TranslationService();
