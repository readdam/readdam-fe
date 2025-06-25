// src/pages/my/MyLikeClass.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import axios from 'axios';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
];

export default function MyLikeClass() {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);
  const [meetings, setMeetings] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .get(`${url}/my/likeClass`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        const mapped = list.map(item => ({
          id: item.classId,
          title: item.title,
          date: item.round1Date?.split('T')[0] || '',
          location: item.round1PlaceLoc || '',
          participants: `${item.currentParticipants}/${item.maxPerson}명`,
          tags: [item.tag1, item.tag2, item.tag3].filter(Boolean),
          image: item.mainImg || '',
          liked: item.liked ?? false,
        }));
        setMeetings(mapped);
      })
      .catch(() => setMeetings([]));
  }, [token]);

  const toggleLike = (id) => {
    if (!token?.access_token) return;
    axios
      .post(
        `${url}/my/class-like`,
        {},
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
          params: { classId: id },
        }
      )
      .then(() => {
        setMeetings(prev =>
          prev.map(m =>
            m.id === id ? { ...m, liked: !m.liked } : m
          )
        );
      })
      .catch(() => alert('좋아요 처리 중 오류가 발생했습니다.'));
  };

  const safe = Array.isArray(meetings) ? meetings : [];
  const visible = showAll ? safe : safe.slice(0, 4);

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

      {/* No liked classes */}
      {safe.length === 0 && (
        <div className="text-center py-20">
          <p className="mb-4 text-gray-600">아직 좋아요한 모임이 없습니다.</p>
          <Link
            to="/classList"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            모임 보러가기
          </Link>
        </div>
      )}

      {/* Meeting Cards */}
      {safe.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {visible.map(meeting => (
              <div
                key={meeting.id}
                className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow relative"
              >
                {/* 좋아요 토글 버튼 */}
                <button
                  onClick={() => toggleLike(meeting.id)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
                >
                  {meeting.liked ? (
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                        6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                        3.57 2.36h1.87C13.46 5.99 14.96 
                        5 16.5 5 18.5 5 20 6.5 20 
                        8.5c0 3.78-3.4 6.86-8.55 
                        11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                        6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                        3.57 2.36h1.87C13.46 5.99 14.96 
                        5 16.5 5 18.5 5 20 6.5 20 
                        8.5c0 3.78-3.4 6.86-8.55 
                        11.54L12 21.35z" />
                    </svg>
                  )}
                </button>

                {/* Card Content Link */}
                <Link to={`/classDetail/${meeting.id}`}>
                  <img
                    src={`${url}/image?filename=${meeting.image}`}
                    alt={meeting.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-1">
                    <div className="font-semibold text-sm line-clamp-1">
                      {meeting.title}
                    </div>

                    {meeting.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {meeting.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-sm text-gray-500 mt-2">📅 {meeting.date}</div>
                    <div className="text-sm text-gray-500">📍 {meeting.location}</div>
                    <div className="text-sm text-gray-500">👥 {meeting.participants}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {safe.length > 4 && !showAll && (
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
