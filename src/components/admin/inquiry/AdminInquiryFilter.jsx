// src/components/admin/inquiry/AdminInquiryFilter.jsx
import React from 'react'
import { Search, Calendar } from 'lucide-react'

const quickOptions = [
    { label: '오늘', days: 0 },
    { label: '3일간', days: 2 },
    { label: '일주일', days: 6 },
    { label: '1개월', days: 29 },
    { label: '3개월', days: 89 },
    { label: '전체', days: null },
]

export default function AdminInquiryFilter({
    searchField, setSearchField,  // 'title' | 'author' | 'content'
    keyword, setKeyword,
    startDate, setStartDate,
    endDate, setEndDate,
    quickDays, setQuickDays,
    status, setStatus,       // 'all' | 'pending' | 'completed'
    onQuick,
    onSearch,
    onReset,
}) {
    const fields = [
        { label: '제목', value: 'title' },
        { label: '작성자', value: 'author' },
        { label: '내용', value: 'content' },
    ]

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            {/* 1행. 검색 필드 */}
            <div className="flex items-center gap-4 mb-4">
                <select
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-2 focus:border-[#006989] focus:outline-none"
                >
                    {fields.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#006989]"
                    />
                </div>
            </div>

            {/* 2행. 날짜 + 빠른 옵션 */}
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
                                setQuickDays(null)
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
                                setQuickDays(null)
                            }}
                            className="w-32 px-2 py-2 outline-none"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 ml-6 text-sm">
                    {quickOptions.map(opt => {
                        const isActive = quickDays === opt.days
                        return (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => onQuick(opt.days)}
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

            {/* 3행. 상태 라디오 */}
            <div className="flex items-center gap-4 mb-6">
                <span className="w-16 text-gray-700">구분</span>
                {[
                    { label: '전체', value: 'all' },
                    { label: '답변 대기', value: 'pending' },
                    { label: '답변 완료', value: 'completed' },
                ].map(opt => (
                    <label key={opt.value} className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            name="inquiryStatus"
                            value={opt.value}
                            checked={status === opt.value}
                            onChange={() => setStatus(opt.value)}
                            className="form-radio text-[#006989] focus:ring-[#006989]"
                        />
                        <span className="ml-1">{opt.label}</span>
                    </label>
                ))}
            </div>

            {/* 4행. 버튼 */}
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
                        setSearchField('title')
                        setKeyword('')
                        setStartDate('')
                        setEndDate('')
                        setQuickDays(null)
                        setStatus('all')
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                    초기화
                </button>
            </div>
        </div>
    )
}
