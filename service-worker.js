const CACHE_NAME = "registro-ore-cache-v1";
const urlsToCache = [
  "/registro-ore-lavoro/",
  "/registro-ore-lavoro/index.html",
  "/registro-ore-lavoro/style.css",
  "/registro-ore-lavoro/app.js",
  "/registro-ore-lavoro/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
