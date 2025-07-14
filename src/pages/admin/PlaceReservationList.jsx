import React, { useEffect, useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '@hooks/useAxios';

export default function PlaceReservationList() {
  const [page, setPage] = useState(1);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const axios = useAxios();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    date: '',
    status: '',
    keyword: '',
  });

  useEffect(() => {
    refetch();
  }, [queryParams]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['reservations', queryParams],
    queryFn: async () => {
      const res = await axios.get('/admin/reservations', {
        params: {
          page: queryParams.page,
          // page: 2,
          size: 10,
          date: queryParams.date,
          status: queryParams.status,
          keyword: queryParams.keyword,
        },
      });
      console.log('📦 페이지 데이터', {
        page,
        totalPages: data?.totalPages,
        totalElements: data?.totalElements,
        contentLength: data?.content?.length,
      });

      return res.data;
    },
    enabled: true, // 초기엔 자동 실행하지 않음
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setQueryParams({
      page: 1, // 검색할 땐 항상 1페이지부터
      date,
      status,
      keyword,
    });
    setPage(1);
    // refetch();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-6">예약 내역</h1>

        {/* 필터 & 검색 */}
        <form
          className="flex items-center gap-2 mb-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          {/* 날짜 달력 */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="주소, 장소명, 방이름으로 검색하기"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-[#006989] text-white text-sm px-4 py-2 rounded hover:bg-[#005470] cursor-pointer"
          >
            검색
          </button>
        </form>

        {/* 상태 라디오 버튼 */}
        <div className="flex items-center gap-4 mb-8 mt-2">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="status"
              value=""
              checked={status === ''}
              onChange={(e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
                setQueryParams((prev) => ({
                  ...prev,
                  page: 1,
                  status: newStatus,
                }));
              }}
            />
            전체
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="status"
              value="PENDING"
              checked={status === 'PENDING'}
              onChange={(e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
                setQueryParams((prev) => ({
                  ...prev,
                  page: 1,
                  status: newStatus,
                }));
              }}
            />
            예약중
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="status"
              value="CONFIRMED"
              checked={status === 'CONFIRMED'}
              onChange={(e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
                setQueryParams((prev) => ({
                  ...prev,
                  page: 1,
                  status: newStatus,
                }));
              }}
            />
            예약확정
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="status"
              value="CANCELLED"
              checked={status === 'CANCELLED'}
              onChange={(e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
                setQueryParams((prev) => ({
                  ...prev,
                  page: 1,
                  status: newStatus,
                }));
              }}
            />
            취소완료
          </label>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  '장소명',
                  '주소',
                  '방이름',
                  '일시',
                  '모임장',
                  '인원',
                  '상태',
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data?.content?.map((r) => (
                <tr
                  key={`${r.reservationId}-${r.date}-${r.startTime}`}
                  className="text-nowrap"
                >
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {r.placeName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {r.placeAddress}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {r.roomName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    <div>
                      {r.date} {r.time}
                    </div>
                    <div>
                      {r.startTime.slice(0, 5)} - {r.endTime.slice(0, 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {r.reserverName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {r.participantCount}명
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-nowrap ${
                        r.status === 'CANCELLED'
                          ? 'bg-gray-200 text-gray-600'
                          : r.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {r.status === 'CANCELLED' && '취소완료'}
                      {r.status === 'CONFIRMED' && '예약확정'}
                      {r.status === 'PENDING' && '예약중'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {data?.pageInfo && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {/* 이전 버튼 */}
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
            >
              이전
            </button>

            {/* 페이지 번호 버튼 */}
            {Array.from({ length: data.pageInfo.totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer ${
                    pageNumber === page
                      ? 'bg-[#006989] text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* 다음 버튼 */}
            <button
              disabled={page === data.pageInfo.totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
