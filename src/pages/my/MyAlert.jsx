import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const NotificationPage = () => {
  const token = useAtomValue(tokenAtom);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;

    const fetchAlerts = async () => {
      try {
        const res = await axios.post(`${url}/myAlertList`, null, {
          headers: {
            Authorization: token.access_token,
          },
        });
        setAlerts(res.data);
      } catch (err) {
        console.error('알림 불러오기 실패:', err);
      }
    };

    fetchAlerts();
  }, [token]);

  const handleClick = async (alertId) => {
    try {
      await axios.post(`${url}/myAlertCheck`, { alertId }, {
        headers: {
          Authorization: token.access_token,
        },
      });

      // 프론트에서도 바로 반영
      setAlerts((prev) =>
        prev.map((a) =>
          a.alertId === alertId ? { ...a, isChecked: true } : a
        )
      );
    } catch (err) {
      console.error('알림 확인 처리 실패:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-6">나의 알림</h1>
      <div className="space-y-4">
        {alerts.length === 0 && (
          <p className="text-gray-500 text-sm">알림이 없습니다.</p>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.alertId}
            onClick={() => handleClick(alert.alertId)}
            className={`cursor-pointer border rounded-md p-4 shadow-sm transition ${
              alert.isChecked
                ? 'bg-gray-100 border-gray-200'
                : 'bg-white border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-800">{alert.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  유형: {alert.type} | 보낸 사람: {alert.senderNickname}
                </p>
              </div>
              <div className="text-xs text-blue-500">
                {alert.isChecked ? '' : '●'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
