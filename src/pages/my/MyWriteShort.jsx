// src/pages/my/MyWriteShort.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import { HeartIcon } from 'lucide-react';

const getCardBg = (color) => {
  switch (color) {
    case 'red':
      return 'bg-red-50';
    case 'yellow':
      return 'bg-yellow-50';
    case 'blue':
      return 'bg-blue-50';
    default:
      return 'bg-gray-50';
  }
};

const tabs = [
  { label: '내가 작성한 글', path: '/myWrite' },
  { label: '작성한 첨삭', path: '/myWriteComment' },
  { label: '읽담 한줄', path: '/myWriteShort' },
];

export default function MyWriteShort() {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .get(`${url}/my/writeShort`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then((res) => setShorts(res.data))
      .catch((err) => console.error('읽담 한줄 조회 실패:', err));
  }, [token]);

  const toggleLike = (id) => {
    axios
      .post(`${url}/my/myLikeShort/${id}`, null, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then((res) => {
        const newCount = res.data;
        setShorts((prev) =>
          prev.map((s) =>
            s.writeshortId === id ? { ...s, likeCount: newCount } : s
          )
        );
      })
      .catch((err) => console.error('좋아요 토글 실패:', err));
  };

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">나의 글쓰기</h2>

      <div className="flex space-x-6 border-b mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`pb-2 font-semibold ${
              location.pathname === tab.path
                ? 'text-black border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {shorts.map((item) => (
          <div
            key={item.writeshortId}
            className={`${getCardBg(item.color)} p-2 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:-rotate-1 hover:-translate-y-1`}
            style={{ aspectRatio: '1 / 1' }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-semibold text-[#006989]">
                {item.eventTitle}
              </span>
              <button
                onClick={() => toggleLike(item.writeshortId)}
                className="flex items-center gap-1 text-gray-600 text-xs"
              >
                <HeartIcon className="w-4 h-4" />
                <span>{item.likeCount}</span>
              </button>
            </div>
            <div className="flex items-center justify-center h-[80%]">
              <p className="text-center text-sm text-gray-700 leading-snug">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
