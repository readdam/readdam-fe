// src/pages/my/MyAlert.jsx
import React, { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const MyAlert = () => {
  const axios = useAxios();
  const token = useAtomValue(tokenAtom);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!token?.access_token?.trim()) return;

    const fetchAlerts = async () => {
      try {
        const res = await axios.post('/my/myAlertList');
        setAlerts(res.data);
      } catch (err) {
        console.error('알림 불러오기 실패:', err);
      }
    };
    fetchAlerts();
  }, [axios, token?.access_token]);

  const handleClick = async (alert) => {
    try {
      await axios.post('/my/myAlertCheck', { alertId: alert.alertId });
      setAlerts(prev =>
        prev.map(a =>
          a.alertId === alert.alertId ? { ...a, isChecked: true } : a
        )
      );
      if (alert.linkUrl) {
        if (/^https?:\/\//.test(alert.linkUrl)) {
          window.location.href = alert.linkUrl;
        } else {
          window.location.href = alert.linkUrl;
        }
      }
    } catch (err) {
      console.error('알림 확인 처리 실패:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await Promise.all(
        alerts
          .filter(a => !a.isChecked)
          .map(a => axios.post('/my/myAlertCheck', { alertId: a.alertId }))
      );
      setAlerts(prev => prev.map(a => ({ ...a, isChecked: true })));
    } catch (err) {
      console.error('전체 읽음 처리 실패:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">나의 알림</h1>
        {alerts.some(a => !a.isChecked) && (
          <button
            onClick={markAllRead}
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
          >
            전체 읽음
          </button>
        )}
      </div>

      <div className="space-y-4">
        {alerts.length === 0 && (
          <p className="text-gray-500 text-sm">알림이 없습니다.</p>
        )}
        {alerts.map(alert => (
          <div
            key={alert.alertId}
            onClick={() => handleClick(alert)}
            className={`cursor-pointer border rounded-md p-4 shadow-sm transition ${
              alert.isChecked
                ? 'bg-gray-100 border-gray-200'
                : 'bg-white border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {alert.content}
                </p>
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

      <p className="text-center text-xs text-gray-400 mt-8">
        알림은 30일 뒤 자동 삭제 됩니다.
      </p>
    </div>
  );
};

export default MyAlert;
