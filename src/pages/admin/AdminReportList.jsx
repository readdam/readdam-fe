// src/components/admin/AdminReportPage.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminReportFilter from '../../components/admin/AdminReportFilter'
import AdminReportList from '../../components/admin/AdminReportList'

export default function AdminReportPage() {
  const [reports, setReports] = useState([])
  const [keyword, setKeyword] = useState('')
  const [filterType, setFilterType] = useState('reporter')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedQuickDays, setSelectedQuickDays] = useState(null)
  const [status, setStatus] = useState('전체')

  const [showDetail, setShowDetail] = useState(false)
  const [selected, setSelected] = useState(null)

  const loadReports = async () => {
    const { data } = await axios.get('/api/admin/reports', {
      params: {
        keyword,
        filterType,
        dateType: '접수일',
        startDate,
        endDate,
        status: status === '전체' ? '' : status,
      },
    })
    setReports(data)
  }

  useEffect(() => { loadReports() }, [])

  const fmt = d => d.toISOString().slice(0,10)
  const onQuick = opt => {
    const today = new Date()
    if (opt.days === null) {
      setStartDate(''); setEndDate('')
    } else {
      const past = new Date(today)
      past.setDate(past.getDate() - opt.days)
      setStartDate(fmt(past))
      setEndDate(fmt(today))
    }
    
  }

  const handleSearch = () => loadReports()
  const handleReset = () => {
    setKeyword(''); setFilterType('reporter')
    setStartDate(''); setEndDate('')
    setSelectedQuickDays(null); setStatus('전체')
    loadReports()
  }
  const handleRowClick = r => { setSelected(r); setShowDetail(true) }
  const handleClose = () => setShowDetail(false)

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
        selected={selected}
        onRowClick={handleRowClick}
        onCloseModal={handleClose}
      />
    </div>
  )
}
