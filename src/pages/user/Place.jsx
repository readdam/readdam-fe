import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlaces } from '@api/place';
import PlaceCard from '@components/place/PlaceCard';
import {
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  BookOpenIcon,
  CoffeeIcon,
} from 'lucide-react';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../atoms';
import { useAxios } from '@hooks/useAxios';
import { useNavigate } from 'react-router';

const Place = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const user = useAtomValue(userAtom);
  const axios = useAxios();

  // 핵심: queryKey에 모든 파라미터를 넣는다.
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['places', { selectedCategory, searchQuery, sortBy }],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetchPlaces(axios, {
        page: pageParam,
        size: 12,
        tag: selectedCategory === '읽담' ? null : selectedCategory,
        keyword: searchQuery,
        placeType: selectedCategory === '읽담' ? 'PLACE' : 'ALL',
        sortBy,
        lat: user.lat,
        lng: user.lng,
      });
      return res;
    },

    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pageInfo;
      if (currentPage + 1 >= totalPages) {
        return undefined;
      }
      return currentPage + 1;
    },

    keepPreviousData: true,
  });

  // 모든 페이지 데이터 합치기
  const mapped =
    data?.pages.flatMap((page) =>
      page.content.map((place) => ({
        id: place.type === 'OTHER' ? `other-${place.id}` : `place-${place.id}`,
        name: place.name,
        address: place.basicAddress,
        image: place.img1,
        tags: [
          place.tag1,
          place.tag2,
          place.tag3,
          place.tag4,
          place.tag5,
          place.tag6,
          place.tag7,
          place.tag8,
          place.tag9,
          place.tag10,
        ].filter(Boolean),
        likes: place.likeCount,
        isPromoted: place.type === 'OTHER',
      }))
    ) ?? [];

  // 검색 시 refetch
  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const totalCount = data?.pages[0]?.pageInfo?.totalElements ?? 0;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">장소 찾기</h1>
          <p className="text-gray-600">
            독서와 함께하는 공간을 찾아보세요. 카페, 서점, 독서모임 장소 등
            다양한 공간을 만나볼 수 있습니다.
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="장소 이름, 주소, 키워드로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006989]"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </form>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:opacity-90"
            >
              검색
            </button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['전체', '읽담', '카페', '북카페', '서점', '독서모임'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === '전체' ? null : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === (cat === '전체' ? null : cat)
                  ? 'bg-[#006989] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 정렬 */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">총 {totalCount}개의 장소</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1 text-sm rounded ${
                sortBy === 'latest'
                  ? 'bg-[#006989] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`px-3 py-1 text-sm rounded ${
                sortBy === 'likes'
                  ? 'bg-[#006989] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              인기순
            </button>
            <button
              onClick={() => {
                if (user.lat == null || user.lng == null) {
                  alert('위치를 설정해주세요.');
                  return;
                }
                setSortBy('distance');
              }}
              className={`px-3 py-1 text-sm rounded ${
                sortBy === 'distance'
                  ? 'bg-[#006989] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              거리순
            </button>
          </div>
        </div>

        {/* 목록 */}
        {isLoading && <div className="text-center py-16">로딩중...</div>}
        {isError && (
          <div className="text-center py-16 text-red-500">데이터 로드 실패</div>
        )}
        {!isLoading && !isError && mapped.length === 0 && (
          <div className="text-center py-16">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mapped.map((place) => (
            <div
              key={place.id}
              className="cursor-pointer"
              onClick={() => {
                const [type, pid] = place.id.split('-');
                if (type === 'place') navigate(`/placeDetail/${pid}`);
                if (type === 'other') navigate(`/otherPlaceDetail/${pid}`);
              }}
            >
              {place.id}
              <PlaceCard place={place} size="large" />
            </div>
          ))}
        </div>
        {/* 더보기 버튼 */}
        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isFetchingNextPage ? '로딩중...' : '더보기'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Place;
