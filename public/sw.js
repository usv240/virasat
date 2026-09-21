/**
 * Virasat offline support.
 *
 * Why this exists: the families this is for are on patchy 2G, not on the
 * office wifi where it was built. Losing signal halfway through reading a
 * checklist, in a queue, is the normal case rather than the edge case.
 *
 * The strategy is deliberately conservative:
 *
 * - Pages are fetched from the network first, and only fall back to the cache
 *   when the network does not answer. A service worker that serves pages from
 *   cache first is a service worker that shows people a stale site for days,
 *   and we would rather be slow than wrong.
 * - Fonts, icons and sample images are cache first, because they never change
 *   without their filename changing.
 * - Anything under /api is never cached. A claim route or an extraction must
 *   be a real answer or no answer, never a remembered one.
 */
const VERSION = "virasat-v1";
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;

/** The pages worth having before anyone loses signal. */
const PRECACHE = ["/", "/try", "/glossary", "/references", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => (await caches.match(request)) ?? (await caches.match("/offline")) ?? Response.error()),
    );
    return;
  }

  const cacheable = /\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname) || url.pathname.startsWith("/_next/static/");
  if (!cacheable) return;

  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ??
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(ASSETS).then((c) => c.put(request, copy));
          return res;
        }),
    ),
  );
});
