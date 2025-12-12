// src/components/admin/AdminPointStats.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../atoms'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from 'recharts'
import { url } from '../../config/config'

// 1) 요약 카드 초기값
const initialSummary = {
  todayAmount:  0, todayCount:  0,
  weekAmount:   0, weekCount:   0,
  monthAmount:  0, monthCount:  0,
  yearAmount:   0, yearCount:   0,
}

// 2) 시작~종료 기간의 모든 레이블(날짜 혹은 월) 생성 및 rawData 매핑
function buildFullData(start, end, period, rawData) {
  const out = []
  const map = rawData.reduce((m, row) => {
    m[row.label] = row
    return m
  }, {})

  const s = new Date(start)
  const e = new Date(end)

  if (period === 'day') {
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      const label = d.toISOString().slice(0,10)
      const ex = map[label] || {}
      out.push({
        label,
        totalAmount:  ex.totalAmount  || 0,
        netAmount:    ex.netAmount    || 0,
        refundAmount: ex.refundAmount || 0,
        successCount: ex.successCount || 0,
        refundCount:  ex.refundCount  || 0,
      })
    }
  } else {
    const curr = new Date(s.getFullYear(), s.getMonth(), 1)
    const last = new Date(e.getFullYear(), e.getMonth(), 1)
    while (curr <= last) {
      const mm = (curr.getMonth()+1).toString().padStart(2,'0')
      const label = `${curr.getFullYear()}-${mm}`
      const ex = map[label] || {}
      out.push({
        label,
        totalAmount:  ex.totalAmount  || 0,
        netAmount:    ex.netAmount    || 0,
        refundAmount: ex.refundAmount || 0,
        successCount: ex.successCount || 0,
        refundCount:  ex.refundCount  || 0,
      })
      curr.setMonth(curr.getMonth()+1)
    }
  }
  return out
}

// 3) 툴팁에서만 모든 값을 보여주는 컴포넌트
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white p-4 border rounded shadow">
      <div className="font-semibold mb-2">{label}</div>
      <div>총 금액: {d.totalAmount.toLocaleString()}원</div>
      <div>실 매출: {d.netAmount.toLocaleString()}원</div>
      <div>환불 금액: {d.refundAmount.toLocaleString()}원</div>
      <div>성공 결제 건수: {d.successCount}건</div>
      <div>환불 처리 건수: {d.refundCount}건</div>
    </div>
  )
}

export default function AdminPointStats() {
  const token    = useAtomValue(tokenAtom)
  const navigate = useNavigate()

  // 🔹 state
  const [summary, setSummary] = useState(initialSummary)
  const [data,    setData]    = useState([])
  const [loading,setLoading]  = useState(true)

  // 🔹 필터: 기본은 오늘 기준 7일 전 ~ 오늘
  const today = new Date()
  const fmt   = d => d.toISOString().slice(0,10)
  const [startDate, setStartDate] = useState(fmt(new Date(today - 7*86400000)))
  const [endDate,   setEndDate]   = useState(fmt(today))
  const [period,    setPeriod]    = useState('day')  // 'day' or 'month'

  // 🔹 API 호출 함수
  const fetchStats = useCallback(() => {
    if (!token?.access_token) {
      navigate('/login', { replace: true })
      return
    }
    setLoading(true)
    axios.get(`${url}/admin/point-stats`, {
      params:  { start: startDate, end: endDate, period },
      headers: { Authorization: `Bearer ${token.access_token}` }
    })
    .then(res => {
      const srv = res.data
      setSummary(srv.summary  || initialSummary)
      setData(buildFullData(startDate, endDate, period, srv.chart || []))
    })
    .catch(err => {
      if ([401,403].includes(err.response?.status)) {
        navigate('/login', { replace: true })
      }
      console.error('통계 조회 실패', err)
    })
    .finally(() => setLoading(false))
  }, [token, startDate, endDate, period, navigate])

  useEffect(fetchStats, [fetchStats])

  // 🔹 빠른 기간 버튼 핸들러
  const applyQuick = months => {
    const d = new Date()
    d.setMonth(d.getMonth() - months)
    setStartDate(fmt(d))
    setEndDate(fmt(new Date()))
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">로딩 중…</div>
  }

return (
     <div className="bg-gray-50 min-h-screen p-6">
    {/* 1) 브레드크럼 + 페이지 제목 */}
    <div className="max-w-5xl mx-auto px-5 mb-4">
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <span>관리자</span>
        <span className="mx-2">›</span>
        <span className="text-[#006989]">포인트 통계</span>
      </div>
      <h2 className="text-2xl font-bold">포인트 통계</h2>
    </div>

      {/* 2) 본문 컨테이너 (요약 카드, 필터, 차트) */}
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* 2-1) 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ['오늘',   summary.todayAmount,  summary.todayCount,  'text-gray-800'],
            ['이번주', summary.weekAmount,   summary.weekCount,   'text-green-600'],
            ['이번달', summary.monthAmount,  summary.monthCount,  'text-blue-600'],
            ['올해',   summary.yearAmount,   summary.yearCount,   'text-purple-600'],
          ].map(([label, amt, cnt, color], i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
              <span className="text-sm text-gray-500">{label}</span>
              <span className={`text-2xl font-extrabold ${color}`}>
                {amt.toLocaleString()}원
              </span>
              <span className="text-sm text-gray-400 mt-auto">{cnt}건</span>
            </div>
          ))}
        </div>

        {/* 2-2) 필터 UI */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-wrap items-end gap-4">
          {/* 빠른 기간 버튼 */}
          <div className="flex space-x-2">
            {[1,3,6,12].map(m => (
              <button
                key={m}
                onClick={() => applyQuick(m)}
                className="px-4 py-2 border border-[#006989] text-[#006989] rounded hover:bg-[#006989] hover:text-white"
              >
                {m}개월
              </button>
            ))}
          </div>
          {/* 날짜 선택 */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded"
            />
          </div>
          {/* 일별/월별 선택 */}
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="day">일별</option>
            <option value="month">월별</option>
          </select>
          {/* 조회 버튼 */}
          <button
            onClick={fetchStats}
            className="ml-auto bg-[#006989] text-white px-6 py-2 rounded-lg hover:bg-[#005f6f]"
          >
            조회
          </button>
        </div>

        {/* 2-3) 차트 */}
        <div className="bg-white p-8 rounded-xl shadow-sm h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top:20, right:50, left:0, bottom:5 }}
              barCategoryGap="50%"
              barGap={8}
            >
              <CartesianGrid strokeDasharray="4 2" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="amt"
                tickFormatter={v => v.toLocaleString()}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <YAxis
                yAxisId="cnt"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ paddingTop:16 }}/>
              <Bar yAxisId="amt" dataKey="totalAmount"   name="총 금액"   fill="#4ade80" radius={[4,4,0,0]} barSize={16}/>
              <Bar yAxisId="amt" dataKey="netAmount"     name="실 매출"   fill="#60a5fa" radius={[4,4,0,0]} barSize={16}/>
              <Bar yAxisId="amt" dataKey="refundAmount"  name="환불 금액" fill="#f87171" radius={[4,4,0,0]} barSize={16}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  ) 
}
