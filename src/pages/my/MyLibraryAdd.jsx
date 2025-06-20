import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../config/config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const MyLibraryAdd = ({ onClose, onCreate }) => {
  const token = useAtomValue(tokenAtom);

  const [shelfTitle, setShelfTitle] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  // 도서 검색
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      axios
        .get(`${url}/bookSearch`, {
          params: { query, page: 1, size: 10, sort: 'accuracy' }
        })
        .then(res => setSearchResults(res.data.documents || []))
        .catch(() => setSearchResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectBook = book => {
    if (!selectedBooks.find(b => b.isbn === book.isbn)) {
      setSelectedBooks(prev => [...prev, book]);
    }
  };

  const handleRemoveBook = isbn => {
    setSelectedBooks(prev => prev.filter(b => b.isbn !== isbn));
  };

  const handleCreate = async () => {
    if (!shelfTitle || selectedBooks.length === 0) return;

    try {
      // 1) 생성 API 호출
      const { data: newShelfDto } = await axios.post(
        `${url}/my/myLibraryAdd`,
        { name: shelfTitle, books: selectedBooks },
        {
          headers: {
            Authorization: token.access_token.startsWith('Bearer ')
              ? token.access_token
              : `Bearer ${token.access_token}`,
          },
          withCredentials: true,
        }
      );

      // 2) 부모에 넘길 newShelf 객체
      const newShelf = {
        libraryId: newShelfDto.libraryId,
        name: newShelfDto.name,
        isShow: newShelfDto.isShow,
        books: newShelfDto.books || [],
      };
      onCreate?.(newShelf);

      alert('서재가 생성되었습니다.');
      onClose();
    } catch (e) {
      console.error(e);
      alert('서재 생성 실패');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg overflow-y-auto max-h-full">
        <h2 className="text-xl font-bold mb-4">서재 만들기</h2>

        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="서재 제목을 입력하세요"
          value={shelfTitle}
          onChange={e => setShelfTitle(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">책 검색</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="책 제목 또는 저자 입력"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {query && (
          <div className="max-h-40 overflow-y-auto mb-4">
            {searchResults.length > 0 ? (
              searchResults.map(book => {
                const already = selectedBooks.some(b => b.isbn === book.isbn);
                return (
                  <div
                    key={book.isbn.trim()}
                    className={`flex items-center p-2 mb-1 rounded cursor-pointer ${
                      already ? 'bg-gray-100' : 'hover:bg-orange-50'
                    }`}
                    onClick={() => !already && handleSelectBook(book)}
                  >
                    <img
                      src={book.thumbnail || '/no-image.png'}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{book.title}</p>
                      <p className="text-xs text-gray-500">
                        {book.authors?.join(', ')}
                      </p>
                    </div>
                    {already && <span className="text-xs text-green-500">✔ 담김</span>}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 text-sm py-3">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        )}

        {selectedBooks.length > 0 && (
          <>
            <p className="text-sm font-medium mb-2">선택한 책</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {selectedBooks.map(book => (
                <div key={book.isbn.trim()} className="relative">
                  <img
                    src={book.thumbnail || '/no-image.png'}
                    alt={book.title}
                    className="w-full h-28 object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveBook(book.isbn)}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    ✕
                  </button>
                  <p className="text-xs mt-1 line-clamp-1">{book.title}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
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
