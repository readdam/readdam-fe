import { useAxios } from './useAxios';

export const useReport = () => {
  const axios = useAxios();

  const submitReport = async ({
    category,
    categoryId,
    reportedUsername,
    reason,
    content,
  }) => {
    try {
      await axios.post('/my/report', {
        category,
        categoryId,
        reportedUsername,
        reason,
        content,
      });
      return true;
    } catch (error) {
      console.error('❌ 신고 등록 실패', error);
      return false;
    }
  };

  return {
    submitReport,
  };
};
