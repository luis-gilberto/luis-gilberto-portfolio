// Service Worker - Reset and Cleanup
const CACHE_NAME = 'luis-gilberto-v3-cleanup';

self.addEventListener('install', (event) => {
    // Force immediate activation
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Take control immediately
    event.waitUntil(
        Promise.all([
            clients.claim(),
            // Clear ALL old caches to remove any bad redirects or localhost content
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        console.log('Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    // Pass through all requests - no custom handling, no redirects
    event.respondWith(fetch(event.request));
});
