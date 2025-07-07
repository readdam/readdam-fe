// src/pages/my/MyLikeBook.jsx
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom, userAtom } from '../../atoms'
import { StarIcon, HeartIcon, MessageSquareIcon } from 'lucide-react'

const tabs = [
  { label: '모임',   path: '/myLikeClass' },
  { label: '장소',   path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책',     path: '/myLikeBook' },
]

const ITEMS_PER_PAGE = 16

export default function MyLikeBook() {
  const location = useLocation()
  const navigate = useNavigate()
  const token    = useAtomValue(tokenAtom)
  const user     = useAtomValue(userAtom)
  const axios    = useAxios()

  const [books,    setBooks]    = useState([])  // BookDto[]
  const [showAll,  setShowAll]  = useState(false)

  // 1) 좋아요한 책 목록 불러오기
  useEffect(() => {
    if (!token?.access_token) return

    axios.get('/my/likeBook', { withCredentials: true })
      .then(res => {
        setBooks(res.data)
      })
      .catch(() => setBooks([]))
  }, [token, user.username, axios])

  // 2) 토글 처리: /book-like?bookIsbn=xxx
  const toggleLike = (book) => {
    if (!token?.access_token) {
      alert('로그인이 필요합니다.')
      return navigate('/login')
    }

    // 즉시 UI에서 제거
    setBooks(prev => prev.filter(b => b.bookIsbn !== book.bookIsbn))

    axios.post('/book-like', null, {
      params: { bookIsbn: book.bookIsbn },
      withCredentials: true
    })
    .then(res => {
      const msg = res.data // "좋아요 완료" or "좋아요 취소"
      if (msg.includes('취소')) {
        alert('책 좋아요가 취소되었습니다.')
      } else {
        // 혹시 다시 좋아요 처리되었다면 복원
        setBooks(prev => [book, ...prev])
      }
    })
    .catch(() => {
      alert('좋아요 처리 중 오류가 발생했습니다.')
      // 오류 시 복원
      setBooks(prev => [book, ...prev])
    })
  }

  const display = showAll ? books : books.slice(0, ITEMS_PER_PAGE)

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">좋아요</h1>
        <p className="text-gray-600">좋아요한 책을 확인하세요</p>
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
      {books.length === 0
        ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 mb-4">아직 좋아요한 책이 없습니다.</p>
            <button
              onClick={() => navigate('/book')}
              className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
            >
              책 보러가기
            </button>
          </div>
        )
        : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {display.map(book => (
                <div
                  key={book.bookIsbn}
                  className="relative bg-white border border-[#006989] rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                >
                  {/* 좋아요 토글 버튼 */}
                  <button
                    onClick={() => toggleLike(book)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
                  >
                    <HeartIcon
                      fill="#E88D67"
                      stroke="#E88D67"
                      className="w-5 h-5"
                    />
                  </button>

                  <Link to={`/bookDetail/${book.bookIsbn}`} className="block">
                    <img
                      src={book.bookImg}
                      alt={book.title}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-3 space-y-1">
                      <div className="text-base font-semibold truncate">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {book.writer} · {book.publisher}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                        <StarIcon className="w-4 h-4 text-[#E88D67]" />
                        <span>{book.rating?.toFixed(1) ?? '0.0'}</span>
                        <span className="ml-4">
                          <MessageSquareIcon className="w-4 h-4 inline-block" />{' '}
                          {book.reviewCnt ?? 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {!showAll && books.length > ITEMS_PER_PAGE && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 border border-[#006989] text-[#006989] rounded-md text-sm hover:bg-[#F3F7EC] transition"
                >
                  더보기
                </button>
              </div>
            )}
          </>
        )
      }
    </div>
  )
}
