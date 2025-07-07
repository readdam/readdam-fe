import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../config/config';

const BookCoverSearchModal = ({ onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // 책 검색
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      axios
        .get(`${url}/bookSearch`, {
          params: { query, page: 1, size: 10, sort: 'accuracy' },
        })
        .then(res => setSearchResults(res.data.documents || []))
        .catch(() => setSearchResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (book) => {
    if (onSelect) {
      onSelect(book.thumbnail || '');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh] text-[#006989]">
        <h2 className="text-xl font-bold mb-4">북커버 검색</h2>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="책 제목 또는 저자 입력"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {query && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto mb-6">
            {searchResults.length > 0 ? (
              searchResults.map(book => (
                <div
                  key={book.isbn}
                  onClick={() => handleSelect(book)}
                  className="cursor-pointer flex flex-col space-y-2 w-[140px] p-2 rounded hover:bg-orange-50"
                >
                  <img
                    src={book.thumbnail || '/no-image.png'}
                    alt={book.title}
                    className="w-full h-[190px] object-cover rounded"
                  />
                  <p className="text-sm font-semibold line-clamp-2">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {book.authors?.join(', ')}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {book.publisher || '출판사 정보 없음'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-full text-center py-4">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#006989] text-[#006989] rounded hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCoverSearchModal;
