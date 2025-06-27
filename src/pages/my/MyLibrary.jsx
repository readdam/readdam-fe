// src/components/MyLibrary.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios'       // 변경
import { BookshelfHeader } from '../../components/book/BookshelfHeader'
import { BookSection } from '../../components/book/BookSection'
import { PersonalShelf } from '../../components/book/PersonalShelf'

import MyLibraryShow from './MyLibraryShow'
import MyLibraryAdd from './MyLibraryAdd'
import MyLibraryEdit from './MyLibraryEdit'

export function MyLibrary() {
  const navigate = useNavigate()
  const axios = useAxios()                           

  const [libraries, setLibraries] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [modalCategory, setModalCategory] = useState('')
  const [modalBooks, setModalBooks] = useState([])

  const fetchLibraries = useCallback(() => {
    axios
      .get('/my/myLibrary', { withCredentials: true })  // 상대경로만 사용
      .then(res => setLibraries(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('서재 목록 불러오기 실패', err)
        if (err.response?.status === 401)
          navigate('/login', { replace: true })
        else
          setLibraries([])
      })
  }, [axios, navigate])

  useEffect(() => {
    fetchLibraries()
  }, [fetchLibraries])

  // API 데이터 → UI용 변환
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
  const customShelves = customApi.map(shelf => ({
    id: shelf.libraryId,
    name: shelf.name,
    books: shelf.books.map(transform),
  }))

  // 모달 열기
  const openShowModal = (name, books) => {
    setModalCategory(name)
    setModalBooks(books)
    setShowModal('show')
  }
  const openAddModal = () => setShowModal('add')
  const openEditModal = name => {
    setModalCategory(name)
    setShowModal('edit')
  }

  // 책 클릭 → 상세페이지
  const handleBookClick = isbn => navigate(`/bookDetail/${isbn}`)

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
      <BookshelfHeader />

      <BookSection
        title="인생 책"
        books={inLife}
        onAdd={() => openEditModal(inLifeApi.name)}
        onShowAll={() => openShowModal(inLifeApi.name, inLife)}
        onBookClick={handleBookClick}
      />

      <BookSection
        title="읽은 책"
        books={inRead}
        onAdd={() => openEditModal(inReadApi.name)}
        onShowAll={() => openShowModal(inReadApi.name, inRead)}
        onBookClick={handleBookClick}
      />

      <PersonalShelf
        shelves={customShelves}
        onAdd={openAddModal}
        onSelect={name => {
          const shelf = customShelves.find(s => s.name === name)
          openShowModal(name, shelf?.books || [])
        }}
      />

      {showModal === 'show' && (
        <MyLibraryShow
          category={modalCategory}
          books={modalBooks}
          onClose={() => setShowModal(null)}
          onEdit={() => openEditModal(modalCategory)}
        />
      )}
      {showModal === 'add' && (
        <MyLibraryAdd
          onClose={() => { setShowModal(null); fetchLibraries() }}
          onCreate={() => { fetchLibraries(); setShowModal(null) }}
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
