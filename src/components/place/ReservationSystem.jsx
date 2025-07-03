import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, CheckIcon } from 'lucide-react';
import { url } from '@config/config';
import { userAtom } from '../../atoms';
import { useAtomValue } from 'jotai';
import { useAxios } from '@hooks/useAxios';
import dayjs from 'dayjs';

const ReservationSystem = ({ rooms = [] }) => {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState([]);
  const [people, setPeople] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [request, setRequest] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const user = useAtomValue(userAtom);

  const axios = useAxios();

  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [timeData, setTimeData] = useState({
    allTimes: [],
    reservedTimes: [],
    availableTimes: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const [selectedRanges, setSelectedRanges] = useState([]);

  useEffect(() => {
    console.log(selectedRanges);
  }, [selectedRanges]);

  const handleDateChange = async () => {
    // if (!selectedRoomId || !date) return;
    if (!date) return;
    try {
      setIsLoading(true);
      const response = await axios.get('/my/reservations/availableTimes', {
        params: {
          placeRoomId: selectedRoomId,
          date: dayjs(date).format('YYYY-MM-DD'),
        },
      });
      console.log('예약 가능 시간 응답:', response.data);
      setTimeData(response.data);
    } catch (error) {
      console.error('예약 가능 시간 조회 실패', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPhone(user.phone);
    setName(user.name);
  }, [user]);

  useEffect(() => {
    if (selectedRoomId && date) {
      handleDateChange();
    }
  }, [selectedRoomId, date]);

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

  const handleTimeSelection = (time) => {
    if (selectedTime.length === 0) {
      // 첫 선택
      setSelectedTime([time]);
    } else if (selectedTime.length === 1) {
      if (selectedTime[0] === time) {
        // 같은 시간 클릭 = 해제
        setSelectedTime([]);
      } else {
        // 두 번째 선택 (범위 선택)
        const allTimes = timeData.allTimes.filter(
          (t) => !timeData.reservedTimes.includes(t)
        );
        const startIdx = allTimes.indexOf(selectedTime[0]);
        const endIdx = allTimes.indexOf(time);
        const start = Math.min(startIdx, endIdx);
        const end = Math.max(startIdx, endIdx);
        const range = allTimes.slice(start, end + 1);
        setSelectedTime(range);
      }
    } else {
      // 이미 여러 개 선택됨 = 새로운 선택 시작
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
                onClick={() => {
                  console.log(room.roomId);
                  console.log(room);
                  setSelectedRoom(room);
                  setSelectedRoomId(room.roomId);
                }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRoom === null
                    ? 'border-gray-200 bg-white hover:border-[#006989]'
                    : selectedRoom?.roomId === room.roomId
                    ? 'border-[#006989] bg-[#F3F7EC]'
                    : 'border-gray-200 bg-white hover:border-[#006989]'
                }`}
              >
                <div className="flex gap-4">
                  {room.images.length > 0 ? (
                    <img
                      src={`${url}/image?filename=${room.images[0]}`}
                      alt={room.name}
                      className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-md" />
                  )}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {room.description}
                      </p>
                      <div className="text-sm text-gray-600 flex gap-4">
                        <span>크기: {room.size}</span>
                        <span>
                          수용 인원: {room.minPerson}~{room.maxPerson}명
                        </span>
                      </div>
                    </div>
                    {/* 시설 아이콘 */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.facilities?.airConditioner && (
                        <div className="flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">
                          ❄️ 에어컨
                        </div>
                      )}
                      {room.facilities?.heater && (
                        <div className="flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">
                          🔥 난방
                        </div>
                      )}
                      {room.facilities?.whiteboard && (
                        <div className="flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">
                          📝 화이트보드
                        </div>
                      )}
                      {room.facilities?.wifi && (
                        <div className="flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">
                          📶 와이파이
                        </div>
                      )}
                      {room.facilities?.projector && (
                        <div className="flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">
                          📽️ 프로젝터
                        </div>
                      )}
                      {room.facilities?.powerOutlet && (
                        <div className="flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">
                          🔌 콘센트
                        </div>
                      )}
                      {room.facilities?.window && (
                        <div className="flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">
                          🪟 창문
                        </div>
                      )}
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
                  // handleDateChange(e.target.value);
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
                  {timeData.allTimes.map((time) => {
                    const isReserved = timeData.reservedTimes.includes(time);
                    const isSelected = selectedTime.includes(time);

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={isReserved}
                        onClick={() => handleTimeSelection(time)}
                        className={`py-2 px-4 rounded-md text-sm font-medium border transition-colors
                        ${
                          selectedTime.includes(time)
                            ? 'bg-[#006989] text-white border-[#006989]'
                            : isReserved
                            ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>

                {selectedTime.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      선택된 시간: {selectedTime[0]} ~{' '}
                      {selectedTime[selectedTime.length - 1]}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedRoom || !date || selectedTime.length === 0)
                          return;

                        const exists = selectedRanges.some(
                          (r) =>
                            r.date === date && r.roomId === selectedRoom.roomId
                        );

                        if (exists) {
                          // 같은 날짜에 이미 등록됨
                          return;
                        }

                        setSelectedRanges((prev) => [
                          ...prev,
                          {
                            date: date,
                            start: selectedTime[0],
                            end: selectedTime[selectedTime.length - 1],
                            times: [...selectedTime],
                            roomId: selectedRoom.roomId,
                            roomName: selectedRoom.name,
                          },
                        ]);
                        setSelectedTime([]);
                      }}
                      className="ml-2 px-3 py-1 bg-[#006989] text-white text-sm rounded hover:bg-[#005C78]"
                    >
                      추가
                    </button>
                  </div>
                )}

                {selectedRanges.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {selectedRanges.map((range, idx) => (
                      <div
                        key={`${range.roomId}-${range.date}-${range.start}-${range.end}`}
                        className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow transition"
                      >
                        <div className="flex flex-col text-sm text-gray-700">
                          <div className="font-medium text-gray-800">
                            {idx + 1}회차 - {range.roomName}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            📅 {range.date} | 🕒 {range.start} ~ {range.end}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRanges((prev) =>
                              prev.filter(
                                (r) =>
                                  !(
                                    r.date === range.date &&
                                    r.start === range.start &&
                                    r.end === range.end &&
                                    r.roomId === range.roomId
                                  )
                              )
                            );
                          }}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
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
                {selectedRoom &&
                  Array.from(
                    {
                      length:
                        selectedRoom.maxPerson - selectedRoom.minPerson + 1,
                    },
                    (_, i) => selectedRoom.minPerson + i
                  ).map((num) => (
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
