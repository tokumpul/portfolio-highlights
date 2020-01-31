const cacheName = 'sl3k-v1.1';
const cacheFiles = [
  './',
  './index.html',
  './manifest.json',
  './styles/css/sl3k.min.css',
  './scripts/js/sl3k.js',
  './scripts/vendor/axios-0.19.0/axios.js',
  './scripts/vendor/vue-2.6.11/vue.js',
  './images/sl3k-icon-16x16.png',
  './images/sl3k-icon-32x32.png',
  './images/sl3k-icon-180x180.png',
  './images/sl3k-icon-192x192.png',
  './images/sl3k-icon-512x512.png',
  './images/sl3k-icon-transparent-512x512.png'
];

self.addEventListener('install', e => {
  console.log('SW is installing');
  self.skipWaiting();
  e.waitUntil(
    caches
    .open(cacheName)
    .then(cache => {
      console.log('SW is caching');
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', e => {
  console.log('SW is activating');
  e.waitUntil(
    caches
    .keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cachedName => {
          if (cachedName !== cacheName) {
            return caches.delete(cachedName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log(`SW is fetching: ${e.request.url}`);
  e.respondWith(
    caches
    .match(e.request)
    .then(res => {
      if (res) {
        console.log(`SW fetched: ${e.request.url}`);
        return res;
      }
      console.log(`SW is requesting: ${e.request.url}`);
      return fetch(e.request);
    }).catch(error => {
      console.log(error);
    })
  );
});