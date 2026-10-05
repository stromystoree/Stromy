const CACHE_NAME = "stromy-sw-v1";

// Mencegah notifikasi order yang sama muncul berkali-kali
self.addEventListener("push", event => {
  event.waitUntil((async () => {
    let data = {};

    try {
      data = event.data ? event.data.json() : {};
    } catch (e) {
      try {
        data = {
          title: "STROMY STORE",
          body: event.data ? event.data.text() : "Ada pemberitahuan baru."
        };
      } catch (_) {}
    }

    const title = data.title || "STROMY STORE";
    const body = data.body || "Ada pemberitahuan baru.";
    const orderId =
      data.order_id ||
      data.orderId ||
      data.id ||
      "general";

    // Tag yang sama akan menggantikan notifikasi sebelumnya,
    // bukan membuat notifikasi baru.
    const tag = `stromy-order-${String(orderId)}`;

    await self.registration.showNotification(title, {
      body: body,

      // Notifikasi dengan tag sama hanya menjadi 1
      tag: tag,

      // Jangan membuat notifikasi tambahan untuk tag yang sama
      renotify: false,

      // Tetap tampil sampai user membukanya
      requireInteraction: false,

      data: {
        order_id: orderId,
        url: data.url || "/"
      }
    });
  })());
});


// Saat notifikasi ditekan
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(clientList => {
      const url =
        event.notification.data?.url || "/";

      // Kalau website sudah terbuka, fokus ke tab tersebut
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      // Kalau belum terbuka, buka website
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});


// Install service worker
self.addEventListener("install", event => {
  self.skipWaiting();
});


// Aktifkan versi terbaru
self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});