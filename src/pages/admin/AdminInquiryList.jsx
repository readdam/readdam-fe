// src/pages/admin/AdminInquiryListPage.jsx
import React, { useState, useEffect } from 'react'
import AdminInquiryFilter    from '../../components/admin/inquiry/AdminInquiryFilter'
import AdminInquiryListTable from '../../components/admin/inquiry/AdminInquiryListTable'
import AdminInquiryModal     from '../../components/admin/inquiry/AdminInquiryModal'
import { useAxios }          from '../../hooks/useAxios'

const ITEMS_PER_PAGE = 10

export default function AdminInquiryListPage() {
  const axios = useAxios()

  // — 문의 목록 & 페이징 상태 —
  const [inquiries,     setInquiries   ] = useState([])
  const [totalCount,    setTotalCount  ] = useState(0)
  const [totalPages,    setTotalPages  ] = useState(1)
  const [currentPage,   setCurrentPage ] = useState(1)

  // — 필터 입력 상태 —
  const [searchField,   setSearchField  ] = useState('title')     // 'title' | 'author' | 'content'
  const [keyword,       setKeyword      ] = useState('')
  const [startDate,     setStartDate    ] = useState('')
  const [endDate,       setEndDate      ] = useState('')
  const [quickDays,     setQuickDays    ] = useState(null)        // number|null
  const [status,        setStatus       ] = useState('all')       // 'all' | 'pending' | 'completed'

  // — 모달 상태 —
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [answerText,      setAnswerText     ] = useState('')

  // — 빠른 기간 선택 —
  const onQuick = days => {
    if (days == null) {
      setStartDate('')
      setEndDate('')
      setQuickDays(null)
    } else {
      const today = new Date()
      const past  = new Date()
      past.setDate(today.getDate() - days)
      setStartDate(past.toISOString().slice(0,10))
      setEndDate(today.toISOString().slice(0,10))
      setQuickDays(days)
    }
    setCurrentPage(1)
  }

  // — 목록 조회 함수 —
  const fetchInquiries = async () => {
    const params = {
      page: currentPage - 1,
      size: ITEMS_PER_PAGE,
    }
    if (keyword) {
      params.filterType = searchField
      params.keyword    = keyword
    }
    if (startDate) params.startDate = startDate
    if (endDate)   params.endDate   = endDate
    if (status !== 'all') {
      params.status = status === 'pending' ? 'UNANSWERED' : 'ANSWERED'
    }
    try {
      const { data } = await axios.get('/admin/inquiry', { params })
      setInquiries(data.content)
      setTotalCount(data.pageInfo.totalElements)
      setTotalPages(data.pageInfo.totalPages)
    } catch (err) {
      console.error('문의 목록 조회 실패', err)
    }
  }

  // — 페이지나 필터 변경 시 자동 조회 —
  useEffect(() => {
    fetchInquiries()
  }, [currentPage, searchField, keyword, startDate, endDate, status])

  // — 검색 버튼 —
  const handleSearch = () => {
    setCurrentPage(1)
    fetchInquiries()
  }

  // — 초기화 버튼 —
  const handleReset = () => {
    setSearchField('title')
    setKeyword('')
    setStartDate('')
    setEndDate('')
    setQuickDays(null)
    setStatus('all')
    setCurrentPage(1)
  }

  // — 답변 저장 —
  const handleSaveAnswer = async () => {
    if (!selectedInquiry || !answerText.trim()) return
    try {
      await axios.patch(
        `/admin/inquiry/${selectedInquiry.inquiryId}/answer`,
        { answer: answerText }
      )
      setSelectedInquiry(null)
      setAnswerText('')
      fetchInquiries()
    } catch (err) {
      console.error('답변 저장 실패', err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
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

      {/* 리스트 테이블 */}
      <AdminInquiryListTable
        items={inquiries}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onSelectInquiry={inq => {
          setSelectedInquiry(inq)
          setAnswerText(inq.answer || '')
        }}
      />

      {/* 상세 모달 */}
      <AdminInquiryModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        answerText={answerText}
        setAnswerText={setAnswerText}
        onSaveAnswer={handleSaveAnswer}
      />
    </div>
  )
}
