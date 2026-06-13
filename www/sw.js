const CACHE_NAME = 'yatra-tracker-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/manifest.json',
  '/assets/vishnu_namam_3d.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Bypass cache completely for local development / testing (localhost, 127.0.0.1, or local IP subnets)
  const isLocal = e.request.url.includes('localhost') || 
                  e.request.url.includes('127.0.0.1') || 
                  /192\.168\.\d+\.\d+/.test(e.request.url) || 
                  /10\.\d+\.\d+\.\d+/.test(e.request.url) || 
                  /172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/.test(e.request.url);
  
  if (isLocal) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network-first strategy for API calls, Cache-first for static assets
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch new version in background to update cache (stale-while-revalidate)
          fetch(e.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(e.request);
      })
    );
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            return clientList[i];
          }
        }
        return client.focus();
      }
      return self.clients.openWindow('/');
    })
  );
});
