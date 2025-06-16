import React, { useState } from 'react';

const mockRefundablePoints = [
    { id: 1, amount: 500, date: '2024.01.15' },
    { id: 2, amount: 500, date: '2024.01.11' },
];

const MyPointRefund = ({ onClose }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [reason, setReason] = useState('');

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleRefundSubmit = () => {
        if (selectedIds.length === 0 || !reason) {
            alert('환불 항목과 사유를 선택해주세요.');
            return;
        }

        alert('환불 신청이 접수되었습니다.');
        onClose();
    };

    return (
        <div className="bg-white w-full max-w-md p-6 rounded shadow-lg border border-blue-300 relative">
            {/* X 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
                aria-label="닫기"
            >
                &times;
            </button>

            <h2 className="text-lg font-bold mb-4">포인트 환불 신청</h2>

            <div className="mb-4 space-y-2">
                {mockRefundablePoints.map(item => (
                    <label key={item.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelection(item.id)}
                        />
                        <span className="text-green-600 font-medium">+{item.amount}P</span>
                        <span className="text-sm text-gray-600">포인트 충전</span>
                        <span className="ml-auto text-sm text-gray-400">{item.date}</span>
                    </label>
                ))}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">환불 사유 *</label>
                <select
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">환불 사유를 선택하세요</option>
                    <option value="서비스 불만족">서비스 불만족</option>
                    <option value="포인트 미사용">포인트 미사용</option>
                    <option value="계정 탈퇴">계정 탈퇴</option>
                    <option value="기타">기타</option>
                </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 p-3 rounded mb-4">
                <p className="mb-1">• 환불 처리는 영업일 기준 3~5일 소요됩니다.</p>
                <p className="mb-1">• 결제 수수료는 별도 차감될 수 있습니다.</p>
                <p className="mb-1">• 환불은 실제 결제 금액을 기준으로 처리됩니다.</p>
                <p>• 환불된 포인트로 인한 미사용 시 자동 소멸됩니다.</p>
            </div>

            <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">취소</button>
                <button
                    onClick={handleRefundSubmit}
                    className="px-4 py-2 bg-orange-500 text-white rounded"
                >
                    환불 신청
                </button>
            </div>
        </div>
    );
};

export default MyPointRefund;
