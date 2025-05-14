// public/service-worker.js

// Cache version (update this when you make changes to cached assets)
const CACHE_VERSION = 'v1';
const CACHE_NAME = `school-crm-cache-${CACHE_VERSION}`;

// Files to cache - include your main assets
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Perform install steps - pre-cache assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Successfully installed');
        return self.skipWaiting(); // Force the waiting service worker to become active
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim(); // Take control of all clients
    })
  );
});

// Fetch event - serve cached or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received:', event);
  
  let notificationData = {};
  
  try {
    // Try to parse the data payload
    notificationData = event.data.json();
  } catch (e) {
    // Fallback to text if not JSON
    notificationData = {
      title: 'School CRM Notification',
      body: event.data.text(),
      icon: '/logo192.png'
    };
  }
  
  // Extract notification details
  const title = notificationData.title || 'School CRM Notification';
  const options = {
    body: notificationData.body || 'You have a new notification',
    icon: notificationData.icon || '/logo192.png',
    badge: '/favicon.ico',
    tag: notificationData.tag || 'general',
    data: notificationData.data || {},
    actions: notificationData.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  // Get URL to open when notification is clicked
  const urlToOpen = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : '/';
  
  // Handle click on notification
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the URL
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open, open URL in new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});