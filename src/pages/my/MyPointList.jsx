// src/components/PointList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import axios from 'axios';
import { url } from '../../config/config';
import MyPointRefund from './MyPointRefund';

const PointList = () => {
  const [points, setPoints] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [activeTab, setActiveTab] = useState('전체');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const setUser = useSetAtom(userAtom);

  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (!token?.access_token) return;

    const fetchPoints = async () => {
      try {
        const res = await axios.post(
          `${url}/my/myPointList`,
          null,
          { headers: { Authorization: token.access_token } }
        );
        setPoints(res.data.pointList);
        setUser(prev => ({ ...prev, totalPoint: res.data.totalPoint }));
      } catch (err) {
        console.error('포인트 내역 조회 실패:', err);
      }
    };

    fetchPoints();
  }, [token, setUser]);

  // 테이블용 필터
  const filteredPoints = points.filter(item => {
    if (activeTab === '전체') return true;
    if (activeTab === '적립') return item.point > 0;
    if (activeTab === '사용') return item.point < 0;
    return true;
  });
  const visiblePoints = filteredPoints.slice(0, visibleCount);

  // 환불 모달에 보낼 데이터: 
  // • point>0 
  // • reason에 “충전” 포함 
  // • 충전일 기준 7일 이내 
  // • 이후 사용 이력 없음
  const refundablePoints = points.filter(item => {
    if (item.point <= 0) return false;
    if (!item.reason.includes('충전')) return false;
    const chargedAt = new Date(item.date).getTime();
    if (Date.now() - chargedAt > 7 * 24 * 60 * 60 * 1000) return false;
    const usedAfter = points.some(
      p => p.point < 0 && new Date(p.date).getTime() > chargedAt
    );
    return !usedAfter;
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">보유 포인트</h2>
      <div className="text-2xl font-bold text-orange-500 mb-6">
        {(user?.totalPoint ?? 0).toLocaleString()} P
      </div>

      <div className="flex border-b mb-4">
        {['전체', '적립', '사용'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              tab === activeTab
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => {
              setActiveTab(tab);
              setVisibleCount(15);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <table className="w-full text-sm text-left mb-6">
        <thead>
          <tr className="border-b">
            <th className="py-2">구분</th>
            <th className="py-2">포인트</th>
            <th className="py-2">사유</th>
            <th className="py-2">일시</th>
          </tr>
        </thead>
        <tbody>
          {visiblePoints.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-2 text-blue-500 font-semibold">
                {item.point > 0 ? '적립' : '사용'}
              </td>
              <td className={`py-2 ${item.point < 0 ? 'text-red-500' : 'text-blue-600'}`}>
                {item.point > 0 ? `+${item.point}` : item.point}P
              </td>
              <td className="py-2">{item.reason}</td>
              <td className="py-2">
                {new Date(item.date).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visibleCount < filteredPoints.length && (
        <div className="text-center mb-8">
          <button
            className="text-gray-500 hover:underline"
            onClick={() => setVisibleCount(prev => prev + 15)}
          >
            더보기
          </button>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={() => setShowRefundModal(true)}
        >
          환불신청
        </button>
        <button
          onClick={() => navigate('/myPointCharge')}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          충전하기
        </button>
      </div>

      {showRefundModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <MyPointRefund
            refundablePoints={refundablePoints}
            onClose={() => setShowRefundModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PointList;
