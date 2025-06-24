import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const tabs = [
  { label: '내가 작성한 글', path: '/myWrite' },
  { label: '작성한 첨삭', path: '/myWriteComment' },
  { label: '읽담 한줄', path: '/myWriteShort' },
];

const MyWriteComment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);

  const [comments, setComments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .get(`${url}/my/myWriteComment`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then((res) => setComments(res.data))
      .catch((err) => console.error('작성한 첨삭 불러오기 실패:', err));
  }, [token]);

  // 줄 수가 5줄 초과면 true
  const isLongText = (text) => text.split('\n').length > 5;

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">나의 글쓰기</h2>

      {/* 탭 */}
      <div className="flex space-x-6 border-b mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
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

      {/* 첨삭 목록 (배경 제거) */}
      <div className="space-y-4">
        {comments.map((item) => {
          const isExpanded = expandedId === item.writeCommentId;
          const needMore = isLongText(item.content) && !isExpanded;

          return (
            <div
              key={item.writeCommentId}
              className="py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/writeDetail/${item.writeId}`)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                  {item.category || item.type || '분류 없음'}
                </span>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <span className="ml-auto text-xs text-gray-500">
                  {item.postNickname} · {item.regDate?.split('T')[0]}
                </span>
              </div>

              <p
                className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${
                  isExpanded ? '' : 'line-clamp-5'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {item.content}
              </p>

              {needMore && (
                <button
                  className="mt-2 text-blue-500 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(item.writeCommentId);
                  }}
                >
                  더보기
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyWriteComment;
