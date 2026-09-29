// TVAC Equipment — service worker (app-shell cache; API calls always go to network)
var CACHE = 'tvac-v2';
var SHELL = ['./', 'index.html', 'manifest.json', 'logo.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // network-first so updates show immediately; fall back to cache offline
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});

// tapping a notification opens (or focuses) the app on that item
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var id = (e.notification.data || {}).id || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ('focus' in cs[i]) { cs[i].postMessage({ type: 'open', id: id }); return cs[i].focus(); } }
    return self.clients.openWindow('./' + (id ? '?id=' + encodeURIComponent(id) : ''));
  }));
});
