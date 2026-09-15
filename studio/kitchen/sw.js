/* Minimal Costello kitchen worker — network-only.
   Exists so Chrome/Edge treat the workspace as installable.
   Does not cache kitchen files. */
const VERSION = "lg-kitchen-sw-v1";

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});
