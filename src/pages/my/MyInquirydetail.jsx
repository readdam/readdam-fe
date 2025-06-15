import React from 'react';
import { X } from 'lucide-react'; // ❌ 아이콘 (lucide-react 설치되어 있어야 함)

const MyInquiryDetail = ({ onClose, inquiry }) => {
    return (
        <div className="relative max-w-2xl mx-auto px-4 py-10">
            {/* 오른쪽 상단 X */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center mb-8">관리자에게 문의</h2>

            {/* 문의 사유 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">문의 사유</label>
                <input
                    type="text"
                    className="w-full border rounded-md p-2 bg-gray-100"
                    value={inquiry.category}
                    readOnly
                />
            </div>

            {/* 제목 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                    type="text"
                    className="w-full border rounded-md p-2 bg-gray-100"
                    value={inquiry.title}
                    readOnly
                />
            </div>

            {/* 내용 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                    className="w-full h-40 border rounded-md p-2 bg-gray-100"
                    value={inquiry.content}
                    readOnly
                />
            </div>

            {/* 답변 */}
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">답변</label>
                <textarea
                    placeholder="문의 내용을 자세히 입력해 주세요"
                    className="w-full h-40 border rounded-md p-2 bg-gray-100 text-gray-500"
                    value={inquiry.answer}
                    readOnly
                />
            </div>

            {/* 안내문구 */}
            <p className="text-xs text-gray-400 mt-2">문자 확인 후 24시간 이내 답변될 예정입니다.</p>

            {/* 하단 버튼 */}
            <div className="mt-8 flex justify-center gap-4">
                <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 text-sm">
                    삭제하기
                </button>
                <button
                    onClick={onClose}
                    className="bg-orange-100 text-orange-600 px-6 py-2 rounded-md hover:bg-orange-200 text-sm"
                >
                    목록으로
                </button>
            </div>
        </div>
    );
};

export default MyInquiryDetail;
