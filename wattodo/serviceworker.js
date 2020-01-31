const cacheName = 'wattodo-2.0';
const cacheFiles = [
  './',
  './index.html',
  './manifest.json',
  './scripts/js/wattodo.js',
  './scripts/json/activities.json',
  './scripts/json/movies.json',
  './scripts/json/recipes.json',
  './scripts/json/restaurants.json',
  './styles/css/wattodo.min.css',
  './images/wattodo-192x192.png',
  './images/wattodo-512x512.png'
];

self.addEventListener('install', e => {
  console.log('Service Worker is installing...');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Service Worker is caching...');
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', e => {
  console.log('Service Worker is activating...');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cName => {
          if(cName !== cacheName) {
            return caches.delete(cName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('Service Worker is fetching... ', e.request.url);
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        console.log('Found ', e.request.url, ' in cache');
        return response;
      }
      console.log('Service Worker is requesting... ', e.request.url);
      return fetch(e.request)
    }).catch(error => { 
      console.log(error);
    })
  );
});