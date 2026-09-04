/* global self */
// A notification opens the live app. This worker does not schedule background alarms.
self.addEventListener('notificationclick', event => {
  if (event.notification.tag !== 'nayi60-time-signal') return;
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = windows.find(item => item.url.startsWith(self.registration.scope));
    if (client) {
      await client.navigate(self.registration.scope);
      await client.focus();
    } else await self.clients.openWindow(self.registration.scope);
  })());
});
