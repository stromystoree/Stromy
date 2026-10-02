self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'STROMY STORE',
      body: event.data
        ? event.data.text()
        : 'Ada notifikasi baru.'
    };
  }

  const title = data.title || '🔔 STROMY STORE';

  const options = {
    body: data.body || 'Ada pesanan baru masuk.',
    data: {
      url: data.url || './'
    },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url =
    (event.notification.data &&
     event.notification.data.url) || './';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientsList => {

      for (const client of clientsList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }

    })
  );
});