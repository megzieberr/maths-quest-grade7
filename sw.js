/* ============================================================
   SERVICE WORKER — hou die app outomaties op datum
   ------------------------------------------------------------
   Strategie: NETWERK-EERSTE met revalidasie. Elke laai gaan haal
   die jongste lêers by die bediener (vinnige 304 as niks verander
   het nie), so 'n nuwe weergawe wys altyd sonder 'n hard-refresh.
   Die kas (Cache Storage) is net 'n vanlyn-terugval.
   ============================================================ */
const CACHE = "wq-g7-v2";   // verhoog dit met groot veranderinge om ou kasse skoon te maak

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;   // los Supabase / CDN / fonts uit
  e.respondWith((async () => {
    try {
      // revalideer altyd teen die bediener → kry die jongste lêer (of 'n vinnige 304)
      const fresh = await fetch(req, { cache: "no-cache" });
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") {
        const idx = (await caches.match("./index.html")) || (await caches.match("./"));
        if (idx) return idx;
      }
      throw err;
    }
  })());
});
