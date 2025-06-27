
const CACHE_NAME = 'pdftools-v2';
const API_CACHE_NAME = 'pdftools-api-v1';
const urlsToCache = [
  '/',
  '/images-to-pdf',
  '/merge-pdf', 
  '/compress-pdf',
  '/rotate-pdf',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Install event - cache recursos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Cache install failed:', error);
      })
  );
});

// Activate event - limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - estratégia cache-first para assets, network-first para navegação
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requisições para outros domínios
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Para navegação (HTML), tenta network primeiro
        if (request.mode === 'navigate') {
          console.log('[SW] Navigate request:', request.url);
          try {
            const networkResponse = await fetch(request);
            // Cache a resposta se for bem-sucedida
            if (networkResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          } catch (error) {
            console.log('[SW] Network failed, trying cache');
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback para index.html para SPA routing
            return caches.match('/');
          }
        }

        // Para assets estáticos, tenta cache primeiro
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log('[SW] Cache hit:', request.url);
          return cachedResponse;
        }

        // Se não estiver no cache, busca da rede
        console.log('[SW] Fetching from network:', request.url);
        const networkResponse = await fetch(request);
        
        // Cache apenas respostas bem-sucedidas
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;

      } catch (error) {
        console.error('[SW] Fetch failed:', error);
        
        // Para navegação, retorna página offline ou index
        if (request.mode === 'navigate') {
          return caches.match('/') || new Response('Offline', { 
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
        
        // Para outros recursos, retorna erro
        return new Response('Resource not available offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Background sync para operações offline
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aqui você pode implementar sincronização offline
      Promise.resolve()
    );
  }
});

// Push notifications (opcional)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  const options = {
    body: 'PDFTools está pronto para usar!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    image: '/icons/icon-384x384.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'pdftools-notification'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icons/icon-96x96.png'
      }
    ],
    requireInteraction: false,
    persistent: true
  };

  event.waitUntil(
    self.registration.showNotification('PDFTools', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded');
