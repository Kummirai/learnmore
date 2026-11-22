const CACHE = "relate-web-v2";
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

self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload = { body: event.data.text() };
    }
  }

  const title = payload.title || "Relate";
  const notificationData = payload.data && typeof payload.data === "object" ? payload.data : {};
  const options = {
    body: payload.body || payload.message || "",
    icon: payload.icon || "/app/icons/icon-192.png",
    data: { ...notificationData, url: payload.url || notificationData.url || "/app/" },
    badge: payload.badge || "/app/icons/icon-192.png",
    tag: payload.tag,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  const rawTarget =
    (event.notification.data && event.notification.data.url) ||
    "/app/";
  const target = new URL(rawTarget, self.location.origin);
  if (target.origin !== self.location.origin) {
    target.href = self.location.origin + "/app/";
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const appClient = clients.find((client) =>
          new URL(client.url).pathname.startsWith("/app/"),
        );
        if (appClient && "navigate" in appClient) {
          return appClient.navigate(target.href).then(() => appClient.focus());
        }
        if (appClient && "focus" in appClient) return appClient.focus();
        return self.clients.openWindow(target.href);
      })
      .finally(() => event.notification.close()),
  );
});
