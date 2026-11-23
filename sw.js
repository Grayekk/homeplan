// Strona: najpierw sieć, potem pamięć. Zaszyfrowany pakiet: pamięć (nazwa zawiera skrót treści).
const C = 'homeplan-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(clients.claim()))
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url)
  if (e.request.method !== 'GET' || u.origin !== location.origin) return
  const page = e.request.mode === 'navigate', pack = /app\.[0-9a-f]+\.bin$/.test(u.pathname)
  e.respondWith((async () => {
    const c = await caches.open(C), key = page ? './' : e.request
    if (pack) { const hit = await c.match(key); if (hit) return hit }
    try {
      const r = await fetch(e.request)
      if (r.ok) {
        if (pack) for (const k of await c.keys()) if (/app\.[0-9a-f]+\.bin$/.test(k.url)) await c.delete(k)
        await c.put(key, r.clone())
      }
      return r
    } catch (x) { const hit = await c.match(key); if (hit) return hit; throw x }
  })())
})
