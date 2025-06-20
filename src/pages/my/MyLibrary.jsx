// src/components/MyLibrary.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../config/config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

import MyLibraryShow from './MyLibraryShow';
import MyLibraryAdd from './MyLibraryAdd';
import MyLibraryEdit from './MyLibraryEdit';

const MyLibrary = () => {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const [showAll, setShowAll]   = useState(true);

  const [libraries, setLibraries] = useState([]);
  const [showModal, setShowModal] = useState(null);      // 'show' | 'add' | 'edit' | null
  const [modalCategory, setModalCategory] = useState('');
  const [modalBooks, setModalBooks] = useState([]);

  // --- Fetch ---
  const fetchLibraries = useCallback(() => {
    axios.get(`${url}/my/myLibrary`, {
      headers: {
        Authorization: token.access_token.startsWith('Bearer ')
          ? token.access_token
          : `Bearer ${token.access_token}`,
      },
      withCredentials: true,
    })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setLibraries(data);
        setShowAll(data.length > 0 && data.every(lib => lib.isShow === 1));
      })
      .catch(err => {
        console.error('서재 목록 불러오기 실패', err);
        setLibraries([]);
      });
  }, [token]);

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  // --- Toggle show/hide all ---
  const toggleShowAll = async () => {
    
    try {
      const nextShow = showAll ? 0 : 1;
    await axios.post(
      `${url}/my/myLibraryShow`,
      { isShow: nextShow },
      {
        headers: {
          Authorization: token.access_token.startsWith('Bearer ')
            ? token.access_token
            : `Bearer ${token.access_token}`,
        },
        withCredentials: true,
      }
    );
    setShowAll(nextShow === 1);
    fetchLibraries();

    } catch (err) {
      console.error('숨기기/보이기 토글 실패', err);
    }
  };

  // --- Helpers ---
  const inLife = libraries.find(l => l.name === '인생 책') || { libraryId: null, name: '인생 책', books: [] };
  const inRead = libraries.find(l => l.name === '읽은 책') || { libraryId: null, name: '읽은 책', books: [] };
  const custom = libraries.filter(l => !['인생 책', '읽은 책'].includes(l.name));

  // --- Handlers ---
  const handleBookClick = isbn => navigate(`/bookDetail/${isbn}`);
  const openShowModal = (name, books) => {
    setModalCategory(name);
    setModalBooks(books);
    setShowModal('show');
  };
  const openAddModal = () => setShowModal('add');
  const openEditModal = name => {
    setModalCategory(name);
    setShowModal('edit');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2">내 서재</h2>
      <p className="text-gray-600 mb-6">읽고 있는 책과 좋아하는 책을 관리하세요</p>

      {/* 숨기기/보이기 */}
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleShowAll}
          className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full shadow hover:shadow-md transition"
        >
          <span className="text-lg">
            {showAll ? '👁️' : '🚫'}
          </span>
          <span className="text-sm font-semibold">
            {showAll ? '내 서재 숨기기' : '내 서재 보여주기'}
          </span>
        </button>
      </div>


          {/* 인생 책 */}
          <Section
            key={inLife.libraryId ?? inLife.name}
            title="인생 책"
            books={inLife.books}
            scrollable
            showMeta
            onAdd={() => openEditModal(inLife.name)}
            onShowAll={() => openShowModal(inLife.name, inLife.books)}
            onBookClick={handleBookClick}
          />

          {/* 읽은 책 */}
          <Section
            key={inRead.libraryId ?? inRead.name}
            title="읽은 책"
            books={inRead.books}
            scrollable
            showMeta
            onAdd={() => openEditModal(inRead.name)}
            onShowAll={() => openShowModal(inRead.name, inRead.books)}
            onBookClick={handleBookClick}
          />

          {/* 나만의 서재 */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">나만의 서재</h3>
              <button
                onClick={openAddModal}
                className="bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600"
                key="add-shelf-button"
              >
                + 서재 추가
              </button>
            </div>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {custom.map((shelf, idx) => (
                <div
                  key={shelf.libraryId ?? `custom-${idx}`}
                  onClick={() => openShowModal(shelf.name, shelf.books)}
                  className="flex-shrink-0 w-32 cursor-pointer"
                >
                  <div className="relative w-full h-28">
                    {shelf.books.slice(0, 3).map((book, i) => (
                      <img
                        key={book.librarybookId ?? book.isbn ?? i}
                        src={book.thumbnail || '/no-image.png'}
                        alt={book.title || book.bookName}
                        className="absolute w-20 h-28 object-cover rounded shadow-md"
                        style={{ left: `${i * 12}px`, zIndex: 10 - i }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-center text-sm font-medium">
                    {shelf.name} ({shelf.books.length})
                  </p>
                </div>
              ))}
              <div
                onClick={openAddModal}
                className="flex-shrink-0 w-32 h-28 flex items-center justify-center border-2 border-dashed rounded cursor-pointer text-gray-400"
                key="add-shelf-placeholder"
              >
                +
              </div>
            </div>
          </div>


      {/* 모달 */}
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
          onClose={() => setShowModal(null)}
          onCreate={() => {
            fetchLibraries();
            setShowModal(null);
          }}
        />
      )}
      {showModal === 'edit' && (
        <MyLibraryEdit
          key={`edit-${modalCategory}`}
          shelf={libraries.find(lib => lib.name === modalCategory)}
          onClose={() => setShowModal(null)}
          onSave={() => {
            fetchLibraries();
            setShowModal(null);
          }}
          onDelete={() => {
            fetchLibraries();
            setShowModal(null);
          }}
        />
      )}
    </div>
  );
};


const Section = ({ title, books, scrollable, showMeta, onAdd, onShowAll, onBookClick }) => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">
        {title} ({books.length})
      </h3>
      <div className="flex space-x-2">
        <button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
          + 책 추가
        </button>
        <button onClick={onShowAll} className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-3 py-1 rounded text-sm font-semibold">
          전체 보기 &gt;
        </button>
      </div>
    </div>
    <div className={`flex gap-3 ${scrollable ? 'overflow-x-auto pb-2' : ''}`}>
      {books.length > 0 ? (
        books.map(book => (
          <div key={book.librarybookId ?? book.isbn} className="flex flex-col items-center w-24">
            <img
              src={book.thumbnail || book.bookImg || '/no-image.png'}
              alt={book.title || book.bookName}
              onClick={() => onBookClick(book.isbn)}
              className="w-24 h-36 object-cover rounded-md cursor-pointer"
            />
            {showMeta && (
              <>
                <p className="text-xs mt-1 w-full truncate">
                  {book.title}
                </p>
                <p className="text-xs text-gray-500 w-full truncate">
                  {book.authors?.join(', ')}
                </p>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">아직 등록된 책이 없습니다.</p>
      )}
    </div>
  </div>
);


export default MyLibrary;
