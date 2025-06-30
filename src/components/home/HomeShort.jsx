import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostItCard from '@components/write/PostItCard';
import { useAxios } from '../../hooks/useAxios'
import { useListWriteShortLike } from "../../hooks/useListWriteShortLike";

const HomeShort = () => {
  const axios = useAxios();
  const [answers, setAnswers] = useState([]);
  const { toggleLike } = useListWriteShortLike(setAnswers);

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get('/writeShortList?page=1&size=5');
      const { list: writeShortList } = res.data;
      setAnswers(writeShortList || []);
    } catch (err) {
      console.error('한줄글 목록 불러오기 실패', err);
    }
  };

  const handleReport = (id) => {
    alert('신고가 접수되었습니다.');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {answers.map((answer) => (
            <PostItCard
              key={answer.writeshortId}
              color={answer.color}
              nickname={answer.nickname}
              content={answer.content}
              likes={answer.likes}
              isLiked={answer.isLiked}
              onLikeClick={() => toggleLike(answer.writeshortId)}
              onReportClick={() => handleReport(answer.writeshortId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeShort;
