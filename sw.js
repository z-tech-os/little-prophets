/* ============================================
   Little Prophets - Service Worker
   Basic offline caching for GitHub Pages
   ============================================ */

const CACHE_NAME = 'little-prophets-v2';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './style.css',
  './main.js',
  './prophets.html',
  './adam.html',
  './nuh.html',
  './ibrahim.html',
  './yusuf.html',
  './musa.html',
  './ayyub.html',
  './yunus.html',
  './dawud.html',
  './sulaiman.html',
  './isa.html',
  './muhammad.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Outfit:wght@500;600;700;800&display=swap'
];

// Install - cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache successful responses
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cached => cached || caches.match('./index.html'));
      })
  );
});
