// src/pages/admin/AdminEventReg.jsx
import React, { useState, useEffect } from 'react'
import { HomeIcon } from 'lucide-react'
import EventTopicRegistration from '../../components/admin/EventTopicRegistration'
import EventStatusList         from '../../components/admin/EventStatusList'
import { useAxios }            from '../../hooks/useAxios'

const AdminEventReg = () => {
  const axios = useAxios()

  // 폼 상태
  const [eventForm, setEventForm] = useState({
    month: '',
    startDate: '',
    endDate: '',
    title: '',
  })

  // 백에서 받아온 이벤트 목록
  const [upcoming, setUpcoming]   = useState([])
  const [ongoing, setOngoing]     = useState([])
  const [completed, setCompleted] = useState([])

  // 로딩 상태(optional)
  const [loading, setLoading] = useState(false)

  // 백엔드에서 이벤트 목록을 가져오는 함수
  const fetchEvents = async () => {
    setLoading(true)
    try {
      const [resUp, resOn, resCo] = await Promise.all([
        axios.get('/admin/events/upcoming'),
        axios.get('/admin/events/ongoing'),
        axios.get('/admin/events/completed'),
      ])
      setUpcoming(resUp.data)
      setOngoing(resOn.data)
      setCompleted(resCo.data)
    } catch (err) {
      console.error('이벤트 목록 조회 실패', err)
      alert('이벤트 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // month 선택 시 자동 start/end 세팅
  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'month') {
      const first = `${value}-01`
      const [y, m]   = value.split('-').map(v => parseInt(v, 10))
      const lastDay  = new Date(y, m, 0).getDate().toString().padStart(2, '0')
      const last    = `${value}-${lastDay}`
      setEventForm(prev => ({ ...prev, month: value, startDate: first, endDate: last }))
    } else {
      setEventForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // 새 이벤트 등록
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('/admin/events', {
        title:      eventForm.title,
        startTime:  eventForm.startDate + 'T00:00:00',
        endTime:    eventForm.endDate   + 'T23:59:59',
      })
      setEventForm({ month: '', startDate: '', endDate: '', title: '' })
      fetchEvents()
      alert('이벤트가 성공적으로 등록되었습니다.')
    } catch (err) {
      console.error('이벤트 등록 실패', err)
      alert('이벤트 등록 중 오류가 발생했습니다.')
    }
  }

  // 완료된 이벤트에 포인트 지급 (+알림)
  const handlePointsDistribution = async id => {
    try {
      await axios.post(`/admin/events/${id}/distribute-points`)
      alert('포인트 지급이 완료되었습니다.')
      fetchEvents()
    } catch (err) {
      console.error('포인트 지급 실패', err)
      alert('포인트 지급 중 오류가 발생했습니다.')
    }
  }

  // 예정/완료 이벤트 삭제
  const handleDelete = async id => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await axios.delete(`/admin/events/${id}`)
      fetchEvents()
      alert('이벤트가 삭제되었습니다.')
    } catch (err) {
      console.error('이벤트 삭제 실패', err)
      alert('이벤트 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <HomeIcon className="w-4 h-4" />
          <span>이벤트 관리</span>
        </div>

        {/* 이벤트 주제 등록 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            이벤트 주제 등록
          </h2>
          <EventTopicRegistration
            eventForm={eventForm}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>

        {/* 이벤트 현황 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            이벤트 현황
          </h2>
          {loading
            ? <p className="text-center text-gray-500">로딩 중...</p>
            : (
              <EventStatusList
                events={[...upcoming, ...ongoing, ...completed]}
                onPointsDistribution={handlePointsDistribution}
                onDelete={handleDelete}
              />
            )
          }
        </section>
      </div>
    </div>
  )
}

export default AdminEventReg
