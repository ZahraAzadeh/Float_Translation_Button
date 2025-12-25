// Application configuration and settings

const CONFIG = {
    // Supported languages with ISO codes and flags
    languages: {
        'auto': { name: 'Auto Detect', flag: '🌐', code: 'auto' },
        'en': { name: 'English', flag: '🇬🇧', code: 'en' },
        'fa': { name: 'Persian', flag: '🇮🇷', code: 'fa' },
        'ar': { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
        'fr': { name: 'French', flag: '🇫🇷', code: 'fr' },
        'de': { name: 'German', flag: '🇩🇪', code: 'de' },
        'es': { name: 'Spanish', flag: '🇪🇸', code: 'es' },
        'it': { name: 'Italian', flag: '🇮🇹', code: 'it' },
        'ru': { name: 'Russian', flag: '🇷🇺', code: 'ru' },
        'zh': { name: 'Chinese', flag: '🇨🇳', code: 'zh' },
        'ja': { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
        'ko': { name: 'Korean', flag: '🇰🇷', code: 'ko' },
        'tr': { name: 'Turkish', flag: '🇹🇷', code: 'tr' },
        'hi': { name: 'Hindi', flag: '🇮🇳', code: 'hi' },
        'pt': { name: 'Portuguese', flag: '🇵🇹', code: 'pt' },
        'nl': { name: 'Dutch', flag: '🇳🇱', code: 'nl' },
        'pl': { name: 'Polish', flag: '🇵🇱', code: 'pl' },
        'sv': { name: 'Swedish', flag: '🇸🇪', code: 'sv' },
        'uk': { name: 'Ukrainian', flag: '🇺🇦', code: 'uk' }
    },

    // Default source and target languages
    defaultSource: 'auto',
    defaultTarget: 'en',

    // Translation API options
    // Option 1: Use LibreTranslate (Free and Open Source)
    useLibreTranslate: true,
    libreTranslateUrl: 'https://libretranslate.com/translate', // or your local server

    // Option 2: Use Google Translate (requires API Key)
    useGoogleTranslate: false,
    googleTranslateApiKey: '', // Enter your API Key here

    // Option 3: Use Microsoft Translator (requires API Key)
    useMicrosoftTranslate: false,
    microsoftTranslateKey: '', // Enter your API Key here
    microsoftTranslateRegion: 'global',

    // UI settings
    autoTranslate: false, // Auto translate while typing
    autoTranslateDelay: 500, // Delay for auto translate (milliseconds)
    saveHistory: true, // Save translation history
    maxHistoryItems: 50 // Maximum number of history items
};

// Save and load settings from LocalStorage
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
                console.error('Error loading settings:', e);
            }
        }
    }
};

// Load settings on page load
Settings.load();
