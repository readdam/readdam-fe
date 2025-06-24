// src/pages/my/MyReservation.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const MyReservation = () => {
  const token = useAtomValue(tokenAtom);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;
    axios.get(`${url}/my/reservations`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
      withCredentials: true,
    })
    .then(res => setReservations(res.data))
    .catch(console.error);
  }, [token]);

  const handleCancel = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) return;
    try {
      await axios.delete(`${url}/my/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      });
      setReservations(prev =>
        prev.map(r =>
          r.reservationId === id
            ? { ...r, status: 'CANCELLED' }
            : r
        )
      );
      alert('예약이 취소되었습니다.');
    } catch (error) {
      alert(error.response?.data || '예약 취소 중 오류 발생');
    }
  };

  const today = new Date().toISOString().slice(0,10);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-6">내 예약 목록</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reservations.map(post => {
          const isToday = post.date === today;

          return (
            <Link
              key={post.reservationId}
              to={`/placeDetail/${post.placeId}`}
              className="block bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <img
                src={post.image
                  ? `${url}/image?filename=${post.image}`
                  : '/images/default.jpg'}
                alt={post.placeName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold">{post.placeName}</h3>
                <p className="text-sm text-gray-500">📍 {post.location}</p>
                <p className="text-sm text-gray-500">📅 {post.date}</p>
                <p className="text-sm text-gray-500">⏰ {post.timeRange}</p>
                <p className="text-sm text-gray-500">👥 인원 {post.participantCount}명</p>

                {post.status === 'CANCELLED' ? (
                  <span className="mt-3 block text-center text-gray-500 text-sm font-medium">
                    예약 취소됨
                  </span>
                ) : post.status === 'CONFIRMED' ? (
                  <span className="mt-3 block text-center text-blue-600 text-sm font-medium">
                    예약 확정
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleCancel(post.reservationId, e)}
                    disabled={isToday}
                    className={`mt-3 w-full py-2 rounded-md text-sm font-semibold ${
                      isToday
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
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
    </div>
  );
};

export default MyReservation;
