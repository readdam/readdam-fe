// src/pages/BookPage.jsx
import React, { useState, useEffect } from 'react';
import {
  SearchIcon,
  BookOpenIcon,
  TrendingUpIcon,
  StarIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';

const BookPage = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  /** 기간: 일간·주간·월간 ― 기본값은 일간 */
  const [period, setPeriod] = useState('일간');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);

  const periods = ['일간', '주간', '월간'];

  /* ---------------- 데이터 로드 ---------------- */
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data } = await axios.get('/api/books/bestsellers', {
          params: { period },
        });
        setBooks(data);
      } catch (err) {
        console.error('베스트셀러 조회 실패', err);
        setBooks([]);
      }
    };
    fetchBestsellers();
  }, [period, axios]);

  /* ---------------- 렌더링 ---------------- */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* ── 상단 배너 ── */}
        <div className="rounded-lg py-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">읽담 베스트셀러</h1>
              <p className="text-lg opacity-90">
                독자들이 가장 많이 읽고 있는 인기 도서를 만나보세요
              </p>
            </div>

            {/* 검색창 */}
            <form
              className="mt-4 md:mt-0"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(
                  `/bookSearch?query=${encodeURIComponent(searchQuery)}&page=1`
                );
              }}
            >
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="도서, 작가, 출판사 검색하세요"
                    className="w-full md:w-80 px-4 py-2 pl-10 bg-white/20 border border-[#E88D67] border-opacity-30 rounded focus:outline-none text-opacity-70"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                </div>
                <button
                  type="submit"
                  className="bg-[#E88D67] hover:bg-[#d97850] text-white font-semibold px-4 py-2 rounded transition whitespace-nowrap"
                >
                  검색
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── 베스트셀러 목록 ── */}
        <div className="mb-12">
          {/* 헤더(타이틀 + 드롭다운) */}
          <div className="flex items-center gap-4 mb-6">
            <TrendingUpIcon className="w-5 h-5 text-[#E88D67]" />
            <h2 className="text-xl font-bold text-gray-800">
              {period} 베스트셀러
            </h2>

            {/* 기준 드롭다운 */}
            <div className="ml-auto flex items-center gap-1">
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
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 도서 카드 그리드 */}
          {books.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              표시할 도서가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book, idx) => (
                <div
                  key={book.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* 썸네일 */}
                  <div className="relative">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-0 left-0 w-10 h-10 bg-[#E88D67] text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                  </div>

                  {/* 정보 */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {book.author} | {book.publisher}
                    </p>

                    {/* 평점·리뷰 수 */}
                    <div className="flex items-center mb-4">
                      <StarIcon className="w-4 h-4 text-[#E8BD67] fill-[#E8BD67]" />
                      <span className="ml-1 text-sm font-medium">
                        {book.rating?.toFixed(1) ?? '0.0'}
                      </span>
                      <span className="mx-1 text-gray-400 text-sm">|</span>
                      <span className="text-gray-500 text-sm">
                        리뷰 {book.reviewCount ?? 0}
                      </span>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 bg-[#006989] text-white text-sm rounded hover:bg-[#005C78]"
                        onClick={() => navigate(`/bookDetail/${book.id}`)}
                      >
                        자세히 보기
                      </button>
                      <button
                        className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50 relative group"
                        title="서재에 추가"
                      >
                        <BookOpenIcon className="w-5 h-5 text-[#E88D67]" />
                        <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                          서재에 추가
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookPage;
