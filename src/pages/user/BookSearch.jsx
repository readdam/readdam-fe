import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchBook } from '@api/kakaoApi';
import AddToLibraryModal from '@components/book/AddToLibraryModal';
import { SearchIcon, StarIcon, HeartIcon } from 'lucide-react';

export default function BookSearch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('query') || '한강';
  const page = parseInt(searchParams.get('page')) || 1;
  const target = searchParams.get('target') || '';
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [targetInput, setTargetInput] = useState(target); // ✅ select 입력값용 상태

  const totalPages = Math.ceil(totalCount / 10);
  const visiblePages = 5;
  const startPage = Math.floor((page - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  const { data, isLoading } = useQuery({
    queryKey: ['search_book', searchTerm, page, target],
    queryFn: () => searchBook({ query: searchTerm, page, size: 10, target }),
    enabled: !!searchTerm,
  });

  useEffect(() => {
    if (data) {
      setBooks(data.documents);
      setTotalCount(data.meta.pageable_count);
    }
  }, [data]);

  const onSearch = () => {
    setSearchParams({ query: searchInput, page: 1, target: targetInput });
  };

  const toggleLike = (key) => {
    setLikedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 pt-20 pb-20 text-sm font-sans">
        {/* 검색창 */}
        <div className="flex items-center space-x-2 mb-8">
          <select
            className="border px-2 h-10 rounded text-sm text-gray-700"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
          >
            <option value="">전체 카테고리</option>
            <option value="title">제목</option>
            <option value="person">저자</option>
            <option value="publisher">출판사</option>
          </select>
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border border-[#E88D67] rounded pl-8 h-10 pr-4 text-sm focus:outline-none "
            />
          </div>
          <button
            className="bg-[#E88D67] text-white w-16 h-10 rounded text-sm cursor-pointer"
            onClick={onSearch}
          >
            검색
          </button>
        </div>

        {/* 검색 결과 */}
        <div className="text-[16px] mb-4 font-bold">
          <span className="text-[#E88D67]">‘{searchTerm}’</span> 검색결과
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">로딩 중...</div>
        ) : (
          books.map((book, index) => {
            const bookKey = book.isbn || `${book.title}-${index}`;
            const isLiked = likedMap[bookKey];

            return (
              <div
                key={bookKey}
                className="flex items-start py-8 gap-4 border-b border-[#D9D9D9] relative"
              >
                <img
                  src={
                    book.thumbnail ||
                    'https://via.placeholder.com/120x174?text=No+Image'
                  }
                  alt={book.title}
                  className="object-cover w-[120px] h-[174px]"
                />
                <div className="flex flex-col text-sm text-gray-800 flex-grow">
                  <div className="font-bold text-base mb-1">{book.title}</div>
                  <div className="mb-1">저자 | {book.authors?.join(', ')}</div>
                  <div className="mb-1">출판 | {book.publisher}</div>
                  <div className="mb-1">
                    발행 | {book.datetime?.split('T')[0]}
                  </div>

                  <div className="flex items-center text-[#E88D67] mb-2 text-sm">
                    <StarIcon className="w-4 h-4 text-[#E88D67] fill-[#E88D67] mr-2" />
                    <span className="text-black">4.4</span>
                    <span className="text-gray-600 ml-1">(152)</span>
                  </div>

                  <HeartIcon
                    className={`w-6 h-6 ${
                      isLiked
                        ? 'fill-[#E88D67] text-[#E88D67]'
                        : 'text-gray-400'
                    } absolute top-8 right-8`}
                    onClick={() => toggleLike(bookKey)}
                  />
                  <button
                    className="bg-[#006989] text-white w-24 h-10 rounded-lg text-xs font-bold cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    서재에 담기
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            {startPage > 1 && (
              <button
                onClick={() =>
                  setSearchParams({
                    query: searchTerm,
                    page: startPage - 1,
                    target,
                  })
                }
                className="border border-[#e5e7eb] px-3 py-1 rounded"
              >
                이전
              </button>
            )}
            {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
              const pageNumber = startPage + idx;
              return (
                <button
                  key={pageNumber}
                  className={`px-3 py-1 text-sm border rounded ${
                    pageNumber === page
                      ? 'bg-[#006989] text-white border-[#006989]'
                      : 'hover:bg-gray-50'
                  } border-[#e5e7eb]`}
                  onClick={() =>
                    setSearchParams({
                      query: searchTerm,
                      page: pageNumber,
                      target,
                    })
                  }
                >
                  {pageNumber}
                </button>
              );
            })}
            {endPage < totalPages && (
              <button
                onClick={() =>
                  setSearchParams({
                    query: searchTerm,
                    page: endPage + 1,
                    target,
                  })
                }
                className="border border-[#e5e7eb] px-3 py-1 rounded"
              >
                다음
              </button>
            )}
          </nav>
        </div>
      </div>

      {isModalOpen && (
        <AddToLibraryModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
