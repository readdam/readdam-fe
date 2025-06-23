import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import { Link } from 'react-router-dom';

export default function MyReviewBook() {
  const token = useAtomValue(tokenAtom);
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // 2개 x 5줄

  useEffect(() => {
    if (!token?.access_token) return;

    axios
      .get(`${url}/my/reviewBook`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('리뷰 목록 조회 실패:', err));
  }, [token]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const displayReviews = reviews.slice(0, visibleCount);

  if (!reviews.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">작성한 책 후기가 없습니다</p>
        <button
          onClick={() => window.location.href = '/book'}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          책 보러가기
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">나의 책 후기</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayReviews.map((r) => (
          <Link
            to={`/bookDetail/${r.book.bookIsbn}`}
            key={r.bookReviewId}
            className="flex border rounded-md bg-white hover:shadow-md transition relative"
          >
            <div className="w-28 h-40 flex-shrink-0">
              {r.book?.bookImg ? (
                <img src={r.book.bookImg} alt={r.book.title} className="w-full h-full object-cover rounded-l-md" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between relative">
              {/* 별점 - 오른쪽 상단 */}
              <div className="absolute top-2 right-2 text-sm">{renderStars(r.rating)}</div>

              <div>
                <h3 className="text-sm font-bold text-gray-800">{r.book.title}</h3>
                <div className="text-xs text-gray-500 mt-1">
                  {r.book.writer} · {r.book.publisher}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(r.regTime).toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{r.comment}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < reviews.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount(prev => prev + 4)} // 2줄씩 추가
            className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
