import React, { useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

export default function PlaceReservationList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체 유형');

  const reservations = [
    {
      id: 1,
      leader: '김독서',
      members: 8,
      place: '북카페 리드미',
      subPlace: '101호',
      date: '2023-11-20',
      time: '14:00 - 16:00',
      status: '예약확정',
    },
    {
      id: 2,
      leader: '이서재',
      members: 5,
      place: '책카페 무드온',
      subPlace: '101호',
      date: '2023-11-22',
      time: '10:00 - 12:00',
      status: '사용중',
    },
    {
      id: 3,
      leader: '박문학',
      members: 10,
      place: '리딩라운지',
      subPlace: '101호',
      date: '2023-11-18',
      time: '16:00 - 18:00',
      status: '사용완료',
    },
    {
      id: 4,
      leader: '조책방',
      members: 4,
      place: '북셔어',
      subPlace: '101호',
      date: '2023-11-17',
      time: '11:00 - 13:00',
      status: '취소요청',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case '예약확정':
        return 'bg-yellow-100 text-yellow-800';
      case '사용중':
        return 'bg-blue-100 text-blue-700';
      case '사용완료':
        return 'bg-green-100 text-green-700';
      case '취소요청':
        return 'bg-gray-200 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">예약 내역</h1>

      {/* 필터 & 검색 */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option>전체 유형</option>
          <option>예약확정</option>
          <option>사용중</option>
          <option>사용완료</option>
          <option>취소요청</option>
        </select>
        <input
          type="text"
          placeholder="장소, 세부장소, 날짜로 검색하기"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['모임장', '인원', '장소', '세부장소', '일시', '상태'].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4">{r.leader}</td>
                <td className="px-6 py-4">{r.members}명</td>
                <td className="px-6 py-4">{r.place}</td>
                <td className="px-6 py-4">{r.subPlace}</td>
                <td className="px-6 py-4">
                  <div>{r.date}</div>
                  <div className="text-sm text-gray-500">{r.time}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 mt-6">
        {['이전', '1', '2', '3', '다음'].map((btn, i) => (
          <button
            key={btn}
            className={`px-3 py-1 rounded border text-sm ${
              btn === '1'
                ? 'bg-[#006989] text-white border-[#006989]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
