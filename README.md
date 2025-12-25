# Floating Translation Overlay

A beautiful floating translation application that works as an overlay on web pages and social media.

## ✨ Features

- 🎯 **Floating Button**: Always accessible and ready to use
- 🌐 **Auto Language Detection**: Automatic detection of input text language
- 🔄 **Fast Translation**: Translate text to multiple languages
- 🎨 **Modern Design**: Beautiful and user-friendly interface
- 📱 **Responsive**: Compatible with all screen sizes
- 🌙 **Dark Theme**: Perfect for night use
- 📋 **Quick Copy**: Copy translated text with one click
- 🔀 **Language Swap**: Quickly swap source and target languages

## 🚀 How to Use

### Method 1: Direct Use (Local)

1. Download all files
2. Open `index.html` in your browser
3. Use the floating button to open the translation panel

### Method 2: Install on Mobile (PWA) 📱

**For mobile installation, refer to `MOBILE_INSTALL_GUIDE.md`.**

Summary:
1. Upload files to an HTTPS server
2. Open in mobile browser
3. Select "Add to Home Screen" option

### Method 3: Build APK/IPA 📦

**To build APK (Android) or IPA (iOS) files, refer to:**

- **`BUILD_QUICK_START.md`** - Quick guide (5 minutes)
- **`BUILD_APK_IPA_GUIDE.md`** - Complete guide with details

**Quick method:**
1. Upload the app to a server
2. Go to [PWABuilder.com](https://www.pwabuilder.com/)
3. Enter URL and build APK/IPA

### Method 4: Use as Extension

You can convert this code to a Browser Extension to work on all web pages.

## 📋 Requirements

- A modern browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for using translation API)

## ⚙️ Configuration

### Translation API Settings

In `scripts/config.js` you can choose your preferred translation API:

#### Option 1: LibreTranslate (Default - Free)

```javascript
useLibreTranslate: true,
libreTranslateUrl: 'https://libretranslate.com/translate'
```

#### Option 2: Google Translate API

```javascript
useGoogleTranslate: true,
googleTranslateApiKey: 'YOUR_API_KEY_HERE'
```

#### Option 3: Microsoft Translator

```javascript
useMicrosoftTranslate: true,
microsoftTranslateKey: 'YOUR_API_KEY_HERE',
microsoftTranslateRegion: 'global'
```

### Supported Languages

- English (en)
- Persian (fa)
- Arabic (ar)
- French (fr)
- German (de)
- Spanish (es)
- Italian (it)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Turkish (tr)
- Hindi (hi)
- Portuguese (pt)
- And more...

## 🎯 How It Works

1. Click on the floating button
2. Paste or type your text in the input box
3. Language is automatically detected
4. Click the translate icon button
5. Translated text appears in the output box
6. You can copy the translated text

## ⌨️ Keyboard Shortcuts

- `Enter`: Translate
- `Ctrl + Enter`: Translate (alternative)

## 🛠️ Project Structure

```
floating-translation-overlay/
├── index.html                    # Main page
├── styles/
│   ├── main.css                 # Main styles
│   └── themes.css               # Dark/light themes
├── scripts/
│   ├── config.js                # Configuration
│   ├── language-detection.js   # Auto language detection
│   ├── translation.js          # Translation management
│   ├── ui.js                   # User interface management
│   └── app.js                  # Main application logic
├── REQUIREMENTS_ANALYSIS.md    # Requirements analysis
└── README.md                    # This file
```

## 🔧 Development and Customization

### Change Colors

In `styles/main.css` you can change colors:

```css
.input-box {
    background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR 100%);
}
```

### Add New Language

In `scripts/config.js` in the `languages` section add new language:

```javascript
'new_lang': { name: 'Language Name', flag: '🏳️', code: 'new_lang' }
```

## 📝 License

This project is free and Open Source.

## 🤝 Contributing

To improve this project, you can:

- Report bugs
- Suggest new features
- Improve code

## ⚠️ Important Notes

1. To use Google Translate API or Microsoft Translator API, you need an API Key
2. LibreTranslate is free but may have limitations
3. For production use, it's better to use your own API Key

## 📞 Support

If you encounter any issues or questions, you can create an Issue.

---

**Made with ❤️ for easy and fast translation**
