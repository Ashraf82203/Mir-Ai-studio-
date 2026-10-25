/* Mir AI Studio PWA service worker — offline app shell + asset cache */
const CACHE = "mirai-shell-v1";
const ASSETS = ["/mobile", "/icons/icon-512.png", "/images/hero-video.jpg", "/images/avatar-studio.jpg", "/images/anime-scene.jpg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/")) return; // API always live

  // Navigations: network-first, fall back to cached shell (offline mode)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match("/mobile")))
    );
    return;
  }

  // Static assets & images: cache-first
  if (url.origin === location.origin || /\.(png|jpg|jpeg|webp|svg|woff2?|css|js)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then((m) => m || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => m))
    );
  }
});
