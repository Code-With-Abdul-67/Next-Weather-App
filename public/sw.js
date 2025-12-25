const CACHE_NAME = 'next-weather-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Simple pass-through for now, or basic caching if needed.
    // For this user specifically: "cache and all fetching would be from server"
    // So we don't want aggressive offline caching preventing fresh data.
    // But we need a fetch handler for PWA installability criteria.
    event.respondWith(fetch(event.request));
});
