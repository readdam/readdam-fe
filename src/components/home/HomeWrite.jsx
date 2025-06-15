import React from 'react'
import {
  BookOpenIcon,
  ThumbsUpIcon,
  MessageSquareIcon,
  EyeIcon,
  FilterIcon,
  SearchIcon,
  PenIcon,
} from 'lucide-react'
const HomeWrite = () => {
  const reviews = [
    {
      id: 1,
      thumbnailType: '업로드 이미지',
      title: '미움받을 용기를 읽고',
      category: '독후감',
      content: '아들러의 심리학을 통해 본 삶의 태도와 용기에 대한 생각...',
      author: '책벌레123',
      tags: ['#독후감', '#자기계발', '#심리학'],
      likes: 12,
      comments: 4,
      reviewStatus: '첨삭진행중',
      reviewEndTime: '첨삭 마감까지 2일 3시간',
      wordCount: '본문 미리보기 80자',
    },
    {
      id: 2,
      thumbnailType: '북커버',
      title: '2024 대학원 자기소개서',
      category: '자기소개서',
      content: '교육 심리학 전공 지원 동기와 학업 계획서...',
      author: '꿈나무22',
      tags: ['#자기소개서', '#대학원', '#교육'],
      likes: 8,
      comments: 2,
      reviewStatus: '첨삭가능',
      reviewEndTime: '첨삭 마감까지 5일',
      wordCount: '본문 미리보기 120자',
    },
  ]
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          최신 글 모아보기
        </h2>
        <p className="text-center text-gray-600 mb-8">
          글을 공유하고 첨삭 받을 수 있어요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 상단 정보 */}
              <div className="flex justify-between items-start mb-3">
                <span className="inline-block px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full">
                  {review.category}
                </span>
                <span className="text-sm text-gray-500">
                  {review.thumbnailType}
                </span>
              </div>
              {/* 제목 및 내용 */}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {review.title}
              </h3>
              <p className="text-gray-600 mb-3 text-sm">{review.content}</p>
              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {review.tags.map((tag, index) => (
                  <span key={index} className="text-sm text-[#006989]">
                    {tag}
                  </span>
                ))}
              </div>
              {/* 하단 정보 */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-[#006989]">
                    {review.author}
                  </span>
                  <div className="flex items-center space-x-3 text-gray-500">
                    <div className="flex items-center">
                      <ThumbsUpIcon className="w-4 h-4 mr-1 text-[#E88D67]" />
                      <span>{review.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquareIcon className="w-4 h-4 mr-1 text-[#006989]" />
                      <span>{review.comments}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm ${review.reviewStatus === '첨삭가능' ? 'text-[#E88D67]' : 'text-gray-500'}`}
                  >
                    {review.reviewStatus}
                  </span>
                  <span className="text-sm text-gray-500">
                    {review.reviewEndTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default HomeWrite
