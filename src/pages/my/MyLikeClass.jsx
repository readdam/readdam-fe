// src/pages/my/MyLikeClass.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { useAxios } from '../../hooks/useAxios';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import {
  CalendarIcon,
  CompassIcon,
  MapPinIcon,
  UsersIcon,
  HeartIcon,
} from 'lucide-react';

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
];

const ITEMS_PER_PAGE = 12;

export default function MyLikeClass() {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);
  const axios = useAxios();

  const [allMeetings, setAllMeetings] = useState([]); // 전체 좋아요 모임
  const [page, setPage] = useState(0);                // 현재 페이지

  // 한 번만 전체 좋아요 모임 가져오기
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
        }));
        setAllMeetings(mapped);
      })
      .catch(() => {
        setAllMeetings([]);
      });
  }, [token, axios]);

  // 현재 페이지에 보여줄 모임
  const meetings = allMeetings.slice(0, (page + 1) * ITEMS_PER_PAGE);
  const hasMore = meetings.length < allMeetings.length;

  const toggleLike = id => {
    setAllMeetings(prev => prev.filter(m => m.id !== id));
    alert('좋아요가 취소되었습니다.');

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

      {/* 콘텐츠 */}
      {allMeetings.length === 0 ? (
        <div className="text-center py-20">
          <p className="mb-4 text-gray-600">아직 좋아요한 모임이 없습니다.</p>
          <Link
            to="/classList"
            className="inline-block px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            모임 보러가기
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {meetings.map(meeting => (
              <div
                key={meeting.id}
                className="relative bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleLike(meeting.id);
                  }}
                >
                  <HeartIcon fill="#E88D67" stroke="#E88D67" className="w-5 h-5" />
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
                      <CompassIcon className="w-5 h-5 mr-1" />
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

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setPage(prev => prev + 1)}
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
