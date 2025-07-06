// src/firebaseMessaging.js
import { messaging } from './firebase';
import { onMessage } from 'firebase/messaging';

export function initForegroundNotifications() {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
  return onMessage(messaging, async payload => {
    const reg = await navigator.serviceWorker.ready;

    const data  = payload.data || {};
    const title = data.title || payload.notification?.title || '새 알림';
    const body  = data.body  || payload.notification?.body  || '';
    const icon  = data.iconUrl || payload.notification?.icon || '/favicon.ico';
    const badge = data.badgeUrl || payload.notification?.badge || undefined;
    const url   = data.url   ||
                  payload.notification?.click_action ||
                  '/myAlert';

    reg.showNotification(title, {
      body,
      icon,
      badge,
      data: { url },
      tag: 'readdam-alert',
      renotify: true
    });
  });
}
