// src/pages/my/MyReviewBook.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../atoms'
import { useAxios } from '../../hooks/useAxios'

export default function MyReviewBook() {
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
      .get('/my/reviewBook', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .then(res => setReviews(res.data))
      .catch(err => console.error('리뷰 목록 조회 실패:', err))
  }, [token, axios])

  const renderStars = rating =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ))

  // 0 .. (page+1)*PAGE_SIZE 개만 보이게
  const visible = reviews.slice(0, (page + 1) * PAGE_SIZE)
  const hasMore = (page + 1) * PAGE_SIZE < reviews.length

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-[#006989]">나의 책 후기</h1>
        <p className="text-gray-600">작성한 책 후기를 확인하세요</p>
      </div>

      {/* 빈 상태 */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">작성한 책 후기가 없습니다</p>
          <button
            onClick={() => navigate('/book')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            책 보러가기
          </button>
        </div>
      ) : (
        <>
          {/* 리뷰 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible.map(r => (
              <Link
                to={`/bookDetail/${r.book.bookIsbn}`}
                key={r.bookReviewId}
                className="flex border border-gray-200 rounded-md bg-white hover:shadow-md transition relative"
              >
                <div className="w-28 h-40 flex-shrink-0">
                  {r.book?.bookImg ? (
                    <img
                      src={r.book.bookImg}
                      alt={r.book.title}
                      className="w-full h-full object-cover rounded-l-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between relative">
                  <div className="absolute top-2 right-2 text-sm">
                    {renderStars(r.rating)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">
                      {r.book.title}
                    </h2>
                    <div className="text-xs text-gray-500 mt-1">
                      {r.book.writer} · {r.book.publisher}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(r.regTime).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {r.comment}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="text-center mt-10">
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
