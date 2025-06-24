// src/pages/my/MyReservation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const MyReservation = () => {
  const token = useAtomValue(tokenAtom);
  const [reservations, setReservations] = useState([]);
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    if (!token?.access_token) return;
    axios.get(`${url}/my/reservations`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
      withCredentials: true,
    })
    .then(res => setReservations(res.data))
    .catch(console.error);
  }, [token]);

  // reservations 바뀔 때마다 그룹핑
  useEffect(() => {
    // 1) id 별로 묶기
    const map = new Map();
    reservations.forEach(r => {
      const list = map.get(r.reservationId) || { ...r, times: [] };
      list.times.push(r.time); 
      map.set(r.reservationId, list);
    });

    // 2) 각 그룹마다 timeRange 계산
    const result = Array.from(map.values()).map(item => {
      const times = item.times
        .map(t => t.slice(0,5))      // "14:00:00" → "14:00"
        .sort();                     
      // 연속된 시간만 뽑기
      let end = times[0];
      for (let i = 1; i < times.length; i++) {
        const prev = new Date(`1970-01-01T${end}`);
        const curr = new Date(`1970-01-01T${times[i]}`);
        if ((curr - prev) === 3600_000) end = times[i];
      }
      // 마지막 시간 +1h
      const endDate = new Date(`1970-01-01T${end}`);
      endDate.setHours(endDate.getHours() + 1);
      const endStr = endDate.toTimeString().slice(0,5);

      return {
        ...item,
        timeRange: `${times[0]} ~ ${endStr}`
      };
    });

    setGrouped(result);
  }, [reservations]);

  const handleCancel = async id => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) return;
    try {
      await axios.delete(`${url}/my/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      });
      setReservations(prev => prev.filter(r => r.reservationId !== id));
      alert('예약이 취소되었습니다.');
    } catch {
      alert('예약 취소 중 오류 발생');
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-6">내 예약 목록</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {grouped.map(post => (
          <div key={post.reservationId} className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <img
              src={post.image
                ? `${url}/image?filename=${post.image}`
                : '/images/default.jpg'}
              alt={post.placeName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <p className="text-sm text-gray-500">📍 {post.location}</p>
              <p className="text-sm text-gray-500">📅 {post.date}</p>
              <p className="text-sm text-gray-500">⏰ {post.timeRange}</p>
              <p className="text-sm text-gray-500">👥 인원 {post.participantCount}명</p>
              <button
                onClick={() => handleCancel(post.reservationId)}
                className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-semibold"
              >
                예약 취소
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReservation;
