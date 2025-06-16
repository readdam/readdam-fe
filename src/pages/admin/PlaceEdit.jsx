import React, { useEffect, useState } from 'react';
import { ArrowLeft, Upload, X, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { usePrompt } from '@hooks/usePrompt'; // 경로는 맞게 수정

export default function PlaceEdit() {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedWeekdaySlots, setSelectedWeekdaySlots] = useState([]);
  const [selectedWeekendSlots, setSelectedWeekendSlots] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    id: Date.now(),
    name: '',
    description: '',
    size: '',
    minCapacity: 3,
    maxCapacity: 3,
    image: null,
    facilities: {
      airConditioner: false,
      heater: false,
      tv: false,
      whiteboard: false,
      wifi: false,
      projector: false,
      socket: false,
      window: false,
    },
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const facilityOptions = {
    airConditioner: { label: '에어컨', emoji: '❄️' },
    heater: { label: '난방', emoji: '🔥' },
    tv: { label: 'TV', emoji: '📺' },
    whiteboard: { label: '화이트보드', emoji: '📋' },
    wifi: { label: '와이파이', emoji: '📶' },
    projector: { label: '프로젝터', emoji: '📽️' },
    socket: { label: '콘센트', emoji: '🔌' },
    window: { label: '창문', emoji: '🪟' },
  };
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${String(i).padStart(2, '0')}:00`);
    }
    return slots;
  };
  const [weekdaySlots] = useState(generateTimeSlots());
  const [weekendSlots] = useState(generateTimeSlots());
  const [images, setImages] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const navigate = useNavigate();

  const handleRoomImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingRoom) {
          setEditingRoom({ ...editingRoom, image: reader.result });
        } else {
          setCurrentRoom({ ...currentRoom, image: reader.result });
        }
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  //   const handleImageUpload = (e) => {
  //     const files = e.target.files;
  //     if (files) {
  //       Array.from(files).forEach((file) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           setImages((prev) => [...prev, reader.result]);
  //         };
  //         reader.readAsDataURL(file);
  //       });
  //     }
  //   };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && newKeyword.trim() !== '') {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const toggleSlot = (time, type) => {
    const state =
      type === 'weekday' ? selectedWeekdaySlots : selectedWeekendSlots;
    const setState =
      type === 'weekday' ? setSelectedWeekdaySlots : setSelectedWeekendSlots;
    setState(
      state.includes(time) ? state.filter((t) => t !== time) : [...state, time]
    );
  };

  const toggleAllSlots = (type) => () => {
    const slots = type === 'weekday' ? weekdaySlots : weekendSlots;
    const state =
      type === 'weekday' ? selectedWeekdaySlots : selectedWeekendSlots;
    const setState =
      type === 'weekday' ? setSelectedWeekdaySlots : setSelectedWeekendSlots;
    setState(state.length === slots.length ? [] : slots);
  };

  const handleTimeSelection = (time, type) => {
    const slots = type === 'weekday' ? weekdaySlots : weekendSlots;
    const selectedSlots =
      type === 'weekday' ? selectedWeekdaySlots : selectedWeekendSlots;
    const setSelectedSlots =
      type === 'weekday' ? setSelectedWeekdaySlots : setSelectedWeekendSlots;
    if (selectedSlots.length === 0) {
      setSelectedSlots([time]);
    } else if (selectedSlots.length === 1) {
      const startIdx = slots.indexOf(selectedSlots[0]);
      const endIdx = slots.indexOf(time);
      const start = Math.min(startIdx, endIdx);
      const end = Math.max(startIdx, endIdx);
      setSelectedSlots(slots.slice(start, end + 1));
    } else {
      setSelectedSlots([time]);
    }
  };

  const handleAddRoom = () => {
    if (currentRoom.name.trim() === '') {
      alert('방 이름을 입력해주세요.');
      return;
    }
    if (editingRoom) {
      setRooms(
        rooms.map((room) => (room.id === editingRoom.id ? currentRoom : room))
      );
      setEditingRoom(null);
    } else {
      setRooms([...rooms, currentRoom]);
    }
    setCurrentRoom({
      id: Date.now(),
      name: '',
      description: '',
      size: '',
      minCapacity: 3,
      maxCapacity: 5,
      image: null,
      facilities: {
        airConditioner: false,
        heater: false,
        tv: false,
        whiteboard: false,
        wifi: false,
        projector: false,
        socket: false,
        window: false,
      },
    });
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setCurrentRoom(room);
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
    setCurrentRoom({
      id: Date.now(),
      name: '',
      description: '',
      size: '',
      minCapacity: 3,
      maxCapacity: 5,
      image: null,
      facilities: {
        airConditioner: true,
        heater: true,
        tv: false,
        whiteboard: true,
        wifi: true,
        projector: false,
        socket: true,
        window: true,
      },
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // ✅ 브라우저 새로고침/닫기 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty]);

  // ✅ 라우터 이동 방지
  usePrompt(
    '이 페이지를 벗어나시겠습니까? 작성하신 내용은 저장되지 않습니다.',
    isFormDirty
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft
            className="w-6 h-6"
            onClick={() => navigate('/placeList')}
          />
        </button>
        <h1 className="text-2xl font-bold">장소 수정</h1>
      </div>

      <form className="space-y-8" onChange={() => setIsFormDirty(true)}>
        {/* 기본 정보 */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">기본 정보</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">장소명</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="장소명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">주소</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="주소를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">전화번호</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="전화번호를 입력하세요"
              />
            </div>
          </div>
        </section>

        {/* 예약 가능 시간대 */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">예약 가능 시간대</h2>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">평일</h3>
              <button
                type="button"
                onClick={toggleAllSlots('weekday')}
                className="flex items-center gap-1 text-sm bg-[#006989] text-white px-3 py-1 rounded hover:bg-[#005c78] transition"
              >
                <CheckSquare className="w-4 h-4" />
                {selectedWeekdaySlots.length === weekdaySlots.length
                  ? '모두 해제'
                  : '모두 선택'}
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {weekdaySlots.map((slot) => (
                <button
                  key={`weekday-${slot}`}
                  type="button"
                  onClick={() => handleTimeSelection(slot, 'weekday')}
                  className={`py-2 rounded-md text-sm font-medium border transition ${
                    selectedWeekdaySlots.includes(slot)
                      ? 'bg-[#006989] text-white border-[#006989]'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">주말</h3>
              <button
                type="button"
                onClick={toggleAllSlots('weekend')}
                className="flex items-center gap-1 text-sm bg-[#006989] text-white px-3 py-1 rounded hover:bg-[#005c78] transition"
              >
                <CheckSquare className="w-4 h-4" />
                {selectedWeekendSlots.length === weekendSlots.length
                  ? '모두 해제'
                  : '모두 선택'}
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {weekendSlots.map((slot) => (
                <button
                  key={`weekend-${slot}`}
                  type="button"
                  onClick={() => handleTimeSelection(slot, 'weekend')}
                  className={`py-2 rounded-md text-sm font-medium border transition ${
                    selectedWeekendSlots.includes(slot)
                      ? 'bg-[#006989] text-white border-[#006989]'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 상세 정보 */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">상세 정보</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                공간 소개
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="공간에 대해 소개해주세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">키워드</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#F3F7EC] text-[#006989] rounded-full text-sm flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleAddKeyword}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="키워드를 입력하고 Enter를 눌러주세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                공간 사진
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#006989]">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      사진 업로드
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 방 정보 */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">방 정보</h2>
          {/* 등록된 방 목록 */}
          {rooms.length > 0 && (
            <div className="mb-8 space-y-4">
              <h3 className="font-medium text-gray-700">등록된 방 목록</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4 relative">
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="flex gap-4">
                      {room.image ? (
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{room.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {room.description}
                        </p>
                        <div className="text-sm text-gray-600">
                          <p>크기: {room.size}</p>
                          <p>
                            수용 인원: {room.minCapacity}~{room.maxCapacity}명
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(room.facilities)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <span
                              key={key}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {facilityOptions[key].emoji}{' '}
                              {facilityOptions[key].label}
                            </span>
                          ))}
                      </div>
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="text-sm text-[#006989] hover:underline"
                      >
                        수정하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 새 방 추가/수정 폼 */}
          <div className="space-y-6">
            <h3 className="font-medium text-gray-700">
              {editingRoom ? '방 정보 수정' : '새 방 추가'}
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  방 사진
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`공간 사진 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#006989]">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      사진 업로드
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleRoomImageUpload}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  최대 8장까지 업로드 가능합니다
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  방 이름
                </label>
                <input
                  type="text"
                  value={currentRoom.name}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                  placeholder="방 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  방 설명
                </label>
                <textarea
                  value={currentRoom.description}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                  rows={4}
                  placeholder="방의 특징과 구비된 물품 등을 자세히 설명해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  방 크기
                </label>
                <input
                  type="text"
                  value={currentRoom.size}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      size: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                  placeholder="방 크기를 입력하세요 (예: 20평방미터)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  수용 인원
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">최소</span>
                    <select
                      value={currentRoom.minCapacity}
                      onChange={(e) =>
                        setCurrentRoom({
                          ...currentRoom,
                          minCapacity: Number(e.target.value),
                        })
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                    >
                      {Array.from(
                        {
                          length: 8,
                        },
                        (_, i) => i + 3
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num}명
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">최대</span>
                    <select
                      value={currentRoom.maxCapacity}
                      onChange={(e) =>
                        setCurrentRoom({
                          ...currentRoom,
                          maxCapacity: Number(e.target.value),
                        })
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                    >
                      {Array.from(
                        {
                          length: 8,
                        },
                        (_, i) => i + 3
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num}명
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  시설 정보
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(facilityOptions).map(
                    ([key, { label, emoji }]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={currentRoom.facilities[key]}
                          onChange={(e) =>
                            setCurrentRoom({
                              ...currentRoom,
                              facilities: {
                                ...currentRoom.facilities,
                                [key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-[#006989] rounded border-gray-300 focus:ring-[#006989]"
                        />
                        <span className="text-sm">
                          {emoji} {label}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="flex-1 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {editingRoom ? '수정 완료' : '방 추가하기'}
                </button>
                {editingRoom && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    수정 취소
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-all duration-200"
          >
            저장하기
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
