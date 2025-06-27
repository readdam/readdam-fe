// src/components/admin/EventStatusList.jsx
import React from 'react'

const EventStatusList = ({ events, onPointsDistribution, onDelete }) => {
  const now = new Date()

  const toDate = iso => new Date(iso)
  const fmt   = iso => iso.split('T')[0] // "YYYY-MM-DD"

  // 이벤트 상태별 분류
  const upcoming  = events.filter(e => toDate(e.startTime) > now)
  const ongoing   = events.filter(e => toDate(e.startTime) <= now && toDate(e.endTime) >= now)
  const completed = events.filter(e => toDate(e.endTime) < now)

  const renderTable = (list, { title, showPoints, showDelete }) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold">{title} ({list.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F3F7EC]">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">월</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">주제 제목</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">TOP 3 참여자</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map(ev => {
              const participants = (ev.topParticipants || [])
                .slice()                  // 원본 보호
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 3)

              return (
                <tr key={ev.eventId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {fmt(ev.startTime).slice(0,7)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{ev.title}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {fmt(ev.startTime)} ~ {fmt(ev.endTime)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {participants.length === 0
                      ? <span className="text-gray-400">참여자 없음</span>
                      : participants.map((p, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 bg-[#F3F7EC] text-[#006989] rounded-full">
                              {i + 1}위
                            </span>
                            <span>{p.nickname} ({p.likes} 좋아요)</span>
                          </div>
                        ))
                    }
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap flex items-center space-x-2">
                    {showPoints && (
                      <button
                        onClick={() => onPointsDistribution(ev.eventId)}
                        className="px-3 py-1.5 text-sm bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
                      >
                        포인트 지급
                      </button>
                    )}
                    {showDelete && (
                      <button
                        onClick={() => onDelete(ev.eventId)}
                        className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <>
      {renderTable(upcoming,  { title: '예정된 이벤트',  showPoints: false, showDelete: true })}
      {renderTable(ongoing,   { title: '진행 중 이벤트',  showPoints: false, showDelete: false })}
      {renderTable(completed, { title: '완료된 이벤트',   showPoints: true,  showDelete: false })}
    </>
  )
}

export default EventStatusList
