// src/pages/my/MyReviewClass.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { Link } from 'react-router-dom';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

export default function MyReviewClass() {
  const token = useAtomValue(tokenAtom);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .get(`${url}/my/reviewClass`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => setReviews(res.data))
      .catch(err => console.error('내 모임 후기 조회 실패:', err));
  }, [token]);

  const renderStars = (count) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < count ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">작성한 모임 후기가 없습니다</p>
        <button
          onClick={() => (window.location.href = '/class')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          모임 보러가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-bold">나의 모임 후기</h2>

      {reviews.map((r) => {
        const tags = [r.tag1, r.tag2, r.tag3].filter(Boolean);
        return (
          <Link
            to={`/classDetail/${r.classId}`}
            key={r.classReviewId}
            className="flex bg-white border rounded-lg p-6 hover:shadow-md transition-shadow relative"
          >
            {/* 썸네일 */}
            <img
              src={
                r.mainImg
                  ? `${url}/image?filename=${r.mainImg}`
                  : '/images/default-class.png'
              }
              alt={r.title}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />

            {/* 내용 */}
            <div className="ml-6 flex-1">
              <div className="flex justify-between items-start">
                {/* 제목 + 태그 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {r.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                    <span className="flex items-center">
                      📅 {new Date(r.round1Date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      📍 {r.round1PlaceLoc}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* 별점 */}
                <div className="text-xl">{renderStars(r.rating)}</div>
              </div>

              {/* 리뷰 본문 */}
              <p className="mt-4 text-gray-700 leading-relaxed">
                {r.content}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
