import { useState } from 'react';
import ReportModal from '../components/ReportModal';
import { useReport } from './useReport';
import { useAtom } from 'jotai';
import { tokenAtom } from '../atoms';
import { useNavigate } from 'react-router-dom';

export const useReportModal = ({ defaultCategory, onSuccess }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [category, setCategory] = useState(defaultCategory);
  const [reportType, setReportType] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [token] = useAtom(tokenAtom);
  const navigate = useNavigate();
  const [target, setTarget] = useState({
    id: null,
    username: null,
    category: defaultCategory,
  });

  const { submitReport } = useReport();

  const openReportModal = (targetInfo, categoryOverride) => {
    if (!token?.access_token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    setTarget({
      id: targetInfo.id,
      username: targetInfo.username,
      category: categoryOverride || defaultCategory,
    });

    setCategory(categoryOverride || defaultCategory);
    setReportType('');
    setReportContent('');
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportType) {
      alert('신고 유형을 선택해주세요');
      return;
    }
    if (!reportContent.trim()) {
      alert('신고 사유를 입력해주세요');
      return;
    }
    const success = await submitReport({
      category: target.category,   
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
        targetCategory={target.category}
        targetCategoryId={target.id}
        reportedUsername={target.username}
        handleRefresh={handleReportSubmit}
      />
    ) : null,
  };
};
