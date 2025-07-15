import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLikeList, searchBook, toggleBookLike } from '@api/kakaoApi';
import AddToLibraryModal from '@components/book/AddToLibraryModal';
import { SearchIcon, StarIcon, HeartIcon } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import LibraryModal from '@components/book/LibraryModal';

export default function BookSearch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('query') || '한강';
  const page = parseInt(searchParams.get('page')) || 1;
  const target = searchParams.get('target') || '';
  const sort = searchParams.get('sort') || 'accuracy'; // ✅ 기본값 적용
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [targetInput, setTargetInput] = useState(target); // ✅ select 입력값용 상태
  const [sortInput, setSortInput] = useState(sort); // ✅ 추가
  const token = useAtomValue(tokenAtom);

  const totalPages = Math.ceil(totalCount / 10);
  const visiblePages = 5;
  const startPage = Math.floor((page - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  const [currentBook, setCurrentBook] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['search_book', searchTerm, page, target, searchInput],
    queryFn: () =>
      searchBook({
        query: searchTerm,
        target,
        sort: sortInput,
        page,
        size: 10,
      }),
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      const result = data.documents || data;
      setBooks(result);

      // 여기서 likedMap 초기화
      const liked = {};
      result.forEach((book) => {
        const isbnKey = book.isbn;
        liked[isbnKey] = book.liked || false;
      });
      setLikedMap(liked);

      const total = data.meta?.pageableCount || data.totalCount || 0;
      setTotalCount(total);
    }
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (searchParams.get('query')) {
      refetch(); // searchParams가 바뀌었을 때 refetch
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchLikedIsbns = async () => {
      if (!token || !searchTerm) return;
      console.log(token);
      try {
        const likedIsbns = await getLikeList(token, {
          query: searchTerm,
          target,
          sort: sortInput,
          page,
          size: 10,
        });

        const liked = {};
        likedIsbns.forEach((isbn) => {
          liked[isbn] = true;
        });

        setLikedMap(liked);
        console.log(likedIsbns);
      } catch (e) {
        console.error('좋아요한 ISBN 목록 조회 실패:', e);
      }
    };

    fetchLikedIsbns();
  }, [token, searchTerm, target, sortInput, page]);

  const onSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      query: searchInput,
      page: 1,
      target: targetInput,
      sort: sortInput,
    });
    // refetch();
  };

  const handleToggleLike = async (book) => {
    const isbn = book.isbn; // 카카오 API는 ISBN10 + ISBN13을 같이 줌

    try {
      await toggleBookLike(token, isbn);
      setLikedMap((prev) => ({
        ...prev,
        [isbn]: !prev[isbn],
      }));
      // alert(result); // => "좋아요 완료" or "좋아요 취소"
    } catch (e) {
      if (e.response?.status === 401) {
        alert('로그인 후 이용 가능합니다.');
      } else {
        alert('요청 중 오류 발생');
      }
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 pt-20 pb-20 text-sm font-sans">
        {/* 검색창 */}
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
            className="flex items-center space-x-2 mb-8"
          >
            {/* 정렬 방식 선택 */}
            <select
              className="border px-2 h-10 rounded text-sm text-gray-700"
              value={sortInput}
              onChange={(e) => setSortInput(e.target.value)}
            >
              <option value="accuracy">정확도순</option>
              <option value="recency">최신순</option>
            </select>

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
          </form>
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
                <div className="flex flex-col justify-between h-full text-sm text-gray-800">
                  <div>
                    <Link to={`/bookDetail/${encodeURIComponent(book.isbn)}`}>
                      <div className="font-bold text-base mb-1">
                        {book.title}
                      </div>
                    </Link>
                    <div className="mb-1">저자 | {book.authors.join(', ')}</div>
                    <div className="mb-1">출판 | {book.publisher}</div>
                    <div className="mb-1">
                      발행 | {book.datetime.split('T')[0].split('-').join('.')}
                    </div>
                  </div>
                  <div className="flex items-center text-[#E88D67] mb-2 text-sm">
                    <StarIcon
                      className={`w-4 h-4 ${'text-[#E88D67] fill-[#E88D67]'} mr-2`}
                    />
                    <span className="text-black">{book.rating}</span>
                    <span className="text-gray-600 ml-1">
                      ({book.reviewCnt})
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <HeartIcon
                      className={`w-6 h-6 ${
                        isLiked
                          ? 'fill-[#E88D67] text-[#E88D67]'
                          : 'text-gray-400'
                      } absolute top-8 right-8`}
                      onClick={() => handleToggleLike(book)}
                    />
                    <button
                      className="bg-[#006989] text-white w-24 h-10 rounded-lg text-xs font-bold cursor-pointer"
                      onClick={() => {
                        if (!token?.access_token) {
                          alert('로그인이 필요한 서비스입니다.');
                          return navigate('/login');
                        }

                        setCurrentBook({
                          isbn: book.isbn,
                          title: book.title,
                          author: book.authors?.join(', '),
                          imageName: book.thumbnail,
                          publisher: book.publisher,
                          pubDate: book.datetime?.split('T')[0],
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      서재에 담기
                    </button>
                  </div>
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

      {isModalOpen && currentBook && (
        <LibraryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentBook(null);
          }}
          book={currentBook}
        />
      )}
    </>
  );
}
