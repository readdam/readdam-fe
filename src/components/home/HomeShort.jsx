import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostItCard from '@components/write/PostItCard';
import { useAxios } from '../../hooks/useAxios'
import { useListWriteShortLike } from "../../hooks/useListWriteShortLike";
import { useReportModal } from '../../hooks/useReportModal';
import { REPORT_CATEGORY } from '@constants/reportCategory';

const HomeShort = () => {
  const axios = useAxios();
  const [answers, setAnswers] = useState([]);
  const { toggleLike } = useListWriteShortLike(setAnswers);

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get('/shorts?limit=5');
          console.log("✅ 받아온 데이터", res.data);
      const { list: writeShortList } = res.data;
      setAnswers(res.data || []);
    } catch (err) {
      console.error('한줄글 목록 불러오기 실패', err);
    }
  };

  const { openReportModal, ReportModalComponent } = useReportModal({
    defaultCategory: REPORT_CATEGORY.WRITE_SHORT,
    onSuccess: () => {
    },
  });

  const handleReport = (id, username) => {
    openReportModal({
      id,
      username,
    });
  };

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">
            <span role="img" aria-label="flag">🧡</span> 오늘의 한 문장으로 마음을 나눠요!
          </h2>
          <Link
            to="/writeShortList"
            className="text-sm text-gray-500 underline cursor-pointer hover:text-[#006989]"
          >
            읽담한줄 보러가기
          </Link>
        </div>

        {/* 카드 리스트 */}
        {answers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            등록된 글이 없습니다. 이달의 첫 문장을 작성해보세요.
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {answers.map((answer) => (
            <PostItCard
              key={answer.writeshortId}
              color={answer.color}
              nickname={answer.nickname}
              content={answer.content}
              likes={answer.likes}
              isLiked={answer.isLiked}
              onLikeClick={() => toggleLike(answer.writeshortId)}
              onReportClick={() => handleReport(answer.writeshortId, answer.username)}
            />
          ))}
        </div>
        )}
        {ReportModalComponent}
      </div>
    </div>
  );
};

export default HomeShort;
