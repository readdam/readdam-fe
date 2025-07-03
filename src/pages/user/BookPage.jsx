// src/pages/BookPage.jsx
import React, { useState, useEffect } from 'react'
import {
  SearchIcon,
  BookOpenIcon,
  TrendingUpIcon,
  StarIcon,
  ChevronDownIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios'
import { useAtom } from 'jotai'
import { tokenAtom } from '../../atoms'
import LibraryModal from '../../components/book/LibraryModal'

const BookPage = () => {
  const axios    = useAxios()
  const navigate = useNavigate()
  const [token]  = useAtom(tokenAtom)

  // ── 검색 & 기간 드롭다운 ──────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const periods = [
    { label: '일간', value: 'DAILY' },
    { label: '주간', value: 'WEEKLY' },
    { label: '월간', value: 'MONTHLY' },
  ]
  const [period, setPeriod] = useState(periods[0].value)
  const selectedLabel = periods.find(p => p.value === period)?.label

  // ── 페이징 상태 ───────────────────────────
  const [page, setPage] = useState(1)
  const size            = 20
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, hasNext: false })
  const [books, setBooks]       = useState([])

  // ── 서재 추가 모달 상태 ───────────────────
  const [modalOpen, setModalOpen]     = useState(false)
  const [currentBook, setCurrentBook] = useState(null)

  // ── 도서 데이터 로드 ─────────────────────
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data } = await axios.get('/api/books/bestsellers', {
          params: { period, page, size },
        })
        setBooks(data.content || [])
        setPageInfo(data.pageInfo || { totalPages: 0, hasNext: false })
      } catch (err) {
        console.error(err)
        setBooks([])
        setPageInfo({ totalPages: 0, hasNext: false })
      }
    }
    fetchBestsellers()
  }, [period, page, size, axios])

  // ── “서재에 추가” 클릭 핸들러 (토큰 여부만 체크) ─────────────
  const onAddClick = (e, book) => {
    e.stopPropagation()
    if (!token?.access_token) {
      alert('로그인이 필요한 서비스입니다.')
      return navigate('/login')
    }
    setCurrentBook(book)
    setModalOpen(true)
  }

  // ── 그룹 페이징 계산 (1-5, 6-10, ...) ─────────────
  const maxBtn    = 5
  const total     = pageInfo.totalPages
  const groupIdx  = Math.floor((page - 1) / maxBtn)
  const startPage = groupIdx * maxBtn + 1
  const endPage   = Math.min(startPage + maxBtn - 1, total)
  const numbers   = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )
  const canPrevGroup = startPage > 1
  const canNextGroup = endPage < total

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 상단 배너 & 검색 */}
        <div className="rounded-lg py-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">읽담 베스트셀러</h1>
              <p className="text-lg opacity-90">
                독자들이 가장 많이 읽고 있는 인기 도서를 만나보세요
              </p>
            </div>
            <form
              className="mt-4 md:mt-0"
              onSubmit={e => {
                e.preventDefault()
                navigate(
                  `/bookSearch?query=${encodeURIComponent(
                    searchQuery
                  )}&page=1`
                )
              }}
            >
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="도서, 작가, 출판사 검색하세요"
                    className="w-full md:w-80 px-4 py-2 pl-10 bg-white/20 border border-[#E88D67] border-opacity-30 rounded focus:outline-none"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                </div>
                <button className="bg-[#E88D67] hover:bg-[#d97850] text-white px-4 py-2 rounded">
                  검색
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 목록 헤더 */}
        <div className="mb-6 flex items-center gap-4">
          <TrendingUpIcon className="w-5 h-5 text-[#E88D67]" />
          <h2 className="text-xl font-bold">{selectedLabel} 베스트셀러</h2>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-sm text-gray-500">기준:</span>
            <div className="relative">
              <select
                value={period}
                onChange={e => {
                  setPeriod(e.target.value)
                  setPage(1)
                }}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#006989]"
              >
                {periods.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 도서 카드 그리드 */}
        {books.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            표시할 도서가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <div
                key={book.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/bookDetail/${book.isbn}`)}
              >
                <div className="relative">
                  <img
                    src={book.imageName}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-0 left-0 w-10 h-10 bg-[#E88D67] text-white flex items-center justify-center font-bold">
                    {book.ranking}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {book.author} | {book.publisher}
                  </p>
                  <div className="flex items-center mb-4">
                    <StarIcon className="w-4 h-4 text-[#E8BD67]" />
                    <span className="ml-1 text-sm">
                      {book.rating?.toFixed(1) ?? '0.0'}
                    </span>
                    <span className="mx-1 text-gray-400">|</span>
                    <span className="text-gray-500 text-sm">
                      리뷰 {book.reviewCnt ?? 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 bg-[#006989] text-white rounded hover:bg-[#005C78]"
                      onClick={e => {
                        e.stopPropagation()
                        navigate(`/bookDetail/${book.isbn}`)
                      }}
                    >
                      자세히 보기
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50"
                      onClick={e => onAddClick(e, book)}
                    >
                      <BookOpenIcon className="w-5 h-5 text-[#E88D67]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지 네비게이션 (그룹 페이징) */}
        {total > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={!canPrevGroup}
              onClick={() => setPage(startPage - maxBtn)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
            >
              이전
            </button>
            {numbers.map(num => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  num === page
                    ? 'bg-[#006989] text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={!canNextGroup}
              onClick={() => setPage(startPage + maxBtn)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}

        {/* 서재 추가 모달 */}
        <LibraryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          book={currentBook}
        />
      </main>
    </div>
  )
}

export default BookPage
