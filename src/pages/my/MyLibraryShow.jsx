// src/components/MyLibraryShow.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyLibraryShow = ({ category, books, onClose, onEdit }) => {
  const navigate = useNavigate();

  const handleBookClick = (isbn) => {
    navigate(`/bookDetail/${isbn}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg relative">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {category} ({books.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {/* 책 목록 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
          {books.length > 0 ? (
            books.map((book) => {
              // 여기서 cover 먼저 확인하도록 순서 변경
              const src =
                book.cover ||
                book.thumbnail ||
                book.bookImg ||
                '/no-image.png';
              const title = book.title || book.bookName;
              const author =
                book.author ||
                book.bookWriter ||
                (Array.isArray(book.authors)
                  ? book.authors.join(', ')
                  : '저자 정보 없음');
              const publisher = book.publisher || '출판사 정보 없음';

              return (
                <div
                  key={book.id ?? book.librarybookId ?? book.isbn}
                  onClick={() => handleBookClick(book.isbn)}
                  className="cursor-pointer"
                >
                  <img
                    src={src}
                    alt={title}
                    className="w-full h-40 object-cover rounded"
                  />
                  <p className="mt-2 text-sm font-semibold text-center line-clamp-2">
                    {title}
                  </p>
                  <p className="text-xs text-gray-600 text-center">
                    {author}
                  </p>
                  <p className="text-xs text-gray-600 text-center">
                    {publisher}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              책이 없습니다.
            </p>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLibraryShow;
