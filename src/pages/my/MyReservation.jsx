// src/pages/my/MyReservation.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { useAxios } from '../../hooks/useAxios';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
} from 'lucide-react';

export default function MyReservation() {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const api = useAxios();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;
    api
      .get(`${url}/my/reservations`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => setReservations(res.data))
      .catch(console.error);
  }, [token, api]);

  const handleCancel = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) return;
    try {
      await api.delete(`${url}/my/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      });
      setReservations(prev =>
        prev.map(r =>
          r.reservationId === id ? { ...r, status: 'CANCELLED' } : r
        )
      );
    } catch (error) {
      alert(error.response?.data || '예약 취소 중 오류 발생');
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">내 예약</h1>
        <p className="text-gray-600">예약한 장소를 확인하세요</p>
      </div>

      {/* 콘텐츠 */}
      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">아직 예약한 장소가 없습니다.</p>
          <button
            onClick={() => navigate('/place')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            장소 보러 가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {reservations.map(post => {
            const isToday = post.date === today;
            return (
              <Link
                key={post.reservationId}
                to={`/placeDetail/${post.placeId}`}
                className="relative block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={
                    post.image
                      ? `${url}/image?filename=${post.image}`
                      : '/images/default.jpg'
                  }
                  alt={post.placeName}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-base line-clamp-1">
                    {post.placeName}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 space-x-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>
                      {post.basicAddress} {post.detailAddress}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{post.timeRange}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-1">
                    <UsersIcon className="w-4 h-4" />
                    <span>인원 {post.participantCount}명</span>
                  </div>

                  {/* 상태 표시를 버튼처럼 */}
                  {post.status === 'CONFIRMED' ? (
                    <button
                      type="button"
                      className="mt-3 w-full h-10 rounded-md text-sm font-semibold bg-green-100 text-green-800 cursor-default pointer-events-none flex items-center justify-center"
                    >
                      확정됨
                    </button>
                  ) : post.status === 'CANCELLED' ? (
                    <button
                      type="button"
                      className="mt-3 w-full h-10 rounded-md text-sm font-semibold bg-red-100 text-red-800 cursor-default pointer-events-none flex items-center justify-center"
                    >
                      취소됨
                    </button>
                  ) : (
                    <button
                      onClick={e => handleCancel(post.reservationId, e)}
                      disabled={isToday}
                      className={`mt-3 w-full h-10 rounded-md text-sm font-semibold flex items-center justify-center ${
                        isToday
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-[#E88D67] hover:bg-[#d47c5a] text-white'
                      }`}
                    >
                      {isToday ? '당일 취소 불가' : '예약 취소'}
                    </button>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
