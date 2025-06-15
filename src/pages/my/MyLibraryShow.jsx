import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyLibraryShow = ({ category, books, onClose, onEdit }) => {
  const navigate = useNavigate();

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
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
            books.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className="cursor-pointer"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="mt-2 text-sm text-center line-clamp-2">
                  {book.title}
                </p>
              </div>
            ))
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
