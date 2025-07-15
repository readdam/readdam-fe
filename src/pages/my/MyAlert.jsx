// src/pages/my/MyAlert.jsx
import React, { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import AlertItem from '../../components/AlertItem';

export default function MyAlert() {
  const api = useAxios();
  const token = useAtomValue(tokenAtom);

  // 페이징 상태
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // 알림 목록 불러오기 (page가 바뀔 때마다 호출)
  useEffect(() => {
    if (!token?.access_token?.trim()) return;
    (async () => {
      try {
        const res = await api.post(
          `/my/myAlertList?page=${page}&size=${size}`,
          {},
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
            withCredentials: true,
          }
        );
        const { content, pageInfo } = res.data;
        setAlerts(prev =>
          page === 0 ? content : [...prev, ...content]
        );
        setTotalPages(pageInfo.getTotalPages ? pageInfo.getTotalPages() : pageInfo.totalPages);
      } catch (err) {
        console.error('알림 불러오기 실패:', err);
      }
    })();
  }, [api, token, page, size]);

  const handleClick = async alert => {
    if (alert.isChecked) return;
    try {
      await api.post(
        '/my/myAlertCheck',
        { alertId: alert.alertId },
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
          withCredentials: true,
        }
      );
      setAlerts(prev =>
        prev.map(a =>
          a.alertId === alert.alertId ? { ...a, isChecked: true } : a
        )
      );
    } catch (err) {
      console.error('알림 확인 처리 실패:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await Promise.all(
        alerts
          .filter(a => !a.isChecked)
          .map(a =>
            api.post(
              '/my/myAlertCheck',
              { alertId: a.alertId },
              {
                headers: { Authorization: `Bearer ${token.access_token}` },
                withCredentials: true,
              }
            )
          )
      );
      setAlerts(prev => prev.map(a => ({ ...a, isChecked: true })));
    } catch (err) {
      console.error('전체 읽음 처리 실패:', err);
    }
  };

  const loadMore = () => {
    if (page + 1 < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 + 전체 읽음 */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#006989]">나의 알림</h1>
          <p className="text-gray-600">최근 30일 간 받은 알림을 확인하세요</p>
        </div>
        {alerts.some(a => !a.isChecked) && (
          <button
            onClick={markAllRead}
            className="text-sm bg-[#006989] text-white px-4 py-2 rounded-md hover:bg-[#005C78] transition"
          >
            전체 읽음
          </button>
        )}
      </div>

      {/* 알림 리스트 */}
      <div>
        {alerts.length === 0 ? (
          <p className="text-center text-gray-500 py-20">알림이 없습니다.</p>
        ) : (
          alerts.map(alert => (
            <AlertItem key={alert.alertId} alert={alert} onClick={handleClick} />
          ))
        )}
      </div>

      {/* 하단 안내 */}
      <p className="text-center text-xs text-gray-400">
        ※ 알림은 30일 후 자동 삭제됩니다.
      </p>

      {/* 더보기 버튼 */}
      {page + 1 < totalPages && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="mt-4 px-6 py-2 border border-[#006989] text-[#006989] rounded-md text-sm hover:bg-[#F3F7EC] transition"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
