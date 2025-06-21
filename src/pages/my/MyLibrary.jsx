// src/components/MyLibrary.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../config/config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

import MyLibraryShow from './MyLibraryShow';
import MyLibraryAdd  from './MyLibraryAdd';
import MyLibraryEdit from './MyLibraryEdit';

const MyLibrary = () => {
  const navigate = useNavigate();
  const token    = useAtomValue(tokenAtom);

  // ─── 훅은 항상 최상단에 ───
  const [showAll, setShowAll]             = useState(true);
  const [libraries, setLibraries]         = useState([]);
  const [showModal, setShowModal]         = useState(null);
  const [modalCategory, setModalCategory] = useState('');
  const [modalBooks, setModalBooks]       = useState([]);

  // Token이 없으면 MyRoutes에서 차단했으니, 여기선 그냥 빈 데이터 처리
  const accessToken = token?.access_token.startsWith('Bearer ')
    ? token.access_token
    : token?.access_token
      ? `Bearer ${token.access_token}`
      : null;

  // ─── 모든 훅 선언 끝 ───

  // ─── 데이터 가져오는 훅 ───
  const fetchLibraries = useCallback(() => {
    if (!accessToken) return;
    axios.get(`${url}/my/myLibrary`, {
      headers: { Authorization: accessToken },
      withCredentials: true,
    })
    .then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setLibraries(data);
      setShowAll(data.every(lib => lib.isShow === 1));
    })
    .catch(err => {
      console.error('서재 목록 불러오기 실패', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login', { replace: true });
      } else {
        setLibraries([]);
      }
    });
  }, [accessToken, navigate]);

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  const toggleShowAll = async () => {
    try {
      const nextShow = showAll ? 0 : 1;
      await axios.post(
        `${url}/my/myLibraryShow`,
        { isShow: nextShow },
        {
          headers: { Authorization: accessToken },
          withCredentials: true,
        }
      );
      setShowAll(nextShow === 1);
      fetchLibraries();
    } catch (err) {
      console.error('숨기기/보이기 토글 실패', err);
    }
  };

  // ─── 뷰 로직 ───
  const inLife = libraries.find(l => l.name === '인생 책') ?? { name: '인생 책', books: [] };
  const inRead = libraries.find(l => l.name === '읽은 책') ?? { name: '읽은 책', books: [] };
  const custom = libraries.filter(l => !['인생 책', '읽은 책'].includes(l.name));

  const handleBookClick = isbn => navigate(`/bookDetail/${isbn}`);
  const openShowModal    = (n, bs) => { setModalCategory(n); setModalBooks(bs); setShowModal('show'); };
  const openAddModal     = () => setShowModal('add');
  const openEditModal    = name => { setModalCategory(name); setShowModal('edit'); };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2">내 서재</h2>
      <p className="text-gray-600 mb-6">읽고 있는 책과 좋아하는 책을 관리하세요</p>

      {/* 숨기기/보이기 */}
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleShowAll}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-full shadow hover:shadow-md"
        >
          <span className="text-lg">{showAll ? '👁️' : '🚫'}</span>
          <span className="text-sm font-semibold">
            {showAll ? '내 서재 숨기기' : '내 서재 보여주기'}
          </span>
        </button>
      </div>

      {/* 인생 책 */}
      <Section
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
          <button onClick={openAddModal} className="bg-orange-500 text-white px-3 py-1 rounded">
            + 서재 추가
          </button>
        </div>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {custom.map((shelf, i) => (
            <div
              key={shelf.libraryId ?? i}
              onClick={() => openShowModal(shelf.name, shelf.books)}
              className="flex-shrink-0 w-32 cursor-pointer"
            >
              <div className="relative w-full h-28">
                {shelf.books.slice(0, 3).map((book, idx) => (
                  <img
                    key={idx}
                    src={book.thumbnail || '/no-image.png'}
                    alt={book.title}
                    className="absolute w-20 h-28 rounded shadow-md"
                    style={{ left: `${idx * 12}px`, zIndex: 10 - idx }}
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
            className="flex-shrink-0 w-32 h-28 flex items-center justify-center border-2 border-dashed rounded text-gray-400"
          >
            +
          </div>
        </div>
      </div>

      {/* 모달 */}
      {showModal === 'show' && (
        <MyLibraryShow category={modalCategory} books={modalBooks} onClose={() => setShowModal(null)} onEdit={() => openEditModal(modalCategory)} />
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
          shelf={libraries.find(l => l.name === modalCategory)}
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
      <h3 className="text-lg font-semibold">{title} ({books.length})</h3>
      <div className="flex space-x-2">
        <button onClick={onAdd} className="bg-orange-500 px-3 py-1 rounded text-white text-sm">
          + 책 추가
        </button>
        <button onClick={onShowAll} className="border border-orange-500 px-3 py-1 rounded text-sm text-orange-500">
          전체 보기 &gt;
        </button>
      </div>
    </div>
    <div className={`flex gap-3 ${scrollable ? 'overflow-x-auto pb-2' : ''}`}>
      {books.length > 0 ? (
        books.map(book => (
          <div key={book.librarybookId ?? book.isbn} className="flex flex-col items-center w-24">
            <img
              src={book.thumbnail || '/no-image.png'}
              alt={book.title}
              onClick={() => onBookClick(book.isbn)}
              className="w-24 h-36 object-cover rounded-md cursor-pointer"
            />
            {showMeta && (
              <>
                <p className="text-xs mt-1 truncate w-full">{book.title}</p>
                <p className="text-xs text-gray-500 truncate w-full">{(book.authors||[]).join(', ')}</p>
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
