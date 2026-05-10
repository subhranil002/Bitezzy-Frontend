// ═══════════════════════════════════════════════════════════════
//  Bitezzy Service Worker
//  Cache-First for static assets
//  Network-First for APIs
// ═══════════════════════════════════════════════════════════════

const STATIC_CACHE_NAME = "bitezzy-static-v2";
const API_CACHE_NAME = "bitezzy-api-v2";

// Files cached during install
const PRECACHE_ASSETS = ["/", "/index.html", "/manifest.json", "/offline.html"];

// Requests never cached
const NEVER_CACHE = [
  /\/api\//,
  /chrome-extension/,
  /extensions/i,
  /^chrome:\/\//i,
  /\/socket\.io\//,
];

// API origins
const API_ORIGINS = ["https://api.bitezzy.store"];

// ──────────────────────────────────────────────
// INSTALL
// ──────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.addAll(PRECACHE_ASSETS);
      await self.skipWaiting();
    })(),
  );
});

// ──────────────────────────────────────────────
// ACTIVATE
// ──────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  const validCaches = [STATIC_CACHE_NAME, API_CACHE_NAME];

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter((name) => !validCaches.includes(name))
          .map((name) => caches.delete(name)),
      );

      await self.clients.claim();
    })(),
  );
});

// ──────────────────────────────────────────────
// FETCH
// ──────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET
  if (request.method !== "GET") return;

  // Ignore excluded requests
  if (NEVER_CACHE.some((pattern) => pattern.test(request.url))) return;

  // API requests
  const isApiRequest =
    API_ORIGINS.some((origin) => request.url.startsWith(origin)) ||
    url.pathname.startsWith("/api/");

  if (isApiRequest) {
    event.respondWith(networkFirst(request, API_CACHE_NAME));
    return;
  }

  // Static assets
  event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
});

// ══════════════════════════════════════════════
// CACHE FIRST
// ══════════════════════════════════════════════
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    updateCache(request, cache);
    return cachedResponse;
  }

  return updateCache(request, cache);
}

// ══════════════════════════════════════════════
// NETWORK FIRST
// ══════════════════════════════════════════════
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    return await cache.match(request);
  }
}

// ══════════════════════════════════════════════
// FETCH + CACHE
// ══════════════════════════════════════════════
async function updateCache(request, cache) {
  const networkResponse = await fetch(request);

  if (
    networkResponse &&
    networkResponse.status === 200 &&
    networkResponse.type !== "opaque"
  ) {
    await cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}
