const CACHE = "relate-web-v1";
const PRECACHE = [
  "/app/",
  "/app/index.html",
  "/app/manifest.webmanifest",
  "/app/icons/icon-192.png",
  "/app/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isCacheable(request, url) {
  return (
    request.method === "GET" &&
    url.origin === self.location.origin &&
    url.pathname.startsWith("/app/") &&
    !url.pathname.endsWith("/sw.js")
  );
}

function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => cached || caches.match("/app/index.html")),
    );
}

function staleWhileRevalidate(request) {
  return caches.match(request).then((cached) => {
    const fresh = fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => cached);
    return cached || fresh;
  });
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!isCacheable(event.request, url)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});
