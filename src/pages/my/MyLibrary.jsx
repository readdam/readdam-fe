// src/pages/my/MyLibrary.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios'
import { BookshelfHeader } from '../../components/book/BookshelfHeader'
import PersonalShelf from '../../components/book/PersonalShelf'

import MyLibraryShow from './MyLibraryShow'
import MyLibraryAdd from './MyLibraryAdd'
import MyLibraryEdit from './MyLibraryEdit'
import { PlusIcon } from 'lucide-react'

export function MyLibrary() {
  const navigate = useNavigate()
  const axios = useAxios()

  const [libraries, setLibraries] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [modalCategory, setModalCategory] = useState('')
  const [modalBooks, setModalBooks] = useState([])

  const fetchLibraries = useCallback(() => {
    axios
      .get('/my/myLibrary', { withCredentials: true })
      .then(res => setLibraries(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        if (err.response?.status === 401) navigate('/login', { replace: true })
        else setLibraries([])
      })
  }, [axios, navigate])

  useEffect(() => { fetchLibraries() }, [fetchLibraries])

  const openShowModal = (name, books) => {
    setModalCategory(name)
    setModalBooks(books)
    setShowModal('show')
  }
  const openEditModal = name => {
    setModalCategory(name)
    setShowModal('edit')
  }
  const openAddModal = () => {
    setModalCategory('')
    setShowModal('add')
  }

  const transform = book => ({
    id: book.librarybookId ?? book.isbn,
    cover: book.thumbnail ?? '/no-image.png',
    title: book.title,
    author: (book.authors || []).join(', '),
    publisher: book.publisher ?? '출판사 정보 없음'
  })

  const inLifeApi = libraries.find(l => l.name === '인생 책') || { name: '인생 책', books: [] }
  const inReadApi = libraries.find(l => l.name === '읽은 책') || { name: '읽은 책', books: [] }
  const customApi = libraries.filter(l => !['인생 책', '읽은 책'].includes(l.name))

  const inLife = inLifeApi.books.map(transform)
  const inRead = inReadApi.books.map(transform)
  const custom = customApi.map(s => ({
    id: s.libraryId,
    name: s.name,
    books: s.books.map(transform)
  }))

  const handleBookClick = isbn => navigate(`/bookDetail/${isbn}`)

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
      <BookshelfHeader />

      {/* 인생 책 */}
      <div className="border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-[#005C78] mb-4">인생 책</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[...inLife, { id: 'plus-life', empty: true }].map(book =>
            book.empty ? (
              <div
                key={book.id}
                onClick={() => openEditModal(inLifeApi.name)}
                className="
                  w-[140px] h-[190px]
                  flex-shrink-0
                  border-2 border-dashed border-gray-300
                  rounded-lg flex items-center justify-center
                  cursor-pointer transition-colors hover:bg-gray-50
                "
              >
                <PlusIcon size={32} className="text-gray-500" />
              </div>
            ) : (
              <img
                key={book.id}
                src={book.cover}
                alt={book.title}
                onClick={() => handleBookClick(book.id)}
                className="w-[140px] h-[190px] object-cover rounded-lg cursor-pointer flex-shrink-0 transition-shadow hover:shadow-lg"
              />
            )
          )}
        </div>
      </div>

      {/* 읽은 책 */}
      <div className="border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-[#005C78] mb-4">읽은 책</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[...inRead, { id: 'plus-read', empty: true }].map(book =>
            book.empty ? (
              <div
                key={book.id}
                onClick={() => openEditModal(inReadApi.name)}
                className="
                  w-[140px] h-[190px]
                  flex-shrink-0
                  border-2 border-dashed border-gray-300
                  rounded-lg flex items-center justify-center
                  cursor-pointer transition-colors hover:bg-gray-50
                "
              >
                <PlusIcon size={32} className="text-gray-500" />
              </div>
            ) : (
              <img
                key={book.id}
                src={book.cover}
                alt={book.title}
                onClick={() => handleBookClick(book.id)}
                className="w-[140px] h-[190px] object-cover rounded-lg cursor-pointer flex-shrink-0 transition-shadow hover:shadow-lg"
              />
            )
          )}
        </div>
      </div>

      {/* 나만의 서재 */}
      <div className="border border-gray-300 rounded-lg p-6 mb-8">
        <PersonalShelf
          shelves={custom}
          onAdd={openAddModal}
          onSelect={name => {
            const shelf = custom.find(s => s.name === name)
            openShowModal(name, shelf?.books || [])
          }}
        />
      </div>

      {/* 모달 */}
      {showModal === 'add' && (
        <MyLibraryAdd
          onClose={() => { setShowModal(null); fetchLibraries() }}
          onCreate={() => { fetchLibraries(); setShowModal(null) }}
        />
      )}
      {showModal === 'show' && (
        <MyLibraryShow
          category={modalCategory}
          books={modalBooks}
          onClose={() => setShowModal(null)}
          onEdit={() => openEditModal(modalCategory)}
        />
      )}
      {showModal === 'edit' && (
        <MyLibraryEdit
          shelf={libraries.find(l => l.name === modalCategory)}
          onClose={() => setShowModal(null)}
          onSave={() => { fetchLibraries(); setShowModal(null) }}
          onDelete={() => { fetchLibraries(); setShowModal(null) }}
        />
      )}
    </div>
  )
}

export default MyLibrary
