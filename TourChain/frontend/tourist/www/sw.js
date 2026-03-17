const CACHE_NAME = 'tourchain-v2';
const urlsToCache = [
    './',
    './index.html',
    './config.js'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // Force the new service worker to take over
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); // Clean old caching
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Network first, fallback to cache
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
