import React, { useState, useEffect } from 'react';
import { fetchPlaces } from '@api/place';
import PlaceCard from '@components/place/PlaceCard';
import {
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  BookOpenIcon,
  CoffeeIcon,
} from 'lucide-react';
import axios from 'axios';

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const loadData = async (nextPage = 0) => {
    setLoading(true);
    try {
      const data = await fetchPlaces(axios, {
        page: nextPage,
        size: 12,
        // tag: selectedCategory,
        tag: selectedCategory === '읽담' ? null : selectedCategory,
        keyword: searchQuery,
        placeType: selectedCategory === '읽담' ? 'PLACE' : 'ALL',
        sortBy: sortBy,
      });

      const mapped = data.content.map((place) => ({
        // id: place.id,
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
      }));

      setPlaces(mapped);
      console.log(mapped);
      console.log(selectedCategory);
      setPageInfo(data.pageInfo);
    } catch (err) {
      console.error('장소 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0, searchQuery);
  }, [selectedCategory, sortBy]);

  const filteredPlaces = places
    .filter((place) => {
      // selectedCategory가 없으면 전체
      if (!selectedCategory) return true;

      // 읽담은 태그로 필터하지 않는다
      if (selectedCategory === '읽담') return true;

      // 나머지 카테고리는 태그 필터
      return place.tags.includes(selectedCategory);
    })
    .filter((place) => {
      if (!searchQuery) return true;
      return (
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });

  const finalPlaces = filteredPlaces;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    loadData(0);
  };

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
        {/* 검색 및 필터 */}
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
            <div className="flex gap-2">
              <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <MapPinIcon className="w-5 h-5 mr-1 text-[#006989]" />
                <span>내 근처</span>
              </button>
              <div className="relative">
                <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <FilterIcon className="w-5 h-5 mr-1 text-[#006989]" />
                  <span>필터</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 카테고리 필터 */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !selectedCategory
                ? 'bg-[#006989] text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedCategory('읽담')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === '읽담'
                ? 'bg-[#006989] text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            읽담
          </button>
          <button
            onClick={() => setSelectedCategory('카페')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              selectedCategory === '카페'
                ? 'bg-[#006989] text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <CoffeeIcon className="w-4 h-4 mr-1" />
            카페
          </button>
          <button
            onClick={() => setSelectedCategory('북카페')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              selectedCategory === '북카페'
                ? 'bg-[#006989] text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <BookOpenIcon className="w-4 h-4 mr-1" />
            북카페
          </button>
          <button
            onClick={() => setSelectedCategory('서점')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === '서점'
                ? 'bg-[#006989] text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            서점
          </button>
          <button
            onClick={() => setSelectedCategory('독서모임')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === '독서모임'
                ? 'bg-[#006989] text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            독서모임
          </button>
        </div>
        {/* <div className="mb-8 flex flex-wrap gap-2">
          <button></button>
        </div> */}
        {/* 정렬 옵션 */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">총 {finalPlaces.length}개의 장소</p>
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
          </div>
        </div>
        {/* 장소 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {finalPlaces.map((place) => (
            <div key={place.id}>
              <PlaceCard place={place} size="large" />
            </div>
          ))}
        </div>
        {finalPlaces.length === 0 && !loading && (
          <div className="text-center py-16">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-400">다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Place;
