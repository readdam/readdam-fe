// src/components/admin/AdminReportPage.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminReportFilter from '../../components/admin/AdminReportFilter'
import AdminReportList from '../../components/admin/AdminReportList'
import AdminReportDetailModal from '../../components/admin/AdminReportDetailModal'

export default function AdminReportPage() {
  const [reports, setReports] = useState([])
  const [pageInfo, setPageInfo] = useState(null)

  const [keyword, setKeyword] = useState('')
  const [filterType, setFilterType] = useState('user')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedQuickDays, setSelectedQuickDays] = useState(null)
  const [status, setStatus] = useState('전체')

  const [page, setPage] = useState(1)
  const size = 20

  const [showDetail, setShowDetail] = useState(false)
  const [detailData, setDetailData] = useState(null)

  const fmt = d => d.toISOString().slice(0,10)

  const loadReports = async () => {
    const { data } = await axios.get('/admin/report', {
      params: {
        keyword, filterType, dateType: '접수일',
        startDate, endDate,
        status: status==='전체'?'':status,
        page, size,
      },
    })
    setReports(data.content)
    setPageInfo(data.pageInfo)
  }

  useEffect(() => {
    loadReports()
  }, [page])

  // 상세 클릭 시
  const handleRowClick = async (r) => {
    // 1) 백엔드에서 detailDto 가져오기
    const { data } = await axios.get(`/admin/report/${r.reportId}`)
    setDetailData(data)
    setShowDetail(true)
  }

  const handleClose = () => {
    setShowDetail(false)
    setDetailData(null)
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <AdminReportFilter
        keyword={keyword} setKeyword={setKeyword}
        filterType={filterType} setFilterType={setFilterType}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        selectedQuickDays={selectedQuickDays}
        setSelectedQuickDays={setSelectedQuickDays}
        status={status} setStatus={setStatus}
        onQuick={onQuick}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <AdminReportList
        reports={reports}
        showDetail={showDetail}
        selected={detailData?.report}
        onRowClick={handleRowClick}
        onCloseModal={handleClose}
      />

      {showDetail && detailData && (
        <AdminReportDetailModal
          detail={detailData}
          onClose={handleClose}
          onUpdated={() => {
            handleClose()
            loadReports()
          }}
        />
      )}

      {pageInfo && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            type="button"
            disabled={pageInfo.currentPage === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            이전
          </button>
          <span>{pageInfo.currentPage} / {pageInfo.totalPages}</span>
          <button
            type="button"
            disabled={!pageInfo.hasNext}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
