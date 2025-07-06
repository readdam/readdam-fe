/* eslint-disable no-undef */
/* global importScripts firebase self BroadcastChannel */

// Firebase v10 compat 스크립트 로드
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
});

const messaging = firebase.messaging();

// ── push 이벤트 처리: data-only 메시지도 강제 알림 ──
self.addEventListener('push', event => {
  const payload = event.data?.json() || {};
  const data    = payload.data || {};
  const title   = data.title             ||
                  payload.notification?.title ||
                  "새 알림";
  const body    = data.body              ||
                  payload.notification?.body  ||
                  "";
  const icon    = data.iconUrl           ||
                  payload.notification?.icon ||
                  "/favicon.ico";
  const badge   = data.badgeUrl;
  const url     = data.url               ||
                  payload.notification?.click_action ||
                  "/myAlert";

  const options = {
    body,
    icon,
    badge,
    data: { url },
    tag: "readdam-alert",
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ── 백그라운드 메시지 처리 (data-only + notification 모두 커버) ──
messaging.onBackgroundMessage(async payload => {
  console.log('[SW] background payload', payload);

  const data  = payload.data || {};
  const title = data.title             ||
                payload.notification?.title ||
                "새 알림";
  const body  = data.body              ||
                payload.notification?.body  ||
                "";
  const icon  = data.iconUrl           ||
                payload.notification?.icon ||
                "/favicon.ico";
  const badge = data.badgeUrl;
  const url   = data.url               ||
                payload.notification?.click_action ||
                "/myAlert";

  const options = {
    body,
    icon,
    badge,
    data: { url },
    tag: "readdam-alert",
    renotify: true
  };

  self.registration.showNotification(title, options);
});

// ── 알림 클릭 이벤트 ──
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/myAlert";

  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    if (clientsList.length > 0) {
      const client = clientsList[0];
      await client.focus();
      const bc = new BroadcastChannel('sw-to-page');
      bc.postMessage({ type: 'NAVIGATE', url: targetUrl });
      bc.close();
    } else {
      await self.clients.openWindow(targetUrl);
    }
  })());
});
