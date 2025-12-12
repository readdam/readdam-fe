import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyLibraryShow = ({ category, books, onClose, onEdit }) => {
  const navigate = useNavigate();
  const handleBookClick = (id) => {
    navigate(`/bookDetail/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-[#006989]">
      <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg relative">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {category} ({books.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            &times;
          </button>
        </div>

        {/* 책 목록 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
          {books.length > 0 ? (
            books.map((book) => {
              const src       = book.cover || book.thumbnail || '/no-image.png';
              const title     = book.title;
              const author    = book.author;
              const publisher = book.publisher || '출판사 정보 없음';
              const bookId    = book.id;

              return (
                <div
                  key={bookId}
                  onClick={() => handleBookClick(bookId)}
                  className="cursor-pointer flex flex-col space-y-2 w-[140px]"
                >
                  <img
                    src={src}
                    alt={title}
                    className="w-full h-[190px] object-cover rounded"
                  />
                  <p className="text-sm font-semibold text-center line-clamp-2">
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
            className="px-4 py-2 border border-[#006989] text-[#006989] rounded hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-[#E88D67] text-white rounded hover:bg-[#D07D5D]"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLibraryShow;
