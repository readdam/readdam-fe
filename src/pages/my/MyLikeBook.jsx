import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import axios from 'axios';
import { url } from '../../config/config';
import { tokenAtom, userAtom } from '../../atoms';

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
];

export default function MyLikeBook() {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;

    const fetchLikedBooks = async () => {
      try {
        const res = await axios.get(
          `${url}/my/likeBook`,
          {
            headers: { Authorization: token.access_token },
            withCredentials: true,
          }
        );
        setBooks(res.data);
      } catch (err) {
        console.error('좋아요 도서 목록 조회 실패:', err);
      }
    };

    fetchLikedBooks();
  }, [token, user.username]);

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">좋아요</h2>

      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-8">
        {tabs.map(tab => (
          <Link
            key={tab.label}
            to={tab.path}
            className={`pb-2 transition-all ${
              location.pathname === tab.path
                ? 'text-black border-b-2 border-blue-500 font-semibold'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white border rounded-xl shadow-sm overflow-hidden relative">
            {/* 하트 아이콘 */}
            <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
              <svg className="w-4 h-4 text-red-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                  6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                  3.57 2.36h1.87C13.46 5.99 14.96 
                  5 16.5 5 18.5 5 20 6.5 20 
                  8.5c0 3.78-3.4 6.86-8.55 
                  11.54L12 21.35z" />
              </svg>
            </button>

            {/* 이미지 */}
            {book.thumbnail ? (
              <img src={book.thumbnail} alt={book.title} className="w-full h-44 object-cover" />
            ) : (
              <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                <div className="w-10 h-14 border-2 rounded-md" />
              </div>
            )}

            {/* 책 정보 */}
            <div className="p-3">
              <div className="text-sm font-semibold truncate">{book.title}</div>
              <div className="text-xs text-gray-500 truncate">
                {book.author} · {book.publisher}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 */}
      <div className="text-center mt-10">
        <button className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
          더보기
        </button>
      </div>
    </div>
  );
}
