import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import { myAxios } from '@utils/axios'; // 네 axios 유틸
import BasicInfoSection from '@components/admin/place/BasicInfoSection';
import { AvailableTimeSection } from '@components/admin/place/AvailableTimeSection';
import PlaceDetailForm from '@components/admin/place/PlaceDetailForm';
import { RoomList } from '@components/admin/place/RoomList';
import RoomForm from '@components/admin/place/RoomForm';

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

export default function PlaceAdd() {
  const navigate = useNavigate();

  // 장소 정보
  const [placeName, setPlaceName] = useState('');
  const [placeAddress, setPlaceAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [introduceText, setIntroduceText] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // 시간대
  const [selectedWeekdaySlots, setSelectedWeekdaySlots] = useState([]);
  const [selectedWeekendSlots, setSelectedWeekendSlots] = useState([]);

  // 방 정보
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(createInitialRoom());
  const [editingRoom, setEditingRoom] = useState(null);
  const [images, setImages] = useState([]);

  function createInitialRoom() {
    return {
      id: Date.now(),
      name: '',
      description: '',
      size: '',
      minCapacity: 3,
      maxCapacity: 5,
      images: [],
      facilities: Object.fromEntries(
        Object.keys(facilityOptions).map((key) => [key, false])
      ),
    };
  }

  const handleAddRoom = () => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? currentRoom : r)));
      setEditingRoom(null);
    } else {
      setRooms([...rooms, currentRoom]);
    }
    setCurrentRoom(createInitialRoom());
    setImages([]);
  };

  const handleEditRoom = (room) => {
    setCurrentRoom(room);
    setEditingRoom(room);
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter((r) => r.id !== roomId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const placeDto = {
      name: placeName,
      address: placeAddress,
      phone: phoneNumber,
      introduce: introduceText,
      tags: keywords,
      openWeekdays: selectedWeekdaySlots,
      openWeekends: selectedWeekendSlots,
      placeImages: [imagePreview],
    };

    const roomDtos = rooms.map((room) => ({
      name: room.name,
      description: room.description,
      size: room.size,
      minCapacity: room.minCapacity,
      maxCapacity: room.maxCapacity,
      facilities: Object.entries(room.facilities)
        .filter(([_, v]) => v)
        .map(([k]) => k),
      roomImages: room.images,
    }));

    const payload = {
      place: placeDto,
      rooms: roomDtos,
    };

    // try {
    //   await myAxios().post('/main/place', payload);
    //   alert('장소 등록 완료!');
    //   navigate('/otherPlaceList');
    // } catch (err) {
    //   alert('등록 실패!');
    //   console.error(err);
    // }
  };
  const [imagePreviews, setImagePreviews] = useState([]);
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && imagePreviews.length < 10) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };
  const [newKeyword, setNewKeyword] = useState('');

  // 방 사진 추가
  const handleRoomImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const allowedCount = 10 - currentRoom.images.length;
    const filesToAdd = files.slice(0, allowedCount); // 최대 10장 제한

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentRoom((prevRoom) => ({
          ...prevRoom,
          images: [...prevRoom.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveRoomImage = (index) => {
    setCurrentRoom((prevRoom) => ({
      ...prevRoom,
      images: prevRoom.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto space-y-8">
      <BasicInfoSection
        placeName={placeName}
        setPlaceName={setPlaceName}
        placeAddress={placeAddress}
        setPlaceAddress={setPlaceAddress}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

      <AvailableTimeSection
        selectedWeekdaySlots={selectedWeekdaySlots}
        setSelectedWeekdaySlots={setSelectedWeekdaySlots}
        selectedWeekendSlots={selectedWeekendSlots}
        setSelectedWeekendSlots={setSelectedWeekendSlots}
      />

      <PlaceDetailForm
        introduceText={introduceText}
        setIntroduceText={setIntroduceText}
        keywords={keywords}
        setKeywords={setKeywords}
        newKeyword={newKeyword}
        setNewKeyword={setNewKeyword}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        handleImageUpload={handleImageUpload}
      />

      <RoomList
        rooms={rooms}
        handleEditRoom={handleEditRoom}
        handleDeleteRoom={handleDeleteRoom}
        facilityOptions={facilityOptions}
      />

      <RoomForm
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        editingRoom={editingRoom}
        handleAddRoom={handleAddRoom}
        handleCancelEdit={() => {
          setCurrentRoom(createInitialRoom());
          setEditingRoom(null);
        }}
        images={currentRoom.images}
        setImages={setImages}
        handleRoomImageUpload={handleRoomImageUpload}
        handleRemoveImage={handleRemoveRoomImage}
        facilityOptions={facilityOptions}
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-[#006989] text-white rounded-lg"
        >
          저장하기
        </button>
        <button
          type="button"
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
    </form>
  );
}
