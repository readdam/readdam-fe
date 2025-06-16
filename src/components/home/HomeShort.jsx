import React, { useState } from 'react';
import {
  HeartIcon,
  MessageSquareIcon,
  ClockIcon,
  PenIcon,
} from 'lucide-react';
import singoIcon from '@assets/singo.png';

const HomeShort = () => {

  const dummyAnswers = [
    { id: 1, author: '책벌레123', content: '삶이 그대를 속일지라도 슬퍼하거나 노하지 말라...', likes: 12, color: 'mint' },
    { id: 2, author: '독서광89', content: '우리는 우리가 꿈꾸는 세상을 만들어 갈 수 있다', likes: 8, color: 'yellow' },
    { id: 3, author: '문학소녀', content: '지나간 시간은 다시 돌아오지 않는다...', likes: 15, color: 'mint' },
    { id: 4, author: '책읽는밤', content: '별을 따려면 하늘 높이 올라가야 한다', likes: 10, color: 'pink' },
  ];

  const getPostItColor = (color) => {
    switch (color) {
      case 'mint': return 'bg-[#E8F3F1]';
      case 'yellow': return 'bg-[#FFF8E7]';
      case 'pink': return 'bg-[#FFE8F3]';
      default: return 'bg-[#E8F3F1]';
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
          <p className="text-sm text-gray-500 underline cursor-pointer hover:text-[#006989]">
            읽담한줄 보러가기
          </p>
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyAnswers.map((answer) => (
            <div
              key={answer.id}
              className={`${getPostItColor(answer.color)} aspect-square p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow relative transform hover:-rotate-1 hover:translate-y-[-2px]`}
              style={{
                boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-medium text-gray-800">{answer.author}</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <HeartIcon className="w-4 h-4" />
                  <span>{answer.likes}</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm line-clamp-5 mb-6">{answer.content}</p>
              <button
                onClick={() => handleReport(answer.id)}
                className="absolute bottom-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <img src={singoIcon} alt="신고" className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeShort;
