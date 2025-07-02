import React from 'react';
import { XIcon } from 'lucide-react';
import { useAxios } from '../hooks/useAxios';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';

const ReportModal = ({
  setShowReportModal,
  reportType,            // spam, inappropriate 등
  setReportType,
  reportContent,         // 상세 사유 입력값
  setReportContent,
  targetCategory,        // e.g. "place_review", "write" 등
  targetCategoryId,      // 해당 콘텐츠 PK
  reportedUsername,          // 신고 대상 유저의 PK
  handleRefresh,         // 제출 후 리스트 갱신
}) => {
  const axios = useAxios();
  const user = useAtomValue(userAtom);

  const handleSubmitReport = async () => {
    if (!reportType) {
      return alert('신고 유형을 선택해주세요');
    }
    if (!reportContent.trim()) {
      return alert('신고 사유를 입력해주세요');
    }

    const payload = {
      category: targetCategory,
      categoryId: String(targetCategoryId),
      reason: reportType,
      content: reportContent,
      reportedUsername: reportedUsername,
    };

    try {
      await axios.post('/my/report', payload);
      setShowReportModal(false);
      alert('신고가 완료되었습니다.');
      handleRefresh && handleRefresh();
    } catch (err) {
      console.error(err);
      alert('신고 제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
          className="w-full mb-4 p-2 border rounded-lg"
        >
          <option value="">신고유형을 선택해주세요</option>
          <option value="spam">스팸/도배</option>
          <option value="inappropriate">부적절한 내용</option>
          <option value="copyright">저작권 침해</option>
          <option value="other">기타</option>
        </select>

        <textarea
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
          placeholder="상세 사유를 작성해주세요"
          className="w-full h-32 p-2 border rounded-lg mb-4"
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
