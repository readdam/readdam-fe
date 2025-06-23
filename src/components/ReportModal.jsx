import React from 'react';
import { XIcon } from 'lucide-react';

const ReportModal = ({
  setShowReportModal,
  reportType,
  setReportType,
  reportContent,
  setReportContent,
  handleSubmitReport,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">신고하기</h3>
          <button onClick={() => setShowReportModal(false)}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-200 rounded-lg"
        >
          <option value="">신고유형을 선택해주세요</option>
          <option value="spam">스팸/도배성 글</option>
          <option value="inappropriate">부적절한 내용</option>
          <option value="copyright">저작권 침해</option>
          <option value="other">기타</option>
        </select>
        <textarea
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
          placeholder="신고 사유(내용)을 작성해주세요"
          className="w-full h-32 p-2 border border-gray-200 rounded-lg mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            onClick={handleSubmitReport}
            className="px-4 py-2 bg-[#E88D67] text-white rounded-lg"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
