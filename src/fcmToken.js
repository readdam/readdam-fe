import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';


const VAPID_KEY = "BM6eJXOzGy8AdQcx23-lyCMPpEhcNe-7raw4wIgzB0bqKE-81Q0KPBUYvmifB5a4LkP2661uVpMBM9XLuIhk4h8";

export const getFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('푸시 알림 권한 거부됨');
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log('📡 FCM 토큰:', token);
    return token;
  } catch (err) {
    console.error('FCM 토큰 발급 실패:', err);
    return null;
  }
};
