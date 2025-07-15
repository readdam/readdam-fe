// src/pages/my/MyReviewClass.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom } from '../../atoms'
import { url } from '../../config/config'

export default function MyReviewClass() {
  const navigate = useNavigate()
  const token = useAtomValue(tokenAtom)
  const axios = useAxios()

  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(0)

  // 한 페이지당 보여줄 리뷰 개수
  const PAGE_SIZE = 10

  useEffect(() => {
    if (!token?.access_token) return

    axios
      .get('/my/reviewClass', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .then(res => {
        setReviews(res.data)
        setPage(0)
      })
      .catch(err => console.error('내 모임 후기 조회 실패:', err))
  }, [token, axios])

  const renderStars = count =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))

  // (page+1)*PAGE_SIZE 만큼만 보여주기
  const visible = reviews.slice(0, (page + 1) * PAGE_SIZE)
  const hasMore = (page + 1) * PAGE_SIZE < reviews.length

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-[#006989]">나의 모임 후기</h1>
        <p className="text-gray-600">작성한 모임 후기를 확인하세요</p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">작성한 모임 후기가 없습니다</p>
          <button
            onClick={() => navigate('/classList')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            모임 보러가기
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible.map(r => {
              const tags = [r.tag1, r.tag2, r.tag3].filter(Boolean)
              return (
                <Link
                  to={`/classDetail/${r.classId}`}
                  key={r.classReviewId}
                  className="flex border border-gray-200 rounded-md bg-white hover:shadow-md transition relative"
                >
                  {/* 썸네일 */}
                  <div className="w-28 h-40 flex-shrink-0 overflow-hidden rounded-l-md">
                    <img
                      src={
                        r.mainImg
                          ? `${url}/image?filename=${r.mainImg}`
                          : '/images/default-class.png'
                      }
                      alt={r.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 p-4 flex flex-col justify-between relative">
                    <div className="absolute top-2 right-2 text-sm">
                      {renderStars(r.rating)}
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-gray-800">
                        {r.title}
                      </h2>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-4">
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(r.round1Date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {r.round1PlaceLoc}
                        </span>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full text-xs bg-[#E6F4EA] text-[#096445]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-700 mt-4 line-clamp-3">
                        {r.content}
                      </p>
                    </div>
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
