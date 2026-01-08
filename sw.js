// sw.js
const CACHE_NAME = 'bodiky-cache-v2';
const FILES_TO_CACHE = [
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/style.css',    // pokud máš externí CSS
  '/script.js'     // pokud máš externí JS
];

// Instalace SW a cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivace SW a odstranění starých cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch - nejdříve z cache, pak ze sítě
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

