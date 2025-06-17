import React, { useState } from "react";
import {
  SearchIcon,
  HomeIcon,
  CalendarIcon
} from "lucide-react";

const AdminEventJoinedList = () => {
  const [activePage, setActivePage] = useState("이벤트 참여 내역");

  // 이벤트 관련 상태
  const [eventFilter, setEventFilter] = useState({
    month: '',
    startDate: '',
    endDate: '',
  })
  // 이벤트 참여 관련 상태 추가
  const [eventParticipationFilter, setEventParticipationFilter] = useState({
    currentEventOnly: true,
    selectedMonth: '',
    reportedOnly: false,
  })
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
 
   // 더미 참여 내역 데이터 업데이트
  const participations = [
    {
      id: 1,
      username: '김독서',
      content:
        '올해는 매주 한 권씩 읽어서 총 52권을 목표로 열심히 달려보겠습니다!',
      createdAt: '2025-01-14 14:30',
      likes: 12,
      reportCount: 2,
      isHidden: false,
    },
    {
      id: 2,
      username: '이책벌레',
      content: '독서를 통해 새로운 세상을 경험하고 있습니다. 모두 함께해요!',
      createdAt: '2025-01-13 09:15',
      likes: 8,
      reportCount: 0,
      isHidden: false,
    },
    {
      id: 3,
      username: '박글쓴이',
      content: '매일 책 한 페이지씩이라도 읽기 시작했어요.',
      createdAt: '2025-01-12 16:45',
      likes: 15,
      reportCount: 1,
      isHidden: true,
    },
    // ... 더미 데이터 추가
  ]
  // 필터링된 참여 내역 계산
  const filteredParticipations = participations
    .filter((item) => {
      if (eventParticipationFilter.currentEventOnly) return true
      return eventParticipationFilter.selectedMonth ? true : true // 실제로는 월 기준 필터링
    })
    .filter((item) => {
      if (!eventParticipationFilter.reportedOnly) return true
      return item.reportCount > 0
    })
  // 페이지네이션 처리
  const totalItems = filteredParticipations.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = filteredParticipations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  
 const renderEventParticipationPage = () => (
    <div className="space-y-6">
      {/* 필터 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">참여 내역 조회</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={eventParticipationFilter.currentEventOnly}
                onChange={(e) =>
                  setEventParticipationFilter((prev) => ({
                    ...prev,
                    currentEventOnly: e.target.checked,
                    selectedMonth: e.target.checked ? '' : prev.selectedMonth,
                  }))
                }
                className="w-4 h-4 rounded border-gray-300 text-[#006989] focus:ring-[#006989]"
              />
              <span className="text-sm text-gray-700">
                진행 중 이벤트만 보기
              </span>
            </label>
            <div className="flex items-center space-x-2">
              <select
                disabled={eventParticipationFilter.currentEventOnly}
                value={eventParticipationFilter.selectedMonth}
                onChange={(e) =>
                  setEventParticipationFilter((prev) => ({
                    ...prev,
                    selectedMonth: e.target.value,
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] disabled:bg-gray-100"
              >
                <option value="">전체 월</option>
                <option value="2025-01">2025년 1월</option>
                <option value="2025-02">2025년 2월</option>
                <option value="2025-03">2025년 3월</option>
              </select>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={eventParticipationFilter.reportedOnly}
                onChange={(e) =>
                  setEventParticipationFilter((prev) => ({
                    ...prev,
                    reportedOnly: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-gray-300 text-[#006989] focus:ring-[#006989]"
              />
              <span className="text-sm text-gray-700">신고된 항목만 보기</span>
            </label>
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
              조회
            </button>
          </div>
        </div>
      </div>
      {/* 참여 내역 테이블 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold">이벤트 참여 내역</h3>
          <span className="text-sm text-gray-600">총 {totalItems}건</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F3F7EC]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  사용자명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  참여 내용
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  작성일시
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  좋아요
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  신고
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                    {item.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.likes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.reportCount > 0 && (
                      <span className="px-2 py-1 text-xs bg-[#E88D67] text-white rounded-full">
                        {item.reportCount}회
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.isHidden}
                        onChange={() => {
                          // 숨김 상태 토글 로직 구현
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[#006989] focus:ring-[#006989]"
                      />
                      <span className="text-sm text-gray-700">
                        {item.isHidden ? '숨김처리됨' : '표시됨'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 페이지네이션 */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            총 {totalItems}건 중 {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)}건
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              ◀
            </button>
            {Array.from(
              {
                length: totalPages,
              },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 ${currentPage === page ? 'bg-[#006989] text-white' : 'border border-gray-300 hover:bg-gray-50'} rounded`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex max-w-[1440px] mx-auto">
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>이벤트</span>
            <span>&gt;</span>
            <span>{activePage}</span>
          </div>
          {/* 페이지 제목 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{activePage}</h2>
          </div>
          
          {/* 페이지별 콘텐츠 */}
          {activePage === "이벤트 참여 내역" && renderEventParticipationPage()}
        </main>
      </div>
    </div>
  );
};
export default AdminEventJoinedList;