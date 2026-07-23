/* MiniBox+ Toolkit service worker Ã¢â‚¬â€ offline + auto-update.
   HOW UPDATES REACH THE TEAM: bump VERSION below on every deploy.
   The browser notices sw.js changed, installs the new version, and the
   in-page banner offers "Refresh" so everyone gets the latest. */
var VERSION = 'mbx-2026-07-23q';
var CORE = [
  './', './index.html', './manifest.webmanifest', './materials-data.js',
  './icon-180.png', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './vendor/leaflet.js', './vendor/leaflet.css'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(CORE).catch(function () { /* tolerate a missing asset */ });
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== VERSION) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
  /* The page asks 'what version am I actually running?' so the HQ board can
     show a real date. Answered from THIS worker, so a stale cached copy
     honestly reports its old date instead of the newest one. */
  if (e.data && e.data.type === 'VERSION' && e.ports && e.ports[0]) {
    e.ports[0].postMessage({ version: VERSION });
  }
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return; // leave cross-origin alone
  if (url.pathname.indexOf('/api/') === 0) return;  // live data (Team Chat) â€” never serve from cache

  // Command Center: always live, and never cached as the app shell (it loads in
  // an iframe, which is a 'navigate' request too — without this it would
  // overwrite the cached toolkit).
  if (url.pathname.endsWith('/reports.html')) {
    e.respondWith(fetch(req).catch(function () { return caches.match(req); }));
    return;
  }

  var isShell = url.pathname === '/' ||
                url.pathname.endsWith('/index.html') ||
                (req.mode === 'navigate' && !/\.[a-z0-9]+$/i.test(url.pathname));

  if (isShell) {
    // Network-first so an online tap always shows the freshest toolkit.
    e.respondWith(
      fetch(req).then(function (res) {
        // Only ever cache a real page. A 401 sign-in screen must never become the
        // saved app shell, or an offline tap shows the door instead of the toolkit.
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { try { c.put('./index.html', copy); } catch (_) {} });
        }
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (h) { return h || caches.match('./'); });
      })
    );
  } else {
    // Cache-first for big static assets (data file, icons); refresh quietly in the background.
    e.respondWith(
      caches.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(VERSION).then(function (c) { try { c.put(req, copy); } catch (_) {} });
          }
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      })
    );
  }
});

