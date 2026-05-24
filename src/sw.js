import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// ── PWA: take control immediately on update ──
self.skipWaiting();
clientsClaim();

// ── PWA: precache all app assets ──
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// ── PWA: SPA navigation fallback ──
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), {
  denylist: [/^\/__/, /\/[^/?]+\.[^/]+$/],
}));

// ── PWA: cache Google Fonts ──
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })],
  })
);
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'gstatic-fonts-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })],
  })
);

// ── FCM: background push handler ──
const app = initializeApp({
  apiKey: 'AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems',
  authDomain: 'goddess-plan.firebaseapp.com',
  projectId: 'goddess-plan',
  storageBucket: 'goddess-plan.firebasestorage.app',
  messagingSenderId: '225308869833',
  appId: '1:225308869833:web:b5cc454324237a0ec87918',
});

const messaging = getMessaging(app);

onBackgroundMessage(messaging, payload => {
  const { title = 'Goddess Plan 🌸', body = '' } = payload.notification ?? {};
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: payload.data?.tag ?? 'gp-reminder',
    data: { url: '/' },
  });
});

// ── Tap notification → open / focus the app ──
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
