import React, { useState } from 'react'
import {
  HomeIcon,
  PlusIcon,
} from 'lucide-react'
const AdminEventReg = () => {
  const [activePage, setActivePage] = useState('이벤트 주제 등록')
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(true)
 
  // 이벤트 등록 폼 상태 업데이트
  const [eventForm, setEventForm] = useState({
    month: '',
    startDate: '',
    endDate: '',
    title: '',
  })
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 더미 이벤트 데이터 업데이트
  const events = [
    {
      id: 1,
      month: '2025-01',
      title: '신년 독서 챌린지',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      topParticipants: [
        {
          name: '김독서',
          likes: 245,
        },
        {
          name: '이책벌레',
          likes: 189,
        },
        {
          name: '박글쓴이',
          likes: 156,
        },
      ],
      pointsDistributed: true,
    },
    {
      id: 2,
      month: '2024-12',
      title: '겨울 독서 마라톤',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      topParticipants: [
        {
          name: '최독자',
          likes: 198,
        },
        {
          name: '정책임',
          likes: 167,
        },
        {
          name: '강열독',
          likes: 145,
        },
      ],
      pointsDistributed: false,
    },
    // ... 더미 데이터 추가
  ]
 

  const handleEventSubmit = (e) => {
    e.preventDefault()
    console.log('이벤트 등록:', eventForm)
    setEventForm({
      month: '',
      startDate: '',
      endDate: '',
      title: '',
    })
  }
  const handlePointsDistribution = (eventId) => {
    // 포인트 지급 로직 구현
    console.log('포인트 지급:', eventId)
  }
  
  const renderEventTopicPage = () => (
    <div className="space-y-8">
      {/* 이벤트 주제 등록 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6">이벤트 주제 등록</h3>
        <form onSubmit={handleEventSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월 선택
              </label>
              <input
                type="month"
                value={eventForm.month}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    month: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={eventForm.endDate}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주제 제목
            </label>
            <input
              type="text"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  title: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
              placeholder="이벤트 주제를 입력하세요"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              등록
            </button>
          </div>
        </form>
      </div>
      {/* 진행된 이벤트 현황 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold">진행된 이벤트 현황</h3>
          <span className="text-sm text-gray-600">총 {events.length}건</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F3F7EC]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  월
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  주제 제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  진행 기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Top 3 참여자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  포인트 지급
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.month}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.startDate} ~ {event.endDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      {event.topParticipants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-xs px-2 py-0.5 bg-[#F3F7EC] text-[#006989] rounded-full">
                            {index + 1}위
                          </span>
                          <span>
                            {participant.name} ({participant.likes}좋아요)
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.pointsDistributed ? (
                      <span className="px-3 py-1.5 text-sm bg-[#E88D67] text-white rounded-lg inline-block opacity-50 cursor-not-allowed">
                        지급 완료
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePointsDistribution(event.id)}
                        className="px-3 py-1.5 text-sm bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
                      >
                        포인트 지급
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 페이지네이션 */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">총 {events.length}건</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
              ◀
            </button>
            <button className="px-4 py-2 bg-[#006989] text-white rounded">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-gray-100">
      
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
          {activePage === '이벤트 주제 등록' && renderEventTopicPage()}
        </main>
      </div>
  );
};
export default AdminEventReg;
