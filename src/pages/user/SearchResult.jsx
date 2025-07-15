import React, { useEffect, useState } from 'react';
import {
  SearchIcon,
  XCircleIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAllSearch } from '@hooks/useAllSearch';
import WriteCard from '@components/write/WriteCard';
import ClassCard from '@components/class/ClassCard';
import PlaceCard from '@components/place/PlaceCard';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keywordParam = searchParams.get('keyword') || '';
  const [searchKeyword, setSearchKeyword] = useState(keywordParam);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const { allSearch } = useAllSearch();

    // handlePlaceCardClick 함수 추가
  const handlePlaceCardClick = (place) => {
    if (place.type === 'PLACE') {
      navigate(`/placeDetail/${place.id}`);
    } else if (place.type === 'OTHER') {
      navigate(`/otherPlaceDetail/${place.id}`);
    }
  };

  useEffect(() => {
  if (!keywordParam) return;

  setSearchKeyword(keywordParam);

  setLoading(true);
  allSearch(keywordParam, 'latest')
    .then((data) => {
            console.log('검색 결과 전체:', data);
      setResult(data);
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      setLoading(false);
    });
}, [searchParams]);

  const handleClearSearch = () => {
    setSearchKeyword('');
    setResult(null);
  };

  const handleSearch = () => {
    if (searchKeyword.trim() !== '') {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  const meetingResults = result?.classes?.content || [];
  const meetingTotal = result?.classes?.totalCount || 0;

  const spaceResults = result?.places?.content || [];
  const spaceTotal = result?.places?.totalCount || 0;

  const postResults = result?.writes?.content || [];
  const postTotal = result?.writes?.totalCount || 0;

  const bookResults = result?.books?.content || [];
  const bookTotal = result?.books?.totalCount || 0;

  const ResultSection = ({ title, count, children, onViewMore }) => (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500">({count})</span>
        </div>
        {count >= 4 && (
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
          '{searchKeyword}'와 관련된 {title} 결과가 없습니다. 키워드를 바꿔보세요.
        </div>
      ) : (
        children
      )}
    </section>
  );

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 상단 검색 영역 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            {/* 검색바 */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  className="w-full px-4 py-2 pl-10 border border-[#E88D67] rounded-lg focus:outline-none focus:border-[#E88D67]"
                />
                <SearchIcon
                  onClick={handleSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                />
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

        {/* 검색 결과 렌더링 */}
        <ResultSection
          title="모임"
          count={meetingTotal}
          onViewMore={() => {
            navigate(`/classList?keyword=${encodeURIComponent(searchKeyword)}`);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {meetingResults.map((group) => (
              <ClassCard key={group.classId} group={group} />
            ))}
          </div>
        </ResultSection>

        {/* 장소 결과 */}
        <ResultSection
          title="장소"
          count={spaceTotal}
          onViewMore={() => {
            navigate(`/place?keyword=${encodeURIComponent(searchKeyword)}`);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {spaceResults.map((place) => {
              const idPrefix = place.type === 'OTHER' ? 'other' : 'place';
              const id = `${idPrefix}-${place.placeId || place.otherPlaceId}`;

              const tags = [
                place.tag1,
                place.tag2,
                place.tag3,
                place.tag4,
                place.tag5
              ].filter(Boolean);

              return (
                <div
                  key={id}
                  onClick={() =>
                    handlePlaceCardClick({
                      ...place,
                      id: place.placeId || place.otherPlaceId,
                    })
                  }
                  className="cursor-pointer"
                >
                  <PlaceCard
                    place={{
                      id: place.placeId || place.otherPlaceId,
                      name: place.name,
                      address: place.basicAddress,
                      image: place.img1 || place.image,
                      tags,
                      likes: place.likeCount,
                      isPromoted: place.type === 'OTHER',
                    }}
                    size="large"
                  />
                </div>
              );
            })}
          </div>
        </ResultSection>

        {/* 글 결과 */}
        <ResultSection
          title="글"
          count={postTotal}
            onViewMore={() => {
              navigate(`/writeList?keyword=${encodeURIComponent(searchKeyword)}&type=all&status=all&sort=recent&page=1`);
            }}
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {postResults.map((post) => (
              <WriteCard
                key={post.writeId}
                post={post}
                onClick={() => navigate(`/writeDetail/${post.writeId}`)}
              />
            ))}
          </div>
        </ResultSection>

        {/* 책 결과 */}
        <ResultSection
            title="책"
            count={bookTotal}
            onViewMore={() => {
              navigate(`/bookSearch?query=${encodeURIComponent(searchKeyword)}`);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {bookResults.map((book) => (
                <Link
                  key={book.bookIsbn}
                  to={`/bookDetail/${encodeURIComponent(book.bookIsbn)}`}
                  className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="bg-[#006989] flex justify-center items-center w-40 h-60 mx-auto rounded overflow-hidden">
                    <img
                      src={book.image || book.cover}
                      alt={book.title}
                      className="h-full object-contain"
                    />
                  </div>

                  <h3 className="text-lg font-bold mt-4 text-center hover:text-[#006989]">
                    {book.title}
                  </h3>

                  <p className="text-gray-600 mt-1 text-center text-sm">
                    저자 | {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                  </p>

                  <p className="text-gray-600 mt-1 text-center text-sm">
                    출판사 | {book.publisher}
                  </p>
                </Link>
              ))}
            </div>
          </ResultSection>

      </div>
    </div>
  );
};

export default SearchResult;
