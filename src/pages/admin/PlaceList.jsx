import { useEffect, useState } from 'react';
import { HeartIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import { fetchPlaceList } from '@api/place';

function formatTimeRanges(times) {
  if (!times || times.length === 0) return '';
  const sorted = [...new Set(times)].sort();
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const prevHour = parseInt(prev.split(':')[0], 10);
    const currHour = parseInt(curr.split(':')[0], 10);
    if (currHour !== prevHour + 1) {
      ranges.push(`${start}-${prev}`);
      start = curr;
    }
    prev = curr;
  }
  ranges.push(`${start}-${prev}`);
  return ranges.join(', ');
}

export default function PlaceList() {
  const token = useAtomValue(tokenAtom);
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('name');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;
  const [loading, setLoading] = useState(false);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const data = await fetchPlaceList(token, {
        page,
        size,
        searchTerm,
        searchField: filterField,
      });
      setPlaces(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('장소 목록 조회 실패:', err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadPlaces();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto overflow-x-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">장소 관리</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] cursor-pointer"
            onClick={() => navigate('/admin/placeAdd')}
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
            className="bg-[#E88D67] text-white w-16 h-10 rounded text-sm cursor-pointer"
          >
            검색
          </button>
        </form>

        {loading ? (
          <div className="p-6">로딩 중...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow min-w-[1000px]">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap">
                      장소 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap">
                      연락처
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap">
                      운영시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap">
                      태그
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap flex justify-center">
                      방 개수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap">
                      좋아요
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap flex justify-center">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {places?.map((place) => (
                    <tr key={place.placeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={`${url}/image?filename=${place.thumbnailImage}`}
                            className="w-16 h-16 rounded-lg object-cover"
                            alt="썸네일"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {place.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {place.basicAddress} {place.detailAddress}
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
                              className="px-2 py-1 bg-[#F3F7EC] text-[#006989] text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 flex-col">
                        {place.roomCount}
                      </td>
                      <td className="px-6 py-">
                        <div className="text-red-600 flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{place.likeCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1.5 text-sm text-[#006989] hover:bg-[#006989] hover:text-white rounded whitespace-nowrap cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/placeEdit/${place.placeId}`)
                            }
                          >
                            수정
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {places?.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-400"
                      >
                        등록된 장소가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {/* 이전 버튼 */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                >
                  이전
                </button>

                {/* 페이지 번호 버튼 */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer ${
                      page === i
                        ? 'bg-[#006989] text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* 다음 버튼 */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
