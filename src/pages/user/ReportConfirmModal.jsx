// src/pages/user/ReportConfirmModal.jsx
import React from 'react';

const ReportConfirmModal = ({ setShowReportConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center">
        <p className="mb-4">신고글이 등록되었습니다.</p>
        <button
          onClick={() => setShowReportConfirm(false)}
          className="px-4 py-2 bg-[#006989] text-white rounded-lg"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ReportConfirmModal;
