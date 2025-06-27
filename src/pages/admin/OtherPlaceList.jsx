import { useEffect, useState } from 'react';
import { PlusIcon, HeartIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '@hooks/useAxios';
import { fetchOtherPlaceList } from '@api/otherPlace';
import { url } from '../../config/config';

function formatTime(timeString) {
  if (!timeString) return '';
  const [hourStr, minuteStr] = timeString.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const isAM = hour < 12;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${isAM ? '오전' : '오후'} ${displayHour}:${minuteStr}`;
}

export default function OtherPlaceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('name');
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const axios = useAxios();

  const getPlaceList = async () => {
    try {
      const data = await fetchOtherPlaceList(axios, {
        page,
        size: 10,
        keyword: searchTerm,
        filterBy: filterField,
      });
      setPlaces(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('외부 장소 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    getPlaceList();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // 검색 시 첫 페이지로 리셋
    getPlaceList();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-x-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">외부 장소 목록</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-all duration-200 cursor-pointer"
          onClick={() => navigate('/admin/otherPlaceAdd')}
        >
          <PlusIcon className="w-5 h-5" />새 장소 추가
        </button>
      </div>

      <form className="flex gap-4 mb-6" onSubmit={handleSearch}>
        <select
          className="px-4 py-2 border rounded-lg text-sm"
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
        >
          <option value="name">장소명</option>
          <option value="basic_address">주소</option>
        </select>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="장소명 또는 주소로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-lg"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          type="submit"
          className="bg-[#E88D67] text-white w-16 h-10 rounded text-sm"
        >
          검색
        </button>
      </form>

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
                      // src={place.img1}
                      src={`${url}/image?filename=${place.img1}`}
                      alt={place.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {place.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {place.basicAddress}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {place.introduce}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{place.phone}</td>
                <td className="px-6 py-4 text-gray-500">
                  <div>
                    평일: {formatTime(place.weekdayStime)} -{' '}
                    {formatTime(place.weekdayEtime)}
                  </div>
                  <div>
                    주말: {formatTime(place.weekendStime)} -{' '}
                    {formatTime(place.weekendEtime)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((k, i) => (
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

      {/* ✅ 페이징 */}
      <div className="flex justify-center mt-6">
        <nav className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          >
            이전
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 text-sm border rounded ${
                page === i ? 'bg-[#006989] text-white' : 'hover:bg-gray-50'
              }`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            다음
          </button>
        </nav>
      </div>
    </div>
  );
}
