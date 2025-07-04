// src/firebaseMessaging.js
import { messaging } from './firebase';
import { onMessage } from 'firebase/messaging';

export function initForegroundNotifications() {
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
    return onMessage(messaging, async payload => {
        const reg = await navigator.serviceWorker.ready;
        const { title, body } = payload.notification || {};
        const url = payload.data?.url || "/myAlert";

        reg.showNotification(title || "새 알림", {
            body,
            icon: payload.data?.iconUrl || "/favicon.ico",
            data: { url },
            tag: "readdam-alert",
            renotify: true
        });
    });
}

