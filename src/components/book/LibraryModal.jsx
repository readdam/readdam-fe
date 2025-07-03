// src/components/book/LibraryModal.jsx
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { XIcon, BookmarkIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios'

export default function LibraryModal({ isOpen, onClose, book }) {
  const axios = useAxios()
  const navigate = useNavigate()
  const [libraries, setLibraries] = useState([])

  // 모달이 열릴 때만 서재 목록 불러오기
  useEffect(() => {
    if (!isOpen) return

    const fetchLibraries = async () => {
      try {
        const { data } = await axios.get('/my/myLibraryList')
        // data 가 배열인지, { content: [...] } 형태인지 커버
        setLibraries(Array.isArray(data) ? data : data.content ?? [])
      } catch (err) {
        if (err.response?.status === 401) {
          alert('로그인이 필요한 서비스입니다.')
          onClose()
          navigate('/login')
        } else {
          console.error('서재 목록 로드 오류', err)
          setLibraries([])
        }
      }
    }

    fetchLibraries()
  }, [isOpen, axios, navigate, onClose])

  const handleAdd = async (libraryId) => {
    if (!book?.isbn) return
    try {
      await axios.post(`/my/${libraryId}/books`, {
        isbn:      book.isbn,
        title:     book.title,
        authors:   book.author ? [book.author] : [],
        thumbnail: book.imageName,
        publisher: book.publisher,
        datetime:  book.pubDate,
      })
      alert('서재에 추가되었습니다.')
      onClose()
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.message || '이미 추가된 책입니다.')
      } else if (err.response?.status === 401) {
        alert('로그인이 필요한 서비스입니다.')
        onClose()
        navigate('/login')
      } else {
        console.error('서재 추가 오류', err)
        alert('책 추가 중 오류가 발생했습니다.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-sm p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold mb-4">서재에 추가</h3>

        <ul className="space-y-2 max-h-60 overflow-auto">
          {libraries.map(lib => (
            <li
              key={lib.libraryId}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAdd(lib.libraryId)}
            >
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5 text-[#E88D67]" />
                <span className="font-medium">{lib.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {lib.bookCount ?? lib.books?.length ?? 0}권
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

LibraryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  book: PropTypes.shape({
    isbn: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    imageName: PropTypes.string,
    publisher: PropTypes.string,
    pubDate: PropTypes.string,
  }),
}
