import { useState } from 'react';
import ReportModal from '../components/ReportModal';
import { useReport } from './useReport';

export const useReportModal = ({ defaultCategory, onSuccess }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [target, setTarget] = useState({
    id: null,
    username: null,
  });

  const { submitReport } = useReport();

  const openReportModal = (answer) => {
    setTarget({
      id: answer.writeshortId,
      username: answer.username,
    });
    setReportType('');
    setReportContent('');
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    const success = await submitReport({
      category: defaultCategory,
      categoryId: String(target.id),
      reportedUsername: target.username,
      reason: reportType,
      content: reportContent,
    });

    if (success) {
      setShowReportModal(false);
      alert('신고가 완료되었습니다.');
      onSuccess && onSuccess();
    } else {
      alert('신고 제출 중 오류가 발생했습니다.');
    }
  };

  return {
    openReportModal,
    ReportModalComponent: showReportModal ? (
      <ReportModal
        setShowReportModal={setShowReportModal}
        reportType={reportType}
        setReportType={setReportType}
        reportContent={reportContent}
        setReportContent={setReportContent}
        targetCategory={defaultCategory}
        targetCategoryId={target.id}
        reportedUsername={target.username}
        handleRefresh={handleReportSubmit}
      />
    ) : null,
  };
};
