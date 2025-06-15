import React from 'react'
import {
  ThumbsUpIcon,
  MessageSquareIcon,
  EyeIcon,
  SearchIcon,
  PenIcon,
  BookOpenIcon,
  ClockIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const WriteList = () => {
  const navigate = useNavigate()

  const dummyPosts = [
    {
      id: 1,
      category: '독후감',
      subCategory: '첨삭가능',
      title: '미움받을 용기를 읽고 나서: 아들러 심리학의 통찰',
      author: 'reader123',
      date: '2023-11-10',
      timeAgo: '2일 3시간',
      likes: 24,
      comments: 12,
      views: 156,
      thumbnail:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
      id: 2,
      category: '자기소개서',
      subCategory: '첨삭진행중',
      title: '2024 교육대학원 지원 자기소개서',
      author: 'future_teacher',
      date: '2023-11-09',
      timeAgo: '5일',
      likes: 15,
      comments: 8,
      views: 98,
      thumbnail: null,
    },
  ]

  return (
    <div className="w-full min-h-screen bg-[#F9F9F7] py-8">
      <div className="container mx-auto px-4">
        {/* 탭 메뉴 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-6">
            <button className="text-xl font-bold text-[#006989]">전체 글</button>
            <button
              onClick={() => navigate('/writeShortList')}
              className="text-xl font-bold text-gray-400"
            >
              읽담한줄
            </button>
          </div>
          <button className="px-6 py-2.5 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center">
            <PenIcon className="w-5 h-5 mr-2" />
            글쓰기
          </button>
        </div>

        {/* 필터 및 검색 영역 */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]">
            <option>전체 카테고리</option>
            <option>독후감</option>
            <option>자기소개서</option>
            <option>수필</option>
            <option>기타</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]">
            <option>전체 상태</option>
            <option>첨삭 가능</option>
            <option>첨삭 종료</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]">
            <option>최신순</option>
            <option>첨삭댓글순</option>
            <option>조회순</option>
          </select>
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="글 제목, 키워드로 검색"
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:bg-[#E88D67] rounded hover:opacity-90">
              검색
            </button>
          </div>
        </div>

        {/* 글 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg p-4 flex gap-4 hover:shadow-sm transition-shadow"
            >
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt=""
                  className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-48 h-48 bg-[#F3D5C9] rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="w-12 h-12 text-[#E88D67]" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 text-sm rounded-full bg-[#F3F7EC] text-[#006989]">
                    {post.category}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-[#FDF3F0] text-[#E88D67]">
                    {post.subCategory}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium text-[#006989]">{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUpIcon className="w-4 h-4 text-[#E88D67]" />
                    {post.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquareIcon className="w-4 h-4 text-[#006989]" />
                    {post.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {post.views}
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <ClockIcon className="w-4 h-4" />
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50">
            더보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default WriteList;
