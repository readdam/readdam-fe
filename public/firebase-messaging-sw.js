/* eslint-disable no-undef */
/* global importScripts firebase self BroadcastChannel */

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

// ── 백그라운드 메시지 처리 ──
messaging.onBackgroundMessage(async payload => {
  const { title, body, icon } = payload.notification || {};
  const url = payload.data?.url || "/myAlert";

  self.registration.showNotification(title || "새 알림", {
    body,
    icon: icon || "/favicon.ico",
    data: { url },
    tag: "readdam-alert",
    renotify: true
  });
});

// ── 클릭 이벤트 ──
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil((async () => {
    try {
      // 1) 현재 열린 창들 가져오기
      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      if (windowClients.length > 0) {
        const client = windowClients[0];
        // 2) 클라이언트 포커스(잡혀있지 않으면 예외)
        await client.focus();

        // 3) 페이지 내 라우팅 지시: BroadcastChannel 사용
        const bc = new BroadcastChannel("sw-to-page");
        bc.postMessage({ type: "NAVIGATE", url });
        bc.close();
        return;
      }

      // 4) 열린 창이 없으면 새로 열기
      await self.clients.openWindow(url);

    } catch (err) {
      console.error("notificationclick error:", err);
      // 폴백: 새 창 열기
      try {
        await self.clients.openWindow(url);
      } catch (e) {
        console.error("openWindow 폴백 실패:", e);
      }
    }
  })());
});
