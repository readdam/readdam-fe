import React, { useState } from 'react'
import {
  SearchIcon,
  XCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  BookIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  EyeIcon,
} from 'lucide-react'
const SearchResult = () => {
  const [searchKeyword, setSearchKeyword] = useState('심리')
  const [sortOption, setSortOption] = useState('latest')
  // 더미 데이터 - 일부는 빈 배열로 설정하여 "결과 없음" 케이스 표시
  const meetingResults = [
    {
      id: 1,
      title: '심리학 명저 함께 읽기',
      date: '2023.11.20',
      location: '서울 마포구',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765',
    },
    {
      id: 2,
      title: '심리 수업: 일상 속 마음 들여다보기',
      date: '2023.11.25',
      location: '서울 강남구',
      image: 'https://images.unsplash.com/photo-1513001900722-370f803f498d',
    },
  ]
  const spaceResults = [] // 빈 결과 케이스
  const postResults = [
    {
      id: 1,
      title: '미움받을 용기를 읽고: 아들러 심리학의 통찰',
      author: 'reader123',
      date: '2023.11.10',
      category: '독후감',
      likes: 24,
      comments: 12,
      views: 156,
      thumbnail:
        'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788996991342.jpg',
    },
  ]
  const bookResults = [] // 빈 결과 케이스
  const handleClearSearch = () => {
    setSearchKeyword('')
  }
  // 섹션 컴포넌트
  const ResultSection = ({ title, count, children, onViewMore }) => (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500">({count})</span>
        </div>
        {count > 0 && (
          <button
            onClick={onViewMore}
            className="flex items-center text-sm text-[#006989] hover:text-[#005C78]"
          >
            더보기
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      {count === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          '{searchKeyword}'와 관련된 {title} 결과가 없습니다. 키워드를
          바꿔보세요.
        </div>
      ) : (
        children
      )}
    </section>
  )
  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 상단 검색 영역 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            {/* 정렬 옵션 */}
            <div className="flex justify-between items-center">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 min-w-[140px]"
              >
                <option value="latest">최신순</option>
                <option value="recommended">추천순</option>
              </select>
            </div>
            {/* 검색바 */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-[#E88D67] rounded-lg focus:outline-none focus:border-[#E88D67]"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <XCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#006989] flex items-center"
              >
                검색 초기화
              </button>
            </div>
          </div>
        </div>
        {/* 모임 결과 */}
        <ResultSection
          title="모임"
          count={meetingResults.length}
          onViewMore={() => console.log('모임 더보기')}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meetingResults.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={meeting.image}
                    alt={meeting.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {meeting.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{meeting.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{meeting.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ResultSection>
        {/* 장소 결과 */}
        <ResultSection
          title="장소"
          count={spaceResults.length}
          onViewMore={() => console.log('장소 더보기')}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spaceResults.map((space) => (
              <div
                key={space.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {space.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <span>{space.location}</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${space.isAvailable ? 'bg-[#F3F7EC] text-[#006989]' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {space.isAvailable ? '예약가능' : '예약마감'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ResultSection>
        {/* 글 결과 */}
        <ResultSection
          title="글"
          count={postResults.length}
          onViewMore={() => console.log('글 더보기')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {postResults.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  <div className="w-1/3 h-48">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E88D67] flex items-center justify-center">
                        <BookIcon className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="w-2/3 p-6">
                    <span className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-semibold my-2 text-gray-800">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="font-medium text-[#006989]">
                        {post.author}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ThumbsUpIcon className="w-4 h-4 mr-1 text-[#E88D67]" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquareIcon className="w-4 h-4 mr-1 text-[#006989]" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ResultSection>
        {/* 책 결과 */}
        <ResultSection
          title="책"
          count={bookResults.length}
          onViewMore={() => console.log('책 더보기')}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {bookResults.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                  <p className="text-sm text-gray-500">{book.publisher}</p>
                </div>
              </div>
            ))}
          </div>
        </ResultSection>
      </div>
    </div>
  )
}
export default SearchResult
