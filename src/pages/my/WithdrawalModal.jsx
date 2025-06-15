import React, { useState } from 'react';

const WithdrawalModal = ({ isOpen, onClose }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const reasons = [
        '서비스 불만족',
        '필요한 기능이 없음',
        '유사 서비스 이용중',
        '기타',
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-gray-800/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md max-w-md w-full shadow-lg text-black">
                <h2 className="text-lg font-semibold text-center mb-1">정말 탈퇴 하시겠어요?</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    탈퇴 시에도 활동한 내역들은 유지되지만 다시 복구할 수 없습니다
                </p>

                <div className="border p-4 rounded-md mb-6">
                    <p className="font-medium mb-3">탈퇴 사유</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        {reasons.map((item, idx) => (
                            <label key={idx} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="withdrawalReason"
                                    value={item}
                                    onChange={() => setReason(item)}
                                    className="accent-blue-500"
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="bg-teal-800 text-white px-5 py-2 rounded-md"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => {
                            if (!reason) return alert('탈퇴 사유를 선택해주세요.');
                            // 여기서 탈퇴 요청 로직 호출
                            console.log('탈퇴 사유:', reason);
                            onClose(); // 탈퇴 완료 후 닫기
                        }}
                        className="bg-gray-100 border px-5 py-2 rounded-md text-gray-800"
                    >
                        탈퇴하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalModal;
