import { toast } from 'react-toastify';
import { getFirebaseMessaging } from '../firebase';
import { onMessage } from 'firebase/messaging';

/* ① 최초 진입 시 – 안 읽은 알림 개수 ▸ 토스트 */
export async function initUnreadAlerts(axiosInstance) {
    try {
        const { data: count } = await axiosInstance.get('/my/unread/count');
        if (count === 0) return;

        if (count === 1) {
            const { data: [alert] } = await axiosInstance.get('/my/latest', {
                params: { limit: 1 },
            });
            toast.info(`🔔 ${alert.content}`, { autoClose: false });
        } else {
            toast.info(`🔔 ${count}개의 새 알림이 있습니다.`, {
                autoClose: false,
            });
        }
    } catch (err) {
        console.error('initUnreadAlerts 실패', err);
    }
}

/* ② 포그라운드 실시간 알림 – 콜백 해제 함수 반환 */
export function subscribeRealtimeAlerts() {
    const messaging = getFirebaseMessaging();
    if (!messaging) return () => { };

    return onMessage(messaging, (payload) => {
        const body = payload.notification?.body || payload.data?.body;
        if (body) toast.info(`🔔 ${body}`, { autoClose: false });
    });
}
