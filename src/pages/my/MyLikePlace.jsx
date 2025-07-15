// src/pages/my/MyLikePlace.jsx
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom } from '../../atoms'
import { url } from '../../config/config'
import { MapPinIcon, HeartIcon, PhoneIcon } from 'lucide-react'

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
]

// 한 페이지당 보여줄 아이템 수
const ITEMS_PER_PAGE = 12

export default function MyLikePlace() {
  const location = useLocation()
  const token = useAtomValue(tokenAtom)
  const axios = useAxios()

  const [places, setPlaces] = useState([])
  const [page, setPage] = useState(0)  // 페이지 인덱스(0부터)

  useEffect(() => {
    if (!token?.access_token) return

    axios
      .get(`${url}/my/likePlace`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data.places || []
        const mapped = list.map(p => ({
          id: p.id,
          type: p.type,
          name: p.name,
          basicAddress: p.basicAddress,
          detailAddress: p.detailAddress,
          phone: p.phone || '정보 없음',
          categories: [
            p.tag1, p.tag2, p.tag3, p.tag4, p.tag5,
            p.tag6, p.tag7, p.tag8, p.tag9, p.tag10,
          ].filter(t => t && t.trim()),
          image: p.img1 || '',
        }))
        setPlaces(mapped)
        setPage(0)  // 데이터 로드할 때마다 페이지 초기화
      })
      .catch(() => setPlaces([]))
  }, [token, axios])

  const toggleLike = place => {
    const { id, type } = place
    if (!token?.access_token) {
      alert('로그인이 필요합니다.')
      return
    }

    // UI 최적화: 즉시 제거
    setPlaces(prev => prev.filter(p => !(p.id === id && p.type === type)))

    axios
      .post(
        `${url}/my/unified-place-like`,
        {},
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
          params: { id, type },
        }
      )
      .then(res => {
        if (!res.data.liked) {
          alert('좋아요가 취소되었습니다.')
        } else {
          // 다시 좋아요된 경우 복원
          setPlaces(prev => [place, ...prev])
        }
      })
      .catch(() => {
        alert('좋아요 처리 중 오류가 발생했습니다.')
        setPlaces(prev => [place, ...prev])
      })
  }

  const safe = Array.isArray(places) ? places : []
  // slice 범위: 0부터 (page+1)*ITEMS_PER_PAGE
  const visible = safe.slice(0, (page + 1) * ITEMS_PER_PAGE)
  const hasMore = (page + 1) * ITEMS_PER_PAGE < safe.length

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">좋아요</h1>
        <p className="text-gray-600">좋아요한 장소를 확인하세요</p>
      </div>

      {/* 탭 */}
      <div className="flex space-x-6 border-b mb-8 text-sm">
        {tabs.map(tab => (
          <Link
            key={tab.label}
            to={tab.path}
            className={`pb-2 transition-all ${
              location.pathname === tab.path
                ? 'text-[#005C78] border-b-2 border-[#005C78] font-semibold'
                : 'text-gray-500 hover:text-[#006989]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 콘텐츠 */}
      {safe.length === 0 ? (
        <div className="text-center py-20">
          <p className="mb-4 text-gray-600">아직 좋아요한 장소가 없습니다.</p>
          <Link
            to="/place"
            className="inline-block px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            장소 보러가기
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {visible.map((place, idx) => (
              <div
                key={`${place.type}-${place.id}-${idx}`}
                className="relative bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleLike(place)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
                >
                  <HeartIcon
                    fill="#E88D67"
                    stroke="#E88D67"
                    className="w-5 h-5"
                  />
                </button>

                <Link to={`/placeDetail/${place.id}`}>
                  {place.image ? (
                    <img
                      src={`${url}/image?filename=${place.image}`}
                      alt={place.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      <MapPinIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    {place.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {place.categories.map(cat => (
                          <span
                            key={cat}
                            className="text-xs bg-[#F3F7EC] text-[#005C78] px-2 py-0.5 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="font-semibold text-base line-clamp-1">
                      {place.name}
                    </div>

                    <div className="flex items-start">
                      <MapPinIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        {place.basicAddress} {place.detailAddress}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <PhoneIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
                      <span className="text-gray-700">{place.phone}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setPage(prev => prev + 1)}
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
