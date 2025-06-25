import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, CheckIcon } from 'lucide-react';

const ReservationSystem = ({
  placeId,
  isLoggedIn = true,
  rooms = [],
  // rooms prop을 빈 배열로 기본값 설정
  operatingHours = {
    weekday: {
      start: '10:00',
      end: '22:00',
      slots: Array.from(
        {
          length: 13,
        },
        (_, i) => `${String(i + 10).padStart(2, '0')}:00`
      ),
    },
    weekend: {
      start: '11:00',
      end: '20:00',
      slots: Array.from(
        {
          length: 10,
        },
        (_, i) => `${String(i + 11).padStart(2, '0')}:00`
      ),
    },
  },
}) => {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState([]);
  const [people, setPeople] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [request, setRequest] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 임시 예약된 시간 (실제로는 API에서 받아와야 함)
  const [bookedSlots] = useState({
    '2024-01-20': ['10:00', '10:30', '14:00', '14:30'],
    '2024-01-21': ['11:00', '11:30', '15:00', '15:30'],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTime.length === 0) {
      alert('예약 시간을 선택해주세요.');
      return;
    }
    setIsSubmitted(true);
  };
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  const isWeekend = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay() === 0 || date.getDay() === 6;
  };
  const getAvailableSlots = () => {
    if (!date) return [];
    const isWeekendDay = isWeekend(date);
    const slots = isWeekendDay
      ? operatingHours.weekend.slots
      : operatingHours.weekday.slots;
    const bookedSlotsForDate = bookedSlots[date] || [];
    return slots.filter((slot) => !bookedSlotsForDate.includes(slot));
  };
  const handleTimeSelection = (time) => {
    if (selectedTime.length === 0) {
      // 첫 선택
      setSelectedTime([time]);
    } else if (selectedTime.length === 1) {
      // 두 번째 선택 (범위 선택)
      const slots = isWeekend(date)
        ? operatingHours.weekend.slots
        : operatingHours.weekday.slots;
      const startIdx = slots.indexOf(selectedTime[0]);
      const endIdx = slots.indexOf(time);
      const start = Math.min(startIdx, endIdx);
      const end = Math.max(startIdx, endIdx);
      setSelectedTime(slots.slice(start, end + 1));
    } else {
      // 새로운 선택 시작
      setSelectedTime([time]);
    }
  };
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-[#006989] rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            예약이 완료되었습니다
          </h2>
          <p className="text-gray-600 mb-1">날짜: {date}</p>
          <p className="text-gray-600 mb-1">방: {selectedRoom?.name}</p>
          <p className="text-gray-600 mb-1">시간: {selectedTime.join(', ')}</p>
          <p className="text-gray-600 mb-6">인원: {people}명</p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSelectedRoom(null);
              setSelectedTime([]);
            }}
            className="px-4 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78]"
          >
            새로운 예약하기
          </button>
        </div>
      </div>
    );
  }
  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">예약하기</h2>
          <p className="text-gray-600 mb-6">
            예약을 위해서는 로그인이 필요합니다.
          </p>
          <button className="px-4 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78]">
            로그인하기
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">예약하기</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 방 선택 섹션 */}
        <div className="space-y-4">
          <label className="block text-gray-700 mb-2">방 선택</label>
          <div className="grid grid-cols-1 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRoom?.id === room.id
                    ? 'border-[#006989] bg-[#F3F7EC]'
                    : 'border-gray-200 hover:border-[#006989]'
                }`}
              >
                <div className="flex gap-4">
                  {room.image ? (
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {room.description}
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>크기: {room.size}</p>
                      <p>
                        수용 인원: {room.minPerson}~{room.maxPerson}명
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedRoom && (
          <>
            {/* 날짜 선택 */}
            <div>
              <label className="block text-gray-700 mb-2 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-1 text-[#006989]" />
                날짜
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedTime([]);
                }}
                min={getTomorrow()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006989]"
                required
              />
            </div>
            {/* 시간 선택 */}
            {date && (
              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-1 text-[#006989]" />
                  시간 선택
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(isWeekend(date)
                    ? operatingHours.weekend.slots
                    : operatingHours.weekday.slots
                  ).map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelection(time)}
                      className={`py-2 px-4 rounded-md text-sm font-medium border transition-colors
                        ${
                          selectedTime.includes(time)
                            ? 'bg-[#006989] text-white border-[#006989]'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {selectedTime.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    선택된 시간: {selectedTime[0]} ~{' '}
                    {selectedTime[selectedTime.length - 1]}
                  </p>
                )}
              </div>
            )}
            {/* 인원 선택 */}
            <div>
              <label className="block text-gray-700 mb-2 flex items-center">
                <UsersIcon className="w-5 h-5 mr-1 text-[#006989]" />
                인원
              </label>
              <select
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006989]"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>
            {/* 예약자 이름 */}
            <div>
              <label className="block text-gray-700 mb-2">예약자 이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006989]"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            {/* 연락처 */}
            <div>
              <label className="block text-gray-700 mb-2">연락처</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006989]"
                placeholder="010-0000-0000"
                required
              />
            </div>
            {/* 요청사항 */}
            <div>
              <label className="block text-gray-700 mb-2">요청사항</label>
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006989]"
                rows={3}
                placeholder="요청사항이 있으시면 입력해주세요"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={!selectedRoom || !date || selectedTime.length === 0}
              className="w-full py-3 bg-[#E88D67] text-white font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              예약하기
            </button>
          </>
        )}
      </form>
    </div>
  );
};
export default ReservationSystem;
