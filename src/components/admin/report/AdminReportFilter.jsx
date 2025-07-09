// src/components/admin/AdminReportFilter.jsx
import React from 'react'
import { Calendar, Search } from 'lucide-react'

const quickOptions = [
  { label: '오늘', days: 0 },
  { label: '3일간', days: 2 },
  { label: '일주일', days: 6 },
  { label: '1개월', days: 29 },
  { label: '3개월', days: 89 },
  { label: '전체', days: null },
]

export default function AdminReportFilter({
  keyword, setKeyword,
  filterType, setFilterType,
  startDate, setStartDate,
  endDate, setEndDate,
  selectedQuickDays, setSelectedQuickDays,
  status, setStatus,
  onQuick,
  onSearch,
  onReset,
}) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      {/* 1행 */}
      <div className="flex items-center gap-4 mb-4">
        <span className="w-16 text-gray-700">검색어</span>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-300 rounded px-2 py-2 focus:border-[#006989] focus:outline-none"
        >
          <option value="user">신고자/피신고자</option>
          <option value="content">내용 키워드</option>
        </select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:border-[#006989] focus:outline-none"
          />
        </div>
      </div>

      {/* 2행 */}
      <div className="flex items-center gap-4 mb-6">
        <span className="w-16 text-gray-700">날짜</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded focus-within:border-[#006989]">
            <Calendar className="ml-2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={e => {
                setStartDate(e.target.value)
                setSelectedQuickDays(null)
              }}
              className="w-32 px-2 py-2 outline-none"
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex items-center border border-gray-300 rounded focus-within:border-[#006989]">
            <Calendar className="ml-2 text-gray-400" />
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={e => {
                setEndDate(e.target.value)
                setSelectedQuickDays(null)
              }}
              className="w-32 px-2 py-2 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {quickOptions.map(opt => {
            const isActive = selectedQuickDays === opt.days
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  if (opt.days === null) {
                    onReset()
                    setSelectedQuickDays(null)
                  } else {
                    onQuick(opt)
                  }
                }}
                className={`
         px-3 py-1 rounded
         ${isActive
                    ? 'bg-[#006989] text-white'
                    : 'text-gray-600 hover:text-[#006989]'}
       `}
              >
                {opt.label}
              </button>
            )

          })}
        </div>
      </div>

      {/* 3행 */}
      <div className="flex items-center gap-4 mb-6">
        <span className="w-16 text-gray-700">구분</span>
        {['전체', '처리', '미처리', '반려'].map(opt => (
          <label key={opt} className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="status"
              value={opt}
              checked={status === opt}
              onChange={() => setStatus(opt)}
              className="form-radio text-[#006989] focus:ring-[#006989]"
            />
            <span className="ml-1">{opt}</span>
          </label>
        ))}
      </div>

      {/* 4행 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-[#006989] text-white rounded hover:bg-[#005C78]"
        >
          검색
        </button>
        <button
          onClick={() => {
            onReset()
            setSelectedQuickDays(null)
          }}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          초기화
        </button>
      </div>
    </div>
  )
}