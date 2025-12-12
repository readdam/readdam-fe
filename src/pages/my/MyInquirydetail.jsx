// src/pages/my/MyInquiryDetail.jsx
import React from 'react';
import { X } from 'lucide-react';

const MyInquiryDetail = ({ inquiry, onClose, onEdit }) => {
  const isAnswered = inquiry.status === 'ANSWERED';

  return (
    <div className="relative px-4 pt-4 pb-6">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      {/* 제목 영역: mb-4로 간격 줄임 */}
      <h2 className="text-xl font-semibold text-center mb-4">관리자에게 문의</h2>

      {/* 문의 사유 */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">문의 사유</label>
        <input
          type="text"
          value={inquiry.reason}
          readOnly
          className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
        />
      </div>

      {/* 제목 */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          type="text"
          value={inquiry.title}
          readOnly
          className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
        />
      </div>

      {/* 내용 */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">내용</label>
        <textarea
          value={inquiry.content}
          readOnly
          className="w-full h-48 border border-gray-300 rounded-md p-3 bg-gray-50 resize-none"
        />
      </div>

      {/* 답변 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">답변</label>
        <textarea
          value={inquiry.answer || ''}
          readOnly
          placeholder="아직 답변이 등록되지 않았습니다."
          className="w-full h-48 border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-500 resize-none"
        />
      </div>

      {!isAnswered && (
        <p className="text-xs text-gray-500 mb-6">
          문의 확인 후 24시간 이내 답변될 예정입니다.
        </p>
      )}

      {/* 버튼 영역: mt-12로 아래로 내림 */}
      <div className="flex justify-center gap-4 mt-12">
                <button
          onClick={onClose}
          className="px-6 py-2 rounded-md bg-[#E88D67] text-white hover:bg-[#D77C5A] focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
        >
          목록으로
        </button>
        {!isAnswered && (
          <button
            onClick={() => onEdit(inquiry)}
            className="px-6 py-2 rounded-md bg-[#006989] text-white hover:bg-[#005f78] focus:outline-none focus:ring-2 focus:ring-[#005f78] text-sm"
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
};

export default MyInquiryDetail;
