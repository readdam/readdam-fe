// src/pages/my/MyLikeClass.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { useAxios } from '../../hooks/useAxios';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import { CalendarIcon, MapPinIcon, UsersIcon, HeartIcon } from 'lucide-react';

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
];

export default function MyLikeClass() {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);
  const axios = useAxios();
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
        setMeetings(
          list.map(item => ({
            id: item.classId,
            title: item.title,
            date: item.round1Date?.split('T')[0] || '',
            location: item.round1PlaceLoc || '',
            participants: `${item.currentParticipants}/${item.maxPerson}명`,
            tags: [item.tag1, item.tag2, item.tag3].filter(Boolean),
            image: item.mainImg || '',
            liked: item.liked ?? false,
          }))
        );
      })
      .catch(() => setMeetings([]));
  }, [token, axios]);

  const toggleLike = id => {
    // Optimistic removal + alert
    setMeetings(prev => {
      const target = prev.find(m => m.id === id);
      if (target?.liked) {
        alert('좋아요가 취소되었습니다.');
        return prev.filter(m => m.id !== id);
      }
      return prev;
    });

    // Send request (no need to wait)
    axios
      .post(
        `${url}/my/class-like`,
        {},
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
          params: { classId: id },
        }
      )
      .catch(() => alert('좋아요 처리 중 오류가 발생했습니다.'));
  };

  const safe = Array.isArray(meetings) ? meetings : [];
  const visible = showAll ? safe : safe.slice(0, 4);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">좋아요</h1>
        <p className="text-gray-600">좋아요한 모임을 확인하세요</p>
      </div>

      {/* 탭 */}
      <div className="flex space-x-6 border-b mb-8 text-sm">
        {tabs.map(tab => (
          <Link
            key={tab.label}
            to={tab.path}
            className={`pb-2 transition-all ${
              location.pathname === tab.path
                ? 'text-[#005C78] border-b-2 border-[#005C78] font-semibold'
                : 'text-gray-500 hover:text-[#006989]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 좋아요한 모임 없을 때 */}
      {safe.length === 0 && (
        <div className="text-center py-20">
          <p className="mb-4 text-gray-600">아직 좋아요한 모임이 없습니다.</p>
          <Link
            to="/classList"
            className="inline-block px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            모임 보러가기
          </Link>
        </div>
      )}

      {/* 모임 카드 리스트 */}
      {safe.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {visible.map(meeting => (
              <div
                key={meeting.id}
                className="relative bg-white border border-[#006989] rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
              >
                {/* 좋아요 버튼 */}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10 pointer-events-auto"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleLike(meeting.id);
                  }}
                >
                  <HeartIcon
                    fill="#E88D67"
                    stroke="#E88D67"
                    className="w-5 h-5"
                  />
                </button>

                <Link to={`/classDetail/${meeting.id}`}>
                  {meeting.image ? (
                    <img
                      src={`${url}/image?filename=${meeting.image}`}
                      alt={meeting.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      <MapPinIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}

                  <div className="p-4 space-y-1">
                    <div className="font-semibold text-base line-clamp-1">
                      {meeting.title}
                    </div>

                    {meeting.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {meeting.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#F3F7EC] text-[#005C78] px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <CalendarIcon className="w-5 h-5 mr-1" />
                      {meeting.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="w-5 h-5 mr-1" />
                      {meeting.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="w-5 h-5 mr-1" />
                      {meeting.participants}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {safe.length > 4 && !showAll && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2 border border-[#006989] text-[#006989] rounded-md text-sm hover:bg-[#F3F7EC] transition"
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
