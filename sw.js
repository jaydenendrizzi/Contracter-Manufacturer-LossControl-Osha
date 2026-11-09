// Offline support for R&R Loss Control.
// The app shell (page, logo, icons, PDF library, fonts) is cached so the walkthrough opens with no signal.
// Data calls (/api/*) try the network first and fall back to the last copy seen.
// Bump VERSION when you deploy changes so phones pick up the new page.
const VERSION = "rr-lc-2026-11-09-libfix";
const SHELL = ["/", "/index.html", "/rr-logo.png", "/icon-192.png", "/icon-512.png", "/icon-180.png", "/manifest.webmanifest"];
const CDN = ["https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(SHELL);
    await Promise.all(CDN.map((u) => fetch(u, { mode: "cors" }).then((r) => r.ok && c.put(u, r)).catch(() => {})));
    // Library index (titles only) so search works offline; templates are cached as they are opened
    await fetch("/lib-index.json").then((r) => r.ok && c.put("/lib-index.json", r)).catch(() => {});
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Page loads: network first so deploys show up, cached page when offline
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put("/index.html", copy)); return r; })
      .catch(() => caches.match("/index.html")));
    return;
  }
  // Data: network first, last good answer when offline
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(req).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return r; })
      .catch(() => caches.match(req).then((m) => m || new Response(JSON.stringify({ error: "You're offline. This comes back when you have signal." }), { status: 503, headers: { "content-type": "application/json" } }))));
    return;
  }
  // Everything else (logo, icons, fonts, PDF library): cache first, refresh in the background
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(url.host)) {
    e.respondWith(caches.match(req).then((hit) => {
      const net = fetch(req).then((r) => { if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
