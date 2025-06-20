import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../config/config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const MyLibraryEdit = ({ shelf, onClose, onSave, onDelete }) => {
  const token = useAtomValue(tokenAtom);
  const isDefault = shelf.name === '인생 책' || shelf.name === '읽은 책';
  const [title, setTitle] = useState(shelf.name);
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([...shelf.books]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      axios
        .get(`${url}/bookSearch`, {
          params: { query, page: 1, size: 10, sort: 'accuracy' },
        })
        .then((res) => setSearchResults(res.data.documents || []))
        .catch(() => setSearchResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const isBookAdded = (book) =>
    books.some((b) => b.isbn.trim() === book.isbn.trim());

  const addBook = (book) => {
    if (!isBookAdded(book)) setBooks((prev) => [...prev, book]);
  };
  const removeBook = (isbn) => {
    if (window.confirm('이 책을 서재에서 삭제하시겠습니까?')) {
      setBooks((prev) => prev.filter((b) => b.isbn !== isbn));
    }
  };

  const handleSubmit = async () => {
    if (!title || books.length === 0) return;
    try {
      // 1) 수정 API 호출 시 헤더에 토큰 추가
      const { data: updated } = await axios.post(
        `${url}/my/myLibraryUpdate`,
        {
          libraryId: shelf.libraryId,
          name: title,
          books,
        },
        {
          headers: {
            Authorization: token.access_token.startsWith('Bearer ')
              ? token.access_token
              : `Bearer ${token.access_token}`,
          },
          withCredentials: true,
        }
      );
      alert('서재가 수정되었습니다.');
      // 2) 서버가 반환한 updated DTO를 부모로 넘겨줘야 onSave가 동작
      onSave(updated);
      onClose();
    } catch (e) {
      console.error(e);
      alert('서재 수정 실패');
    }
  };

  const handleShelfDelete = async () => {
    if (!shelf.libraryId) return;
    if (window.confirm('이 서재를 삭제하시겠습니까?')) {
      try {
        await axios.post(
          `${url}/my/myLibraryDelete`,
          null,
          {
            params: { libraryId: shelf.libraryId },
            headers: {
              Authorization: token.access_token.startsWith('Bearer ')
                ? token.access_token
                : `Bearer ${token.access_token}`,
            },
            withCredentials: true,
          }
        );
        alert('서재 삭제 완료');
        onDelete(shelf.libraryId);  // 필요에 따라 부모에서 해당 서재 제거
        onClose();
      } catch (e) {
        console.error(e);
        alert('서재 삭제 실패');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg overflow-y-auto max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">서재 수정하기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">&times;</button>
        </div>

        <label className="block text-sm font-medium mb-1">서재 제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isDefault}
          className="w-full border px-3 py-2 rounded mb-4 disabled:bg-gray-100"
        />

        <label className="block text-sm font-medium mb-1">책 검색</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {query && (
          <div className="max-h-40 overflow-y-auto mb-4">
            {searchResults.length > 0 ? (
              searchResults.map((book) => {
                const already = isBookAdded(book);
                return (
                  <div
                    key={book.isbn.trim()}
                    onClick={() => !already && addBook(book)}
                    className={`flex items-center p-2 mb-1 rounded cursor-pointer ${
                      already ? 'bg-gray-100' : 'hover:bg-orange-50'
                    }`}
                  >
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.authors?.join(', ')}</p>
                    </div>
                    {already && <span className="text-xs text-green-500 font-semibold">✔ 담김</span>}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">검색 결과가 없습니다.</p>
            )}
          </div>
        )}

        <label className="block text-sm font-medium mb-2">서재에 담긴 책</label>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {books.map((book) => (
            <div key={book.isbn} className="relative">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-full h-28 object-cover rounded"
              />
              <button
                onClick={() => removeBook(book.isbn)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow hover:bg-gray-100"
              >
                ✕
              </button>
              <p className="text-xs mt-1 line-clamp-1">{book.title}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          {!isDefault && (
            <button onClick={handleShelfDelete} className="text-sm text-red-500 hover:underline">
              서재 삭제
            </button>
          )}
          <div className="flex space-x-2">
            <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
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
    </div>
  );
};

export default MyLibraryEdit;
