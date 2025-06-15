import { useState } from 'react';
import { PlusIcon, HeartIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OtherPlaceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const places = [
    {
      id: 1,
      name: '북카페 리드미',
      address: '서울 마포구 연남동 123-45',
      phone: '02-1234-5678',
      createdAt: '2023-11-01',
      status: '운영중단',
      schedule: {
        weekday: '10:00 - 22:00',
        weekend: '11:00 - 20:00',
      },
      image: 'https://images.unsplash.com/photo-1600431521340-491eca880813',
      description:
        '조용하고 아늑한 분위기의 북카페입니다. 다양한 커피와 디저트를 제공합니다.',
      likes: 245,
      keywords: ['조용한', '아늑한', '커피', '디저트'],
    },
    {
      id: 2,
      name: '책방 오후',
      address: '서울 서초구 방배동 789-10',
      phone: '02-9876-5432',
      createdAt: '2023-10-28',
      status: '운영중단',
      schedule: {
        weekday: '11:00 - 20:00',
        weekend: '12:00 - 18:00',
      },
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      description: '독립출판물과 커피를 함께 즐길 수 있는 감성적인 공간입니다.',
      likes: 189,
      keywords: ['독립출판', '커피', '아늑한'],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-x-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">외부 장소 목록</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-all duration-200 cursor-pointer"
          onClick={() => navigate('/otherPlaceAdd')}
        >
          <PlusIcon className="w-5 h-5" />새 장소 추가
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="장소명 또는 주소로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <FilterIcon className="w-4 h-4" />
          필터
        </button>
      </div>

      <div className="bg-white rounded-lg shadow min-w-[1000px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                장소 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                운영시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                키워드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                좋아요
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등록일
              </th> */}

              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {places.map((place) => (
              <tr key={place.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {place.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {place.address}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {place.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{place.phone}</td>
                <td className="px-6 py-4 text-gray-500">
                  <div>평일: {place.schedule.weekday}</div>
                  <div>주말: {place.schedule.weekend}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {place.keywords.map((k, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#F3F7EC] text-[#006989] text-xs rounded-full"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-pink-500">
                    <HeartIcon className="w-4 h-4" />
                    <span>{place.likes}</span>
                  </div>
                </td>
                {/* <td className="px-6 py-4 text-gray-500">{place.createdAt}</td> */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm text-[#006989] hover:bg-[#006989] hover:text-white rounded transition-all duration-200 text-nowrap cursor-pointer">
                      수정
                    </button>
                    <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-600 hover:text-white rounded transition-all duration-200 text-nowrap cursor-pointer">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <nav className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            이전
          </button>
          <button className="px-3 py-1 text-sm bg-[#006989] text-white rounded">
            1
          </button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            다음
          </button>
        </nav>
      </div>
    </div>
  );
}
