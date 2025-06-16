import React, { useState } from 'react';

const sampleBooks = [
  { id: 1, title: '쇼펜하우머의 인생수업', author: '쇼펜하우머', image: '/images/book1.jpg' },
  { id: 2, title: '듀얼 브레인',     author: '모티머 애들러', image: '/images/book2.jpg' },
  { id: 3, title: '철학책',           author: '철학 작가',     image: '/images/book3.jpg' },
  // …실제 데이터로 교체
];

const MyLibraryAdd = ({ onClose, onCreate }) => {
  const [shelfTitle, setShelfTitle] = useState('');
  const [query, setQuery] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);

  // 검색 결과: 제목 혹은 저자에 query 포함, 이미 선택된 책은 제외
  const results = sampleBooks.filter(
    (b) =>
      (b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())) &&
      !selectedBooks.find((sb) => sb.id === b.id)
  );

  const handleSelect = (book) => {
    setSelectedBooks((prev) => [...prev, book]);
    setQuery('');
  };

  const handleCreate = () => {
    onCreate({
      id: Date.now(),
      title: shelfTitle,
      books: selectedBooks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        {/* 헤더 */}
        <h2 className="text-xl font-bold mb-4">서재 만들기</h2>

        {/* 서재 제목 */}
        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          type="text"
          placeholder="서재 제목을 입력 해 주세요"
          className="w-full border px-3 py-2 rounded mb-4"
          value={shelfTitle}
          onChange={(e) => setShelfTitle(e.target.value)}
        />

        {/* 책 검색 */}
        <label className="block text-sm font-medium mb-1">책 검색</label>
        <input
          type="text"
          placeholder="책 제목 또는 저자 입력"
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:border-orange-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* 검색 결과 */}
        <div className="max-h-48 overflow-y-auto mb-4">
          {results.map((book) => (
            <div
              key={book.id}
              onClick={() => handleSelect(book)}
              className="flex items-center p-2 mb-1 rounded hover:bg-orange-50 cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-10 h-14 object-cover rounded mr-3"
              />
              <div>
                <p className="font-medium">{book.title}</p>
                <p className="text-xs text-gray-500">{book.author}</p>
              </div>
            </div>
          ))}
          {results.length === 0 && query && (
            <p className="text-gray-400 text-sm text-center py-4">
              검색 결과가 없습니다.
            </p>
          )}
        </div>

        {/* 선택된 책 */}
        {selectedBooks.length > 0 && (
          <>
            <p className="text-sm font-medium mb-2">선택한 책</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded"
                >
                  <span className="text-sm mr-2">{book.title}</span>
                  <button
                    onClick={() =>
                      setSelectedBooks((prev) =>
                        prev.filter((b) => b.id !== book.id)
                      )
                    }
                    className="text-gray-500 hover:text-gray-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!shelfTitle || selectedBooks.length === 0}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLibraryAdd;
