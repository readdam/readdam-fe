import React, { useState } from 'react';
import PlaceCard from '@components/place/PlaceCard';
import {
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  BookOpenIcon,
  CoffeeIcon,
} from 'lucide-react';
// 임시 데이터
const placesData = [
  {
    id: 1,
    name: '북카페 읽담',
    address: '서울시 강남구 테헤란로 123',
    image:
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9vayUyMGNhZmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['카페', '북카페', '독서모임'],
    likes: 124,
    isPromoted: true,
  },
  {
    id: 2,
    name: '책과 커피',
    address: '서울시 마포구 와우산로 48',
    image:
      'https://images.unsplash.com/photo-1600431521340-491eca880813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMGNhZmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    tags: ['카페', '북카페', '스터디'],
    likes: 98,
    isPromoted: true,
  },
  {
    id: 3,
    name: '지혜의 숲',
    address: '서울시 종로구 삼청로 123',
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    tags: ['서점', '북카페'],
    likes: 76,
  },
  {
    id: 4,
    name: '독서당',
    address: '서울시 서대문구 연희로 45',
    image:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNhZmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    tags: ['카페', '독서모임'],
    likes: 65,
  },
  {
    id: 5,
    name: '책향기',
    address: '서울시 용산구 이태원로 200',
    tags: ['서점', '독서모임'],
    likes: 42,
  },
  {
    id: 6,
    name: '리터러리 카페',
    address: '서울시 성동구 서울숲길 17',
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9vayUyMGNhZmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    tags: ['카페', '북카페'],
    likes: 89,
  },
];
// API 데이터 (작은 카드로 표시)
const apiPlacesData = [
  {
    id: 101,
    name: '동네책방',
    address: '서울시 강북구 수유로 123',
    tags: ['서점'],
    likes: 15,
  },
  {
    id: 102,
    name: '미래북스',
    address: '서울시 송파구 올림픽로 300',
    tags: ['서점', '독서모임'],
    likes: 23,
  },
  {
    id: 103,
    name: '커피앤북스',
    address: '서울시 강동구 천호대로 123',
    tags: ['카페', '북카페'],
    likes: 17,
  },
  {
    id: 104,
    name: '행복한 책방',
    address: '서울시 노원구 노해로 85',
    tags: ['서점'],
    likes: 9,
  },
];
const Place = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  // 필터링된 장소 목록
  const filteredPlaces = [
    ...placesData,
    ...apiPlacesData.map((place) => ({
      ...place,
      size: 'small',
    })),
  ]
    .filter((place) => {
      if (!selectedCategory) return true;
      return place.tags.includes(selectedCategory);
    })
    .filter((place) => {
      if (!searchQuery) return true;
      return (
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  // 정렬
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    if (sortBy === 'latest') {
      return b.id - a.id; // 임시로 ID를 기준으로 정렬
    } else if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    return 0;
  });
  // 프로모션된 장소를 상단에 배치
  const finalPlaces = sortedPlaces.sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    return 0;
  });
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
              <input
                type="text"
                placeholder="장소 이름, 주소, 키워드로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006989]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
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
              <PlaceCard
                place={place}
                size={'size' in place ? 'small' : 'large'}
              />
            </div>
          ))}
        </div>
        {finalPlaces.length === 0 && (
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
