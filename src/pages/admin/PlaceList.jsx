import { useEffect, useState } from 'react';
import {
  PlusIcon,
  HeartIcon,
  SearchIcon,
  FilterIcon,
  MapPinIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPlaceList } from '@api/place';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

function formatTimeRanges(times) {
  if (!times || times.length === 0) return '';

  // 문자열을 Date 객체로 정렬
  const sorted = [...new Set(times)].sort();

  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const prevHour = parseInt(prev.split(':')[0], 10);
    const currHour = parseInt(curr.split(':')[0], 10);

    // 연속 시간인지 체크
    if (currHour !== prevHour + 1) {
      ranges.push(`${start}-${prev}`);
      start = curr;
    }
    prev = curr;
  }

  // 마지막 구간 추가
  ranges.push(`${start}-${prev}`);

  return ranges.join(', ');
}

export default function PlaceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0); // ← 현재 페이지 (0-based)
  const size = 10;
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const [filterField, setFilterField] = useState('name');

  const isInitial = searchTerm.trim() === '';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['placeList', page, searchTerm, filterField],
    queryFn: () =>
      fetchPlaceList(token, {
        page,
        size,
        searchTerm,
        searchField: filterField,
      }),
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  const places = data?.content ?? [];

  if (isLoading) return <div className="p-6">로딩 중...</div>;
  if (error) {
    console.log(error);
    return (
      <div className="p-6 text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // 검색 시 페이지 초기화
    refetch();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-x-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">장소 관리</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-all duration-200 cursor-pointer"
          onClick={() => navigate('/admin/placeAdd')}
        >
          <PlusIcon className="w-5 h-5" />새 장소 추가
        </button>
      </div>

      <form className="flex gap-4 mb-6" onSubmit={handleSearch}>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
        >
          <option value="name" selected>
            장소명
          </option>
          <option value="location">주소</option>
        </select>
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
        <button
          class="bg-[#E88D67] text-white w-16 h-10 rounded text-sm cursor-pointer"
          onClick={handleSearch}
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
                태그
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                방 개수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                좋아요
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {places &&
              places?.map((place) => (
                <tr key={place.placeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={`${url}/upload/${place.thumbnailImage}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {place.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {place.location}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {place.introduce}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-500">{place.phone}</td>
                  <td className="px-6 py-4 text-gray-500">
                    평일: {formatTimeRanges(place.weekdayTime)}
                    <br />
                    주말: {formatTimeRanges(place.weekendTime)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex flex-wrap gap-2">
                      {place.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#F3F7EC] text-[#006989] text-xs rounded-full max-w-[100px] truncate"
                          title={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-500">{place.roomCount}</td>
                  <td className="px-6 py-4 text-gray-500">{place.likeCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 text-sm text-[#006989] hover:bg-[#006989] hover:text-white rounded transition-all duration-200 text-nowrap cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/placeEdit/${place.placeId}`)
                        }
                      >
                        수정
                      </button>
                      <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-600 hover:text-white rounded transition-all duration-200 text-nowrap cursor-pointer">
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {places.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-400">
                  등록된 장소가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <nav className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={page === 0}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-1 text-sm rounded ${
                page === i
                  ? 'bg-[#006989] text-white'
                  : 'border hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={page + 1 >= totalPages}
          >
            다음
          </button>
        </nav>
      </div>
    </div>
  );
}
