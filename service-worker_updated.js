const CACHE_NAME = 's-varde-cache-v2';
const urlsToCache = [
  './index_updated.html',
  './',
  './index.html',
  './favicon.png',
  './manifest.json'
];

// Installationsfas: cachea allt viktigt
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Cache install error:', err))
  );
});

// Aktiveringsfas: ta bort gamla cache-versioner
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Hämtningar: serva från cache eller hämta nytt
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return new Response('Offline och resursen kunde inte hämtas.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});
