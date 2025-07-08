// src/components/PointList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { useAxios } from '../../hooks/useAxios';
import MyPointRefund from './MyPointRefund';
import MyPointCharge from './MyPointCharge';

export default function PointList() {
  const [points, setPoints] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [activeTab, setActiveTab] = useState('전체');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);

  const navigate = useNavigate();
  const api = useAxios();
  const token = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (!token?.access_token) return;
    (async () => {
      try {
        const res = await api.post(
          '/my/myPointList',
          null,
          { headers: { Authorization: `Bearer ${token.access_token}` } }
        );
        setPoints(res.data.pointList);
        setUser(prev => ({ ...prev, totalPoint: res.data.totalPoint }));
      } catch (err) {
        console.error('포인트 내역 조회 실패:', err);
      }
    })();
  }, [token, api, setUser]);

  const filtered = points.filter(p => {
    if (activeTab === '전체') return true;
    if (activeTab === '적립') return p.point > 0;
    if (activeTab === '사용') return p.point < 0;
    return true;
  });
  const visible = filtered.slice(0, visibleCount);

  const refundable = points.filter(p => {
    if (p.point <= 0) return false;
    if (!p.reason.includes('충전')) return false;
    const t = new Date(p.date).getTime();
    if (Date.now() - t > 7 * 86400000) return false;
    return !points.some(q => q.point < 0 && new Date(q.date).getTime() > t);
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 제목 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">나의 포인트</h1>
        <p className="text-gray-600">포인트 잔액과 내역을 확인하세요</p>
      </div>

      {/* 보유 포인트 카드 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-2xl font-bold text-[#E88D67]">
          {(user?.totalPoint ?? 0).toLocaleString()} P
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b mb-4 text-sm">
        {['전체', '적립', '사용'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setVisibleCount(15); }}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'text-[#005C78] border-b-2 border-[#005C78]'
                : 'text-gray-500 hover:text-[#006989]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

{/* 내역 테이블 (문의 디자인과 동일하게) */}
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
  {/* 헤더 */}
  <div className="grid grid-cols-12 px-4 py-2 text-sm font-medium bg-gray-50 border-b border-gray-200">
    <div className="col-span-3 text-gray-500">구분</div>
    <div className="col-span-3 text-gray-500">포인트</div>
    <div className="col-span-3 text-gray-500">사유</div>
    <div className="col-span-2 text-right text-gray-500">일시</div>
  </div>

  {/* 항목 */}
  {visible.map((p, i) => (
    <div
      key={i}
      className="grid grid-cols-12 px-4 py-4 text-sm border-b border-gray-200 items-center hover:bg-gray-50 cursor-pointer"
    >
      <div className="col-span-3 text-[#005C78] font-semibold">
        {p.point > 0 ? '적립' : '사용'}
      </div>
      <div className={`col-span-3 font-medium ${p.point > 0 ? 'text-[#006989]' : 'text-red-500'}`}>
        {p.point > 0 ? `+${p.point}` : p.point}P
      </div>
      <div className="col-span-4 truncate">
        {p.reason}
      </div>
      <div className="col-span-2 text-right text-gray-600">
        {new Date(p.date).toLocaleString('ko-KR', {
          year: 'numeric', month: '2-digit',
          day: '2-digit', hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  ))}
</div>


      {/* 더보기 */}
      {visibleCount < filtered.length && (
        <div className="text-center">
          <button
            onClick={() => setVisibleCount(c => c + 15)}
            className="text-[#006989] text-sm hover:underline"
          >
            더보기
          </button>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowRefundModal(true)}
          className="bg-[#E88D67] text-white px-4 py-2 rounded hover:bg-[#d47c5a] transition"
        >
          환불신청
        </button>
        <button
          onClick={() => setShowChargeModal(true)}
          className="bg-[#E88D67] text-white px-4 py-2 rounded hover:bg-[#d47c5a] transition"
        >
          충전하기
        </button>
      </div>

      {/* 환불 모달 */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <MyPointRefund
            refundablePoints={refundable}
            onClose={() => setShowRefundModal(false)}
          />
        </div>
      )}

      {/* 충전 모달 */}
      {showChargeModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="relative w-full max-w-lg mx-4">
            <MyPointCharge onClose={() => setShowChargeModal(false)} />
          </div>
        </div>
      )}
    </div>
);
}
