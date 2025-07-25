// ===== ADVANCED SECRET FRIEND - SERVICE WORKER =====
// Author: Elizabeth Díaz Familia
// Description: PWA Service Worker for offline capabilities
// Version: 1.0.0

const CACHE_NAME = 'advanced-secret-friend-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/script.js',
    '/styles.css',
    '/assets/images/favicon.svg',
    '/assets/images/logo.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker: App shell cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Cache failed', error);
            })
    );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip Chrome extension requests
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    console.log('📦 Service Worker: Serving from cache', event.request.url);
                    return response;
                }
                
                // Otherwise fetch from network
                console.log('🌐 Service Worker: Fetching from network', event.request.url);
                return fetch(event.request).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Add to cache for future requests
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch((error) => {
                    console.error('❌ Service Worker: Fetch failed', error);
                    
                    // Return offline page for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                    
                    throw error;
                });
            })
    );
});

// ===== MESSAGE EVENT =====
self.addEventListener('message', (event) => {
    console.log('📩 Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME,
            cached: urlsToCache.length
        });
    }
});

// ===== SYNC EVENT (Background Sync) =====
self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Background sync', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Perform background tasks here
            console.log('🔄 Service Worker: Performing background sync')
        );
    }
});

// ===== PUSH EVENT (Push Notifications) =====
self.addEventListener('push', (event) => {
    console.log('🔔 Service Worker: Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: '/assets/images/favicon.svg',
        badge: '/assets/images/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver aplicación',
                icon: '/assets/images/favicon.svg'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/assets/images/favicon.svg'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Advanced Secret Friend', options)
    );
});

// ===== NOTIFICATION CLICK EVENT =====
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ===== ERROR HANDLING =====
self.addEventListener('error', (event) => {
    console.error('❌ Service Worker: Error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Service Worker: Unhandled rejection', event.reason);
});

console.log('🎯 Advanced Secret Friend Service Worker loaded successfully!');