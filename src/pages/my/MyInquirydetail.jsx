import React from 'react';
import { X } from 'lucide-react';

const MyInquiryDetail = ({ inquiry, onClose, onEdit }) => {
  const isAnswered = inquiry.status === 'ANSWERED';

  return (
    <div className="relative max-w-2xl mx-auto px-4 py-10">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X size={20} />
      </button>
      <h2 className="text-xl font-bold text-center mb-8">관리자에게 문의</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">문의 사유</label>
        <input type="text" className="w-full border rounded-md p-2 bg-gray-100" value={inquiry.reason} readOnly/>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">제목</label>
        <input type="text" className="w-full border rounded-md p-2 bg-gray-100" value={inquiry.title} readOnly/>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">내용</label>
        <textarea className="w-full h-40 border rounded-md p-2 bg-gray-100" value={inquiry.content} readOnly/>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">답변</label>
        <textarea placeholder="아직 답변이 등록되지 않았습니다." className="w-full h-40 border rounded-md p-2 bg-gray-100 text-gray-500" value={inquiry.answer || ''} readOnly/>
      </div>

      {!isAnswered && <p className="text-xs text-gray-400 mt-2">문의 확인 후 24시간 이내 답변될 예정입니다.</p>}

      <div className="mt-8 flex justify-center gap-4">
        {!isAnswered && <button onClick={() => onEdit(inquiry)} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 text-sm">수정하기</button>}
        <button onClick={onClose} className="bg-orange-100 text-orange-600 px-6 py-2 rounded-md hover:bg-orange-200 text-sm">목록으로</button>
      </div>
    </div>
  );
};

export default MyInquiryDetail;
