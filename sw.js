// Service Worker for Dentsu Creative Chile
// Provides offline caching and performance improvements

const CACHE_NAME = 'dc-chile-v2.0-202507181841';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes for development
const FORCE_UPDATE = true; // Force update during development

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/assets/css/main.css?v=202507181841',
  '/assets/js/main.js?v=202507181841',
  '/assets/fonts/StabilGrotesk-Black.otf',
  '/assets/fonts/StabilGrotesk-Regular.otf',
  '/assets/img/DC-home1.png'
];

// Resources to cache on first request
const CACHE_ON_REQUEST = [
  '/assets/fonts/StabilGrotesk-Bold.otf',
  '/assets/fonts/StabilGrotesk-Light.otf',
  '/assets/img/',
  '/assets/video/'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical resources...');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('Critical resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache critical resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except Google Fonts)
  if (!url.origin.includes(self.location.origin) && 
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // During development, always fetch from network for HTML, CSS, JS
        if (FORCE_UPDATE && (
          url.pathname.endsWith('.html') ||
          url.pathname.endsWith('.css') ||
          url.pathname.endsWith('.js') ||
          url.pathname === '/'
        )) {
          console.log('Force fetching from network:', url.pathname);
          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseClone));
              }
              return response;
            })
            .catch(() => cachedResponse || new Response('Offline', { status: 503 }));
        }
        
        // If we have a cached response, check if it's still fresh
        if (cachedResponse) {
          const cachedDate = new Date(cachedResponse.headers.get('date'));
          const now = new Date();
          
          // If cache is fresh, return it
          if (now - cachedDate < CACHE_EXPIRY) {
            return cachedResponse;
          }
        }
        
        // Fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Check if we should cache this resource
            const shouldCache = CRITICAL_RESOURCES.includes(url.pathname) ||
                              CACHE_ON_REQUEST.some(pattern => url.pathname.startsWith(pattern)) ||
                              url.pathname.endsWith('.css') ||
                              url.pathname.endsWith('.js') ||
                              url.pathname.endsWith('.otf') ||
                              url.pathname.endsWith('.png') ||
                              url.pathname.endsWith('.jpg') ||
                              url.pathname.endsWith('.jpeg') ||
                              url.pathname.endsWith('.webp');
            
            if (shouldCache) {
              // Clone the response before caching
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                })
                .catch((error) => {
                  console.warn('Failed to cache resource:', url.pathname, error);
                });
            }
            
            return response;
          })
          .catch((error) => {
            console.warn('Network request failed:', url.pathname, error);
            
            // Return cached response if available
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Sin conexión - Dentsu Creative Chile</title>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      min-height: 100vh;
                      margin: 0;
                      background: #f5f5f5;
                      text-align: center;
                      padding: 2rem;
                    }
                    .offline-message {
                      max-width: 400px;
                      background: white;
                      padding: 2rem;
                      border-radius: 8px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .offline-icon {
                      font-size: 3rem;
                      margin-bottom: 1rem;
                    }
                    .retry-btn {
                      background: #F1A6A6;
                      color: white;
                      border: none;
                      padding: 1rem 2rem;
                      border-radius: 6px;
                      cursor: pointer;
                      margin-top: 1rem;
                    }
                    .retry-btn:hover {
                      background: #E19595;
                    }
                  </style>
                </head>
                <body>
                  <div class="offline-message">
                    <div class="offline-icon">📡</div>
                    <h1>Sin conexión</h1>
                    <p>Parece que no tienes conexión a internet. Verifica tu conexión y reintenta.</p>
                    <button class="retry-btn" onclick="location.reload()">Reintentar</button>
                  </div>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html' }
              });
            }
            
            throw error;
          });
      })
  );
});

// Handle background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-form-sync') {
    event.waitUntil(
      // This would handle form submissions when back online
      console.log('Background sync triggered for form submission')
    );
  }
});

// Handle push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/assets/img/DC-home.png',
      badge: '/assets/img/DC-home.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Dentsu Creative Chile', options)
    );
  }
});

console.log('Service Worker loaded successfully');
