import React, { useState } from 'react';
import {
  SearchIcon,
  BookOpenIcon,
  HeartIcon,
  TrendingUpIcon,
  StarIcon,
  ChevronDownIcon,
  FilterIcon,
} from 'lucide-react';
const BookPage = () => {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [period, setPeriod] = useState('주간');
  const categories = [
    '전체',
    '소설',
    '에세이',
    '자기계발',
    '경제/경영',
    '인문',
    '역사',
    '과학',
    '예술',
  ];
  const periods = ['일간', '주간', '월간', '연간'];
  const bestsellerBooks = [
    {
      id: 1,
      title: '미움받을 용기',
      author: '기시미 이치로, 고가 후미타케',
      publisher: '인플루엔셜',
      publishDate: '2014.11.17',
      rating: 4.4,
      reviewCount: 152,
      image:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      rank: 1,
    },
    {
      id: 2,
      title: '아비투스',
      author: '송길영',
      publisher: '웅진지식하우스',
      publishDate: '2023.07.19',
      rating: 4.2,
      reviewCount: 98,
      image:
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      rank: 2,
    },
    {
      id: 3,
      title: '역행자',
      author: '자청',
      publisher: '웅진지식하우스',
      publishDate: '2022.05.30',
      rating: 4.6,
      reviewCount: 231,
      image:
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      rank: 3,
    },
    {
      id: 4,
      title: '세이노의 가르침',
      author: '세이노',
      publisher: '데이원',
      publishDate: '2023.02.15',
      rating: 4.8,
      reviewCount: 320,
      image:
        'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      rank: 4,
    },
    {
      id: 5,
      title: '트렌드 코리아 2024',
      author: '김난도 외',
      publisher: '미래의창',
      publishDate: '2023.10.11',
      rating: 4.5,
      reviewCount: 87,
      image:
        'https://images.unsplash.com/photo-1603284569248-821525309698?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      rank: 5,
    },
    {
      id: 6,
      title: '도둑맞은 집중력',
      author: '요한 하리',
      publisher: '어크로스',
      publishDate: '2023.04.28',
      rating: 4.3,
      reviewCount: 112,
      image:
        'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      rank: 6,
    },
    {
      id: 7,
      title: '달러구트 꿈 백화점',
      author: '이미예',
      publisher: '팩토리나인',
      publishDate: '2020.07.08',
      rating: 4.7,
      reviewCount: 275,
      image:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      rank: 7,
    },
    {
      id: 8,
      title: '불편한 편의점',
      author: '김호연',
      publisher: '나무옆의자',
      publishDate: '2021.04.20',
      rating: 4.6,
      reviewCount: 198,
      image:
        'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      rank: 8,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 상단 배너 */}
        <div className="bg-[#006989] rounded-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">읽담 베스트셀러</h1>
              <p className="text-lg opacity-90">
                독자들이 가장 많이 읽고 있는 인기 도서를 만나보세요
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="도서, 작가, 출판사 검색하세요"
                  className="w-full md:w-80 px-4 py-2 pl-10 bg-white/20 border border-white border-opacity-30 rounded-lg focus:outline-none text-white placeholder-white text-opacity-70"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        {/* 필터 섹션 */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category
                      ? 'bg-[#006989] text-white'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">기준:</span>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#006989]"
                >
                  {periods.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <FilterIcon className="w-4 h-4" />
                필터
              </button>
            </div>
          </div>
        </div>
        {/* 베스트셀러 섹션 */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUpIcon className="w-5 h-5 text-[#E88D67]" />
            <h2 className="text-xl font-bold text-gray-800">
              {period} 베스트셀러
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestsellerBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-0 left-0 w-10 h-10 bg-[#E88D67] text-white flex items-center justify-center font-bold">
                    {book.rank}
                  </div>
                  <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full">
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {book.author} | {book.publisher}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-[#E8BD67] fill-[#E8BD67]" />
                      <span className="ml-1 text-sm font-medium">
                        {book.rating}
                      </span>
                    </div>
                    <span className="mx-1 text-gray-400 text-sm">|</span>
                    <span className="text-gray-500 text-sm">
                      리뷰 {book.reviewCount}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-[#006989] text-white text-sm rounded hover:bg-[#005C78]">
                      자세히 보기
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50 relative group"
                      title="서재에 추가" // 툴팁 추가
                    >
                      <BookOpenIcon className="w-5 h-5 text-[#E88D67]" />
                      <span className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                        서재에 추가
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 추천 독서 모임 */}
        <div className="bg-[#F3F7EC] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              이 책들로 진행되는 독서모임
            </h2>
            <a
              href="#"
              className="text-[#006989] hover:text-[#005C78] text-sm font-medium"
            >
              모두 보기
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex gap-3">
                  <img
                    src={bestsellerBooks[i - 1].image}
                    alt="Book cover"
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                      『{bestsellerBooks[i - 1].title}』 함께 읽기
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      매주 토요일 오후 3시
                    </p>
                    <p className="text-xs text-gray-500">
                      참여자 {Math.floor(Math.random() * 10) + 3}/
                      {Math.floor(Math.random() * 5) + 8}명
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default BookPage;
