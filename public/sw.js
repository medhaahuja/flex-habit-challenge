// Minimal service worker — just enough to make Flex installable as a PWA
// (add-to-home-screen) and load fast offline. Network-first, cache fallback.
const CACHE = 'flex-v1'
self.addEventListener('install', (e) => { self.skipWaiting() })
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()) })
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(e.request))
  )
})
