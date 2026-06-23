const CACHE = 'all-cache-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        '/favicon.ico',
      ]);
    })
  );
  self.skipWaiting();
});

async function deleteOldCache() {
  const cacheNames = await caches.keys();

  const deletePromises = cacheNames.map(cacheName => {
    if (cacheName != CACHE) {
      console.log('Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    }
  });
  await Promise.all(deletePromises);
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    async () => {
      await deleteOldCache();
      await clients.claim();
    }
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if ((request.method != 'GET' && request.method != 'OPTIONS') || request.destination == 'audio') {
    event.respondWith(fetch(request));
    return;
  }
  
  // console.log('SW: Intercepted:', request.url, 'Mode:', request.mode, 'Destination:', request.destination, request);

  event.respondWith(
    (async () => {
      await deleteOldCache();
      const cachedResponse = await caches.match(new URL(request.url));

      let networkPromise = fetch(request).then(async (networkResponse) => {
        if (networkResponse) {
          let clone = networkResponse.clone();

          let cache = await caches.open(CACHE);
          // console.log('SW: Putting in cache', clone);
          await cache.put(new URL(request.url), clone);
        }

        return networkResponse;
      }).catch(error => {
        // console.log('SW: network request failed', request.url, error);
      });

      if (cachedResponse) {
        // console.log('SW: Found in cache:', url.pathname);
        return cachedResponse;
      }

      try {
        const networkResponse = await networkPromise;
        // console.log('SW: Serving from network', url.pathname);
        return networkResponse; 
      } catch(error) {
        // console.log('SW: Network failed for page:', url.pathname, "\nError: ", error);
        return new Response(
          `<html>
            <head><title>Offline</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
              <h1>Offline</h1>
              <p>This page is not cached.</p>
              <p>Please check your internet connection.</p>
              <button onclick="location.reload()">Retry</button>
              <button onclick="window.location.href='/'">To home page</button>
            </body>
          </html>`,
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache'
            }
          }
        );
      }
    })()
  );
});
