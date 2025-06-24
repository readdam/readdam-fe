// src/pages/my/MyWrite.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const tabs = [
  { label: '내가 작성한 글', path: '/myWrite' },
  { label: '작성한 첨삭', path: '/myWriteComment' },
  { label: '읽담 한줄', path: '/myWriteShort' },
];

const MyWrite = () => {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .get(`${url}/my/myWrite`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => setPosts(res.data))
      .catch(err => console.error('글 불러오기 실패:', err));
  }, [token]);

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">나의 글쓰기</h2>

      {/* 탭 메뉴 */}
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

      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link
            key={post.writeId}
            to={`/writeDetail/${post.writeId}`}
            className="flex bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* 이미지 */}
            <img
              src={post.img ? `${url}/image?filename=${post.img}` : '/images/default.jpg'}
              alt={post.title}
              className="w-36 h-36 object-cover flex-shrink-0"
            />

            {/* 내용 */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* 뱃지 */}
              <div className="flex space-x-2 mb-1">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                  {post.type}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.endDate ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {post.endDate ? '첨삭마감' : '첨삭가능'}
                </span>
              </div>

              {/* 제목 */}
              <h3 className="text-sm font-semibold line-clamp-1">{post.title}</h3>

              {/* 작성일 */}
              <div className="text-sm text-gray-600">
                {post.regDate?.slice(0, 10) || ''}
              </div>

              {/* 하단 통계 */}
              <div className="flex justify-between items-end text-xs text-gray-500 mt-2">
                <div className="flex space-x-4">
                  <span>❤️ {post.likeCnt || 0}</span>
                  <span>💬 {post.commentCnt || 0}</span>
                  <span>👁 {post.viewCnt || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyWrite;
