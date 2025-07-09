// src/pages/my/MyReservation.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom } from '../../atoms'
import { url } from '../../config/config'
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
} from 'lucide-react'

const FILTER_TABS = [
  { label: '전체', key: 'ALL' },
  { label: '예약중', key: 'PENDING' },
  { label: '예약확정', key: 'CONFIRMED' },
  { label: '취소완료', key: 'CANCELLED' },
]

// 한 페이지당 보여줄 예약 수
const ITEMS_PER_PAGE = 12

export default function MyReservation() {
  const navigate = useNavigate()
  const token = useAtomValue(tokenAtom)
  const api = useAxios()

  const [reservations, setReservations] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!token?.access_token) return
    api
      .get(`${url}/my/reservations`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => {
        setReservations(res.data)
        setPage(0)
      })
      .catch(console.error)
  }, [token, api])

  const today = new Date().toISOString().slice(0, 10)

  const filtered = reservations.filter(r => {
    switch (filter) {
      case 'PENDING':      // 예약중
        return r.status === 'PENDING'
      case 'CONFIRMED':    // 예약확정
        return r.status === 'CONFIRMED'
      case 'CANCELLED':    // 취소완료
        return r.status === 'CANCELLED'
      default:             // 전체
        return true
    }
  })

  const visible = filtered.slice(0, (page + 1) * ITEMS_PER_PAGE)
  const hasMore = (page + 1) * ITEMS_PER_PAGE < filtered.length

  const handleCancel = async (id, e) => {
    e.preventDefault(); e.stopPropagation()
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) return
    try {
      await api.delete(`${url}/my/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      setReservations(prev =>
        prev.map(r =>
          r.reservationId === id ? { ...r, status: 'CANCELLED' } : r
        )
      )
    } catch (error) {
      alert(error.response?.data || '예약 취소 중 오류 발생')
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">내 예약</h1>
        <p className="text-gray-600">예약한 장소를 확인하세요</p>
      </div>

      {/* 필터 탭 */}
      <div className="flex space-x-3 mb-6">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setPage(0) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === tab.key
                ? 'bg-[#006989] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">조건에 맞는 예약이 없습니다.</p>
          <button
            onClick={() => navigate('/place')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            장소 보러 가기
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visible.map(post => {
              const isToday = post.date === today
              return (
                <Link
                  key={post.reservationId}
                  to={`/placeDetail/${post.placeId}`}
                  className="relative block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={
                      post.image
                        ? `${url}/image?filename=${post.image}`
                        : '/images/default.jpg'
                    }
                    alt={post.placeName}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-base line-clamp-1">
                      {post.placeName}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>
                        {post.basicAddress} {post.detailAddress}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{post.timeRange}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-1">
                      <UsersIcon className="w-4 h-4" />
                      <span>인원 {post.participantCount}명</span>
                    </div>

                    {/* 상태 버튼 */}
                    {post.status === 'CONFIRMED' ? (
                      <button
                        type="button"
                        className="mt-3 w-full h-10 rounded-md text-sm font-semibold bg-green-100 text-green-800 cursor-default pointer-events-none flex items-center justify-center"
                      >
                        확정됨
                      </button>
                    ) : post.status === 'CANCELLED' ? (
                      <button
                        type="button"
                        className="mt-3 w-full h-10 rounded-md text-sm font-semibold bg-red-100 text-red-800 cursor-default pointer-events-none flex items-center justify-center"
                      >
                        취소됨
                      </button>
                    ) : (
                      <button
                        onClick={e => handleCancel(post.reservationId, e)}
                        disabled={isToday}
                        className={`mt-3 w-full h-10 rounded-md text-sm font-semibold flex items-center justify-center ${isToday
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-[#E88D67] hover:bg-[#d47c5a] text-white'
                          }`}
                      >
                        {isToday ? '당일 취소 불가' : '예약 취소'}
                      </button>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2 border border-[#006989] text-[#006989] rounded-md text-sm hover:bg-[#F3F7EC] transition"
              >
                더보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
