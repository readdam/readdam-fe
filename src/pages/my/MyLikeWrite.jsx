import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import axios from 'axios';
import { url } from '../../config/config';

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
];

export default function MyLikeWrite() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const [posts, setPosts] = useState([]);
  const [likedMap, setLikedMap] = useState({});


      const typeMap = {
        bookreview: '독후감',
        essay: '수필',
        personal: '자기소개서',
        assignment: '과제',
        other: '기타',
      };

      const getReviewStatus = (endDate) => {
        if (!endDate) return '첨삭 제외'; // endDate가 없으면 제외
        const now = new Date();
        return new Date(endDate) > now ? '첨삭 가능' : '첨삭 마감';
      };

      const fetchLikedWrites = () => {
      axios
        .get(`${url}/my/likeWrite`, {
          headers: { Authorization: `Bearer ${token.access_token}` },
          withCredentials: true,
        })
        .then(res => {
          setPosts(res.data);
          const map = {};
          res.data.forEach(p => { map[p.writeId] = true; });
          setLikedMap(map);
        })
        .catch(err => console.error('좋아요 글 조회 실패:', err));
    };

  // 1) 좋아요한 글 목록 조회
  useEffect(() => {
    if (!token?.access_token) return;
    fetchLikedWrites();
  }, [token, user.username]);

  // 2) 좋아요 토글
    const handleToggleLike = async (writeId) => {
      try {
        const { data: liked } = await axios.post(
          `${url}/my/write-like`,
          { writeId },
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
            withCredentials: true,
          }
        );

        // 좋아요 취소된 경우: 목록 새로고침
        if (!liked) {
          alert('좋아요가 취소되었습니다');
          // 다시 목록을 불러와서 해당 항목 제외
          fetchLikedWrites();
        }

      } catch (e) {
        console.error('좋아요 토글 실패:', e);
      }
    };

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">좋아요한 글</h2>

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

      {/* 콘텐츠 */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">좋아요한 글이 없습니다</p>
          <button
            onClick={() => navigate('/writeList')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            글 보러 가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.writeId} className="relative">
              {/* 좋아요 버튼 */}
              <button
                onClick={() => handleToggleLike(post.writeId)}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
              >
                <svg
                  className={`w-5 h-5 fill-current ${
                    likedMap[post.writeId] ? 'text-red-400' : 'text-gray-400'
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

              {/* 글 카드 */}
              <Link
                to={`/writeDetail/${post.writeId}`}
                className="flex bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={post.img ? `${url}/image?filename=${post.img}` : '/images/default.jpg'}
                  alt={post.title}
                  className="w-36 h-36 object-cover flex-shrink-0"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex space-x-2 mb-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      {typeMap[post.type]}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.endDate ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {getReviewStatus(post.endDate)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-1">{post.title}</h3>
                  <div className="text-sm text-gray-600">
                    <span className="text-blue-500 font-medium">{post.nickname}</span> ·{' '}
                    {post.regDate?.substring(0, 10)}
                  </div>
                  <div className="flex justify-between items-end text-xs text-gray-500 mt-2">
                    <div className="flex space-x-4">
                      <span>❤️ {post.likeCnt || 0}</span>
                      <span>💬 {post.commentCnt || 0}</span>
                      <span>👁 {post.viewCnt || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
