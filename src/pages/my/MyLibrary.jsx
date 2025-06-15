import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyLibraryShow from './MyLibraryShow';
import MyLibraryAdd from './MyLibraryAdd';
import MyLibraryEdit from './MyLibraryEdit';

// 예시 데이터: 진짜라면 API로 받아오세요
const lifeBooks = [];
const readBooks = Array(17).fill(0).map((_, i) => ({
  id: i + 1,
  title: `읽은 책 ${i + 1}`,
  image: '/images/book1.jpg',
}));
const shelves = [
  { 
    id: 'read', 
    title: '읽은 책', 
    count: 30, 
    books: readBooks.slice(0, 6)  // 예시로 6개만 프리뷰
  },
  { 
    id: 'share', 
    title: '공유하고 싶은 책', 
    count: 10, 
    books: readBooks.slice(6, 12) 
  },
];

const MyLibrary = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);    // 'show'|'add'|'edit'|null
  const [modalCategory, setModalCategory] = useState('');
  const [modalBooks, setModalBooks] = useState([]);

  const handleBookClick = (id) => navigate(`/book/${id}`);

  const openShowModal = (category, books) => {
    setModalCategory(category);
    setModalBooks(books);
    setShowModal('show');
  };
  const openAddModal = () => { setShowModal('add'); };
  const openEditModal = () => { setShowModal('edit'); };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-2">내 서재</h2>
      <p className="text-sm text-gray-500 mb-6">
        읽고 있는 책과 좋아하는 책들을 관리하세요
      </p>

      {/* 인생 책 섹션 */}
      <Section
        title="인생 책"
        books={lifeBooks}
        onAdd={openAddModal}
        onShowAll={() => openShowModal('인생 책', lifeBooks)}
        onBookClick={handleBookClick}
      />

      {/* 읽은 책 섹션 */}
      <Section
        title="읽은 책"
        books={readBooks}
        scrollable
        onAdd={openAddModal}
        onShowAll={() => openShowModal('읽은 책', readBooks)}
        onBookClick={handleBookClick}
      />

      {/* 나만의 서재(서재 보관함) */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">나만의 서재 보관함</h3>
          <button
            onClick={openAddModal}
            className="bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600"
          >
            + 서재 추가
          </button>
        </div>
        <div className="flex space-x-6 overflow-x-auto">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              onClick={() => openShowModal(shelf.title, shelf.books)}
              className="flex-shrink-0 w-32 cursor-pointer"
            >
              <div className="grid grid-cols-2 gap-1">
                {shelf.books.slice(0, 4).map((book) => (
                  <img
                    key={book.id}
                    src={book.image}
                    alt={book.title}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
              <p className="mt-2 text-center text-sm font-medium">
                {shelf.title} ({shelf.count})
              </p>
            </div>
          ))}
          {/* 새 서재 추가 슬롯 */}
          <div
            onClick={openAddModal}
            className="flex-shrink-0 w-32 h-28 flex items-center justify-center border-2 border-dashed rounded cursor-pointer text-gray-400"
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
          onEdit={openEditModal}
        />
      )}
      {showModal === 'add' && (
        <MyLibraryAdd
          onClose={() => setShowModal(null)}
          onAdd={(newShelf) => {
            /* 새 서재 추가 로직 */
            setShowModal(null);
          }}
        />
      )}
      {showModal === 'edit' && (
        <MyLibraryEdit
          category={modalCategory}
          onClose={() => setShowModal(null)}
          onSave={(updatedShelf) => {
            /* 서재 수정 로직 */
            setShowModal(null);
          }}
        />
      )}
    </div>
  );
};

const Section = ({
  title,
  books,
  scrollable,
  onAdd,
  onShowAll,
  onBookClick,
}) => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">
        {title} ({books.length})
      </h3>
      <div className="flex space-x-2">
        <button
          onClick={onAdd}
          className="bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600"
        >
          + 책 추가
        </button>
        <button
          onClick={onShowAll}
          className="text-sm text-gray-600 hover:text-black"
        >
          전체 보기 &gt;
        </button>
      </div>
    </div>
    <div className={`flex gap-3 ${scrollable ? 'overflow-x-auto pb-2' : ''}`}>
      {books.length > 0 ? (
        books.map((book) => (
          <img
            key={book.id}
            src={book.image}
            alt={book.title}
            onClick={() => onBookClick(book.id)}
            className="w-24 h-36 object-cover rounded-md cursor-pointer"
          />
        ))
      ) : (
        <p className="text-gray-400 text-sm">아직 등록된 책이 없습니다.</p>
      )}
    </div>
  </div>
);

export default MyLibrary;
