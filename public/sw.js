// Service Worker for BPS Compass Push Notifications

const CACHE_NAME = 'schoolconnect-v1'

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Push event - handle incoming push notifications
// IMPORTANT: iOS/Safari requires showing a notification immediately.
// If we don't show one, Safari revokes push permission for the site.
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received!', event)

  // Default notification data - always have a fallback
  let data = {
    title: 'BPS Compass',
    body: 'New notification from BPS Compass',
    url: '/',
  }

  // Try to parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json()
      console.log('[SW] Push data parsed:', pushData)
      data = { ...data, ...pushData }
    } catch (error) {
      console.log('[SW] JSON parse failed, trying text')
      // If JSON parsing fails, try to get text
      try {
        data.body = event.data.text() || data.body
      } catch (e) {
        console.log('[SW] Text parse also failed')
        // Use default data
      }
    }
  } else {
    console.log('[SW] No push data received')
  }

  console.log('[SW] Showing notification with data:', data)

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    timestamp: Date.now(),
    data: {
      url: data.url || '/',
      notificationId: data.notificationId,
      clubId: data.clubId,
      postId: data.postId,
    },
    actions: [
      {
        action: 'open',
        title: 'View',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    // Android collapses notifications that share a tag. Using one constant tag
    // meant every club post overwrote the previous one; key off the actual
    // notification so unrelated items stack in the shade instead.
    tag: data.tag || data.notificationId || `schoolconnect-${Date.now()}`,
    renotify: true,
  }

  // ALWAYS show notification - never return without showing one on iOS
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          try {
            await client.focus()
            // navigate() rejects on clients this worker doesn't control, which
            // happens on Android when the PWA was opened before the worker
            // activated. Fall through to openWindow in that case.
            if ('navigate' in client) {
              await client.navigate(urlToOpen)
            }
            return
          } catch (error) {
            console.log('[SW] Could not reuse existing window:', error)
            break
          }
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Background sync for offline notification actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'mark-notification-read') {
    event.waitUntil(markNotificationsAsRead())
  }
})

async function markNotificationsAsRead() {
  // This would sync read status when back online
  // Implementation depends on IndexedDB storage of pending actions
}
