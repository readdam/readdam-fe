import React, { useState, useEffect } from 'react'
import AdminInquiryFilter from '../../components/admin/inquiry/AdminInquiryFilter'
import AdminInquiryListTable from '../../components/admin/inquiry/AdminInquiryListTable'
import AdminInquiryModal from '../../components/admin/inquiry/AdminInquiryModal'
import { useAxios } from '../../hooks/useAxios'

const ITEMS_PER_PAGE = 10

export default function AdminInquiryListPage() {
  const axios = useAxios()

  const [inquiries, setInquiries] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const [searchField, setSearchField] = useState('title')
  const [keyword, setKeyword] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [quickDays, setQuickDays] = useState(null)
  const [status, setStatus] = useState('all')

  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [answerText, setAnswerText] = useState('')

  const loadInquiries = async (page = 1) => {
    const params = { page: page - 1, size: ITEMS_PER_PAGE }
    if (keyword) params.filterType = searchField, params.keyword = keyword
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (status !== 'all') {
      params.status = status === 'pending' ? 'UNANSWERED' : 'ANSWERED'
    }

    try {
      const { data } = await axios.get('/admin/inquiry', { params })
      setInquiries(data.content)
      setTotalCount(data.pageInfo.totalElements)
      setTotalPages(data.pageInfo.totalPages)
      setCurrentPage(page)
    } catch (err) {
      console.error('문의 목록 조회 실패', err)
    }
  }

  useEffect(() => {
    loadInquiries(1)
  }, [])

  const onQuick = days => {
    if (days == null) {
      setStartDate(''); setEndDate(''); setQuickDays(null)
    } else {
      const today = new Date()
      const past = new Date()
      past.setDate(today.getDate() - days)
      setStartDate(past.toISOString().slice(0, 10))
      setEndDate(today.toISOString().slice(0, 10))
      setQuickDays(days)
    }
    // 조회는 검색 버튼에서만
  }

  const handleSearch = () => {
    loadInquiries(1)
  }

  const handleReset = () => {
    setSearchField('title')
    setKeyword('')
    setStartDate('')
    setEndDate('')
    setQuickDays(null)
    setStatus('all')
    loadInquiries(1)
  }

  const handleSaveAnswer = async () => {
    if (!selectedInquiry || !answerText.trim()) return
    try {
      await axios.patch(
        `/admin/inquiry/${selectedInquiry.inquiryId}/answer`,
        { answer: answerText }
      )
      setSelectedInquiry(null)
      setAnswerText('')
      loadInquiries(currentPage)
    } catch (err) {
      console.error('답변 저장 실패', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 카드 바깥: 브레드크럼 + 제목 */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>관리자</span>
          <span className="mx-2">›</span>
          <span>1:1 문의 관리</span>
        </div>
        <h2 className="text-2xl font-bold">1:1 문의 관리</h2>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">

        {/* 필터 */}
        <AdminInquiryFilter
          searchField={searchField}
          setSearchField={setSearchField}
          keyword={keyword}
          setKeyword={setKeyword}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          quickDays={quickDays}
          setQuickDays={setQuickDays}
          status={status}
          setStatus={setStatus}
          onQuick={onQuick}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* 테이블 (가로 스크롤만) */}
        <div className="overflow-x-auto">
          <AdminInquiryListTable
            items={inquiries}
            totalCount={totalCount}
            onSelectInquiry={inq => {
              setSelectedInquiry(inq)
              setAnswerText(inq.answer || '')
            }}
          />
        </div>

        {/* 페이징 버튼 */}
        {(
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => loadInquiries(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => loadInquiries(page)}
                className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-[#006989] text-white' : 'hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => loadInquiries(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              다음
            </button>
          </div>
        )}

        {/* 상세 모달 */}
        {selectedInquiry && (
          <AdminInquiryModal
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            answerText={answerText}
            setAnswerText={setAnswerText}
            onSaveAnswer={handleSaveAnswer}
          />
        )}
      </div>
    </div>
  )
}
