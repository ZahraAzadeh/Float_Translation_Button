// Service Worker برای PWA
const CACHE_NAME = 'translation-app-v1';

// تشخیص مسیر base برای GitHub Pages
const BASE_PATH = self.location.pathname.includes('/Float_Translation_Button/') 
    ? '/Float_Translation_Button' 
    : '';

const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/styles/main.css',
  BASE_PATH + '/styles/themes.css',
  BASE_PATH + '/scripts/config.js',
  BASE_PATH + '/scripts/language-detection.js',
  BASE_PATH + '/scripts/translation.js',
  BASE_PATH + '/scripts/ui.js',
  BASE_PATH + '/scripts/app.js',
  BASE_PATH + '/manifest.json'
];

// نصب Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache failed:', error);
      })
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// دریافت درخواست‌ها
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // اگر در cache بود، از cache برگردان
        if (response) {
          return response;
        }
        
        // در غیر این صورت از شبکه بگیر
        return fetch(event.request).then((response) => {
          // بررسی معتبر بودن پاسخ
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // کپی پاسخ برای cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // در صورت خطا، صفحه offline را برگردان
        if (event.request.destination === 'document') {
          return caches.match(BASE_PATH + '/index.html');
        }
      })
  );
});

