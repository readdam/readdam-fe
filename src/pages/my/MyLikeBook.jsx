import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { url } from '../../config/config';
import { tokenAtom, userAtom } from '../../atoms';
import { toggleBookLike } from '../../api/kakaoApi';
import axios from 'axios';

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
];

export default function MyLikeBook() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const [books, setBooks] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [showAll, setShowAll] = useState(false);
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .get(`${url}/my/likeBook`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => {
        setBooks(res.data);
        // 초기 좋아요 상태 세팅
        const map = {};
        res.data.forEach(b => { map[b.bookIsbn] = true; });
        setLikedMap(map);
      })
      .catch(err => console.error('좋아요 도서 목록 조회 실패:', err));
  }, [token, user.username]);

  const handleToggleLike = async (isbn) => {
    try {
      const msg = await toggleBookLike(token, isbn);
      const isNowLiked = !msg.includes('취소');
      setLikedMap(prev => ({ ...prev, [isbn]: isNowLiked }));
      if (!isNowLiked) {
        alert('좋아요가 취소되었습니다');
      }
    } catch (e) {
      console.error('[handleToggleLike]', e);
    }
  };

  const displayBooks = showAll ? books : books.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">좋아요한 책</h2>

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

      {/* Book Grid or Empty State */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">좋아요한 책이 없습니다</p>
          <button
            onClick={() => navigate('/book')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            책 보러가기
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {displayBooks.map(book => (
              <div
                key={book.bookIsbn}
                className="relative bg-white border rounded-md shadow-sm overflow-hidden"
              >
                {/* 좋아요 버튼 */}
                <button
                  onClick={() => handleToggleLike(book.bookIsbn)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                >
                  <svg
                    className={`w-5 h-5 fill-current ${
                      likedMap[book.bookIsbn] ? 'text-red-400' : 'text-gray-400'
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                      6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                      3.57 2.36h1.87C13.46 5.99 14.96 
                      5 16.5 5 18.5 5 20 6.5 20 
                      8.5c0 3.78-3.4 6.86-8.55 
                      11.54L12 21.35z" />
                  </svg>
                </button>

                <Link to={`/bookDetail/${book.bookIsbn}`} className="block">
                  {book.bookImg ? (
                    <img
                      src={book.bookImg}
                      alt={book.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                      <div className="w-10 h-14 border-2 rounded-md" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-sm font-semibold truncate">{book.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {book.writer} · {book.publisher}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* 더보기 버튼 */}
          {!showAll && books.length > ITEMS_PER_PAGE && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                더보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
