import React, { useState } from 'react';
import { LockIcon, ImageIcon, StarIcon, SendIcon, MessageCircleIcon } from 'lucide-react';
const GroupQnAReviews = () => {
  const [activeTab, setActiveTab] = useState('qna');
  const [showPrivate, setShowPrivate] = useState(false);
  const [rating, setRating] = useState(0);
  // Dummy data
  const qnas = [{
    id: 1,
    user: {
      nickname: 'stargazer',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3'
    },
    date: '2024.01.15',
    content: '4회차 모임은 몇 명까지 참여 가능한가요?',
    isPrivate: true,
    answer: {
      content: '현재 기준으로 2자리 남아있습니다. 얼른 신청해주세요!',
      date: '2024.01.15'
    }
  }
  // Add more Q&As...
  ];
  const reviews = [{
    id: 1,
    user: {
      nickname: '우주마녀',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3'
    },
    date: '2024.01.20',
    rating: 5,
    content: '어려울 것만 같았던 우주 이야기를 이렇게 재미있게 들을 수 있어서 좋았어요. 특히 블랙홀에 대한 설명이 인상적이었습니다.',
    images: ['https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3']
  }
  // Add more reviews...
  ];
  return <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex border-b border-gray-200 mb-6">
        <button className={`py-4 px-6 font-medium ${activeTab === 'qna' ? 'text-[#006989] border-b-2 border-[#006989]' : 'text-gray-500'}`} onClick={() => setActiveTab('qna')}>
          모임 Q&A
        </button>
        <button className={`py-4 px-6 font-medium ${activeTab === 'reviews' ? 'text-[#006989] border-b-2 border-[#006989]' : 'text-gray-500'}`} onClick={() => setActiveTab('reviews')}>
          모임 참여회원 리뷰
        </button>
      </div>
      {activeTab === 'qna' ? <div>
          <div className="mb-6">
            <textarea className="w-full p-4 border border-gray-300 rounded-lg resize-none mb-2" rows={3} placeholder="모임에 대해 궁금한 점을 물어보세요" />
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" checked={showPrivate} onChange={e => setShowPrivate(e.target.checked)} className="mr-2" />
                모임장에게만 보이기
                <LockIcon className="w-4 h-4 ml-1" />
              </label>
              <button className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
                등록
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {qnas.map(qna => <div key={qna.id} className="border-b border-gray-100 pb-6">
                <div className="flex items-start gap-4 mb-4">
                  <img src={qna.user.image} alt={qna.user.nickname} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{qna.user.nickname}</span>
                      <span className="text-sm text-gray-500">{qna.date}</span>
                      {qna.isPrivate && <LockIcon className="w-4 h-4 text-gray-400" />}
                    </div>
                    <p className="text-gray-600">{qna.content}</p>
                  </div>
                </div>
                {qna.answer && <div className="ml-14 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircleIcon className="w-4 h-4 text-[#006989]" />
                      <span className="text-sm text-gray-500">
                        {qna.answer.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{qna.answer.content}</p>
                  </div>}
              </div>)}
          </div>
        </div> : <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => setRating(star)} className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                  <StarIcon className="w-6 h-6 fill-current" />
                </button>)}
            </div>
            <textarea className="w-full p-4 border border-gray-300 rounded-lg resize-none mb-2" rows={3} placeholder="모임에 대한 리뷰를 작성해주세요" />
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ImageIcon className="w-5 h-5" />
                이미지 첨부
              </button>
              <button className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
                등록
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {reviews.map(review => <div key={review.id} className="border-b border-gray-100 pb-6">
                <div className="flex items-start gap-4">
                  <img src={review.user.image} alt={review.user.nickname} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {review.user.nickname}
                      </span>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({
                  length: review.rating
                }).map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-gray-600 mb-4">{review.content}</p>
                    {review.images && review.images.length > 0 && <div className="flex gap-2">
                        {review.images.map((image, index) => <img key={index} src={image} alt={`Review image ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />)}
                      </div>}
                  </div>
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
};
export default GroupQnAReviews;