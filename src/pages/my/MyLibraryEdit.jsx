import React, { useState } from 'react';

// 전체 책 데이터 (실제 API 데이터로 교체하세요)
const allBooks = [
  { id: 1, title: '쇼펜하우머의 인생수업', author: '쇼펜하우머', image: '/images/book1.jpg' },
  { id: 2, title: '듀얼 브레인',     author: '모티머 애들러', image: '/images/book2.jpg' },
  { id: 3, title: '철학책',           author: '철학 작가',     image: '/images/book3.jpg' },
  // … 그 외 모든 책
];

const MyLibraryEdit = ({ shelf, onClose, onSave }) => {
  const [title, setTitle] = useState(shelf.title);
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([...shelf.books]);

  // 검색 결과: 제목 또는 저자에 query 포함 + 이미 추가된 책 제외
  const results = allBooks.filter(
    (b) =>
      (b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())) &&
      !books.find((sb) => sb.id === b.id)
  );

  const addBook = (book) => {
    setBooks((prev) => [...prev, book]);
    setQuery('');
  };

  const removeBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSubmit = () => {
    onSave({ ...shelf, title, books });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg overflow-y-auto max-h-full">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">서재 수정하기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">&times;</button>
        </div>

        {/* 서재 제목 */}
        <label className="block text-sm font-medium mb-1">서재 제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="서재 제목을 입력해 주세요"
          className="w-full border px-3 py-2 rounded mb-4"
        />

        {/* 책 검색 */}
        <label className="block text-sm font-medium mb-1">책 검색</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="책 제목 또는 저자 입력"
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:border-orange-400"
        />

        {/* 검색 결과 */}
        {query && (
          <div className="max-h-40 overflow-y-auto mb-4">
            {results.length > 0 ? results.map((book) => (
              <div
                key={book.id}
                onClick={() => addBook(book)}
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
            )) : (
              <p className="text-gray-400 text-sm text-center py-4">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        )}

        {/* 현재 서재 책 리스트 */}
        <label className="block text-sm font-medium mb-2">서재에 있는 책</label>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {books.map((book) => (
            <div key={book.id} className="relative">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-28 object-cover rounded"
              />
              <button
                onClick={() => removeBook(book.id)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow hover:bg-gray-100"
                aria-label="삭제"
              >
                ✕
              </button>
              <p className="text-xs mt-1 line-clamp-1">{book.title}</p>
            </div>
          ))}
        </div>

        {/* 저장 / 취소 버튼 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title || books.length === 0}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLibraryEdit;
