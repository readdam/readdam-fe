import React, { useState } from 'react'
import {
  PlusCircleIcon,
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  SearchIcon,
  CompassIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const ClassList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [venueFilter, setVenueFilter] = useState(
    '전체',
  )
  const [sortBy, setSortBy] = useState(
    'deadline',
  )
  const [groups, setGroups] = useState([
    {
      id: 1,
      title: '세계 문학 클래식 완독',
      tags: ['세계문학', '고전', '장편소설'],
      schedule: '시작일 2024.02.01 19:00',
      location: '읽담 강남센터',
      image:
        'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3',
      likes: 42,
      isLiked: false,
      venue: '읽담',
    },
    {
      id: 2,
      title: '철학 고전 깊이 읽기',
      tags: ['철학', '인문학', '토론'],
      schedule: '시작일 2024.02.05 20:00',
      location: '카페 책방',
      image:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3',
      likes: 35,
      isLiked: false,
      venue: '타 장소',
    },
    {
      id: 1,
      title: '세계 문학 클래식 완독',
      tags: ['세계문학', '고전', '장편소설'],
      schedule: '시작일 2024.02.01 19:00',
      location: '읽담 강남센터',
      image:
        'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3',
      likes: 42,
      isLiked: false,
      venue: '읽담',
    },
    {
      id: 2,
      title: '철학 고전 깊이 읽기',
      tags: ['철학', '인문학', '토론'],
      schedule: '시작일 2024.02.05 20:00',
      location: '카페 책방',
      image:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3',
      likes: 35,
      isLiked: false,
      venue: '타 장소',
    },
    // ... 나머지 6개의 그룹 데이터는 비슷한 형식으로 추가됨
  ])

  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault()
    const filtered = groups.filter(
      (group) =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
    setSearchResults(filtered)
    setHasSearched(true)
  }
  const handleLike = (groupId) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            likes: group.isLiked ? group.likes - 1 : group.likes + 1,
            isLiked: !group.isLiked,
          }
        }
        return group
      }),
    )
  }
  const displayGroups = hasSearched ? searchResults : groups
  return (
    <div className="min-h-screen bg-[#F3F7EC]">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">전체 모임</h1>
          <button onClick={() => navigate('/classCreate')} className="px-6 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            모임 만들기
          </button>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={venueFilter}
              onChange={(e) =>
                setVenueFilter(e.target.value)
              }
            >
              <option value="전체">모든 장소</option>
              <option value="읽담">읽담에서 모임</option>
              <option value="타 장소">타 장소 모임</option>
            </select>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-full ${sortBy === 'deadline' ? 'bg-[#006989] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSortBy('deadline')}
              >
                ⏱ 마감 임박 순
              </button>
              <button
                className={`px-4 py-2 rounded-full ${sortBy === 'start' ? 'bg-[#006989] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSortBy('start')}
              >
                📆 빠른 시작 순
              </button>
              <button
                className={`px-4 py-2 rounded-full ${sortBy === 'likes' ? 'bg-[#006989] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSortBy('likes')}
              >
                ❤️ 좋아요 많은 순
              </button>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="모임 이름, 관심 있는 키워드로 검색"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
        {hasSearched && (
          <p className="text-gray-600 mb-4">
            모임 카테고리에서 '{searchTerm}' 검색 결과입니다. (검색결과{' '}
            {searchResults.length}건)
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {group.title}
                  </h3>
                  <button
                    onClick={() => handleLike(group.id)}
                    className="flex items-center gap-1 text-gray-500"
                  >
                    <HeartIcon
                      className={`w-5 h-5 ${group.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span>{group.likes}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#F3F7EC] text-[#006989] text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{group.schedule}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <CompassIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{group.location}</span>
                </div>
                <button className="w-full px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
                  자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
export default ClassList;

