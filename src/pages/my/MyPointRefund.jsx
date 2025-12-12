// src/components/MyPointRefund.jsx
import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAxios } from '../../hooks/useAxios';
import { tokenAtom } from '../../atoms';

const MyPointRefund = ({ refundablePoints, onClose }) => {
  const token = useAtomValue(tokenAtom);
  const axios = useAxios();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefundSubmit = async () => {
    if (selectedIndex === null || !reason) {
      alert('환불 항목과 사유를 선택해주세요.');
      return;
    }

    const { orderId } = refundablePoints[selectedIndex];
    if (!orderId) {
      alert('환불 요청에 필요한 주문 정보가 없습니다.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/my/refund', { orderId, reason });
      alert('환불이 완료되었습니다.');
      onClose(true);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data || err.message || '환불 처리 중 오류가 발생했습니다.';
      alert(`환불 실패: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (refundablePoints.length === 0) {
    return (
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg border border-gray-300 relative">
        <button
          onClick={() => onClose(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">환불 가능한 내역이 없습니다.</h2>
        <p className="text-sm text-gray-600 mb-6">
          최근 7일 이내 “충전” 항목만 환불 가능합니다.
        </p>
        <div className="flex justify-end">
          <button onClick={() => onClose(false)} className="px-4 py-2 bg-gray-200 rounded">
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full max-w-md p-6 rounded shadow-lg border border-gray-300 relative">
      <button
        onClick={() => onClose(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-lg font-bold mb-4">포인트 환불 신청</h2>

      <div className="mb-4 space-y-2 max-h-64 overflow-auto">
        {refundablePoints.map((item, idx) => (
          <label
            key={idx}
            className="flex items-center space-x-2 hover:bg-gray-50 px-2 py-1 rounded"
          >
            <input
              type="radio"
              name="refund"
              value={idx}
              checked={selectedIndex === idx}
              onChange={() => setSelectedIndex(idx)}
            />
            <span className="text-green-600 font-medium">+{item.point}P</span>
            <span className="ml-auto text-sm text-gray-400">
              {new Date(item.date).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          환불 사유 *
        </label>
        <select
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">사유를 선택하세요</option>
          <option value="서비스 불만족">서비스 불만족</option>
          <option value="포인트 미사용">포인트 미사용</option>
          <option value="계정 탈퇴">계정 탈퇴</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onClose(false)}
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={loading}
        >
          취소
        </button>
        <button
          onClick={handleRefundSubmit}
          className="px-4 py-2 bg-orange-500 text-white rounded"
          disabled={loading}
        >
          {loading ? '처리중…' : '환불 신청'}
        </button>
      </div>
    </div>
  );
};

export default MyPointRefund;
