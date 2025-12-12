// src/pages/admin/AdminReportPage.jsx
import React, { useState, useEffect } from 'react'
import { useAxios } from '../../hooks/useAxios'
import AdminReportFilter from '../../components/admin/report/AdminReportFilter'
import AdminReportList from '../../components/admin/report/AdminReportList'
import AdminReportDetailModal from '../../components/admin/report/AdminReportDetailModal'

export default function AdminReportPage() {
  const axios = useAxios()

  const [reports, setReports] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [filterType, setFilterType] = useState('user')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedQuickDays, setSelectedQuickDays] = useState(null)
  const [status, setStatus] = useState('전체')
  const [page, setPage] = useState(1)
  const size = 10

  const [showDetail, setShowDetail] = useState(false)
  const [detailData, setDetailData] = useState(null)

  const fmt = d => d.toISOString().slice(0, 10)

  const loadReports = async () => {
    try {
      const { data } = await axios.get('/admin/report', {
        params: {
          keyword,
          filterType,
          dateType: '접수일',
          startDate,
          endDate,
          status: status === '전체' ? '' : status,
          page,
          size,
        },
      })
      setReports(data.content)
      setPageInfo(data.pageInfo)
    } catch (e) {
      console.error('신고 목록 조회 실패', e)
    }
  }

  useEffect(() => {
    loadReports()
  }, [page])

  const handleRowClick = async (r) => {
    try {
      const { data } = await axios.get(`/admin/report/${r.reportId}`)
      setDetailData(data)
      setShowDetail(true)
    } catch (e) {
      console.error('상세 정보 로드 실패', e)
    }
  }

  const onQuick = opt => {
    const today = new Date()
    if (opt.days === -1) {
      setStartDate(''); setEndDate('')
    } else {
      const past = new Date(today)
      past.setDate(today.getDate() - opt.days)
      setStartDate(fmt(past)); setEndDate(fmt(today))
    }
    setSelectedQuickDays(opt.days)
  }

  const handleSearch = () => {
    setPage(1)
    loadReports()
  }

  const handleReset = () => {
    setKeyword(''); setFilterType('user')
    setStartDate(''); setEndDate('')
    setSelectedQuickDays(null); setStatus('전체')
    setPage(1)
    loadReports()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 브레드크럼 + 제목 (카드 바깥) */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>관리자</span>
          <span className="mx-2">›</span>
          <span>신고 관리</span>
        </div>
        <h2 className="text-2xl font-bold">신고 관리</h2>
      </div>

      {/* 카드: 필터 + 리스트 + 페이징 */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 space-y-8">
        {/* 필터 */}
        <AdminReportFilter
          keyword={keyword} setKeyword={setKeyword}
          filterType={filterType} setFilterType={setFilterType}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          selectedQuickDays={selectedQuickDays} setSelectedQuickDays={setSelectedQuickDays}
          status={status} setStatus={setStatus}
          onQuick={onQuick}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* 리스트 */}
        <AdminReportList
          reports={reports}
            totalCount={pageInfo?.totalElements ?? 0}
          showDetail={showDetail}
          selected={detailData?.report}
          onRowClick={handleRowClick}
          onCloseModal={() => setShowDetail(false)}
        />

        {/* 페이징 (카드 안쪽 하단) */}
        {pageInfo && (
          <div className="flex justify-center items-center space-x-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              이전
            </button>

            {Array.from({ length: pageInfo.totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${p === page ? 'bg-[#006989] text-white' : 'hover:bg-gray-100'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage(Math.min(page + 1, pageInfo.totalPages))}
              disabled={!pageInfo.hasNext}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              다음
            </button>
          </div>
        )}

      </div>

      {/* 상세 모달 */}
      {showDetail && detailData && (
        <AdminReportDetailModal
          detail={detailData}
          onClose={() => setShowDetail(false)}
          onUpdated={() => {
            setShowDetail(false)
            loadReports()
          }}
        />
      )}
    </div>
  )
}
