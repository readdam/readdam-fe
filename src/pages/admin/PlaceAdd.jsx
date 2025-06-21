import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoSection from '@components/admin/place/BasicInfoSection';
import { AvailableTimeSection } from '@components/admin/place/AvailableTimeSection';
import PlaceDetailForm from '@components/admin/place/PlaceDetailForm';
import { RoomList } from '@components/admin/place/RoomList';
import RoomForm from '@components/admin/place/RoomForm';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { url } from '../../config/config';

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
  const [detailAddress, setDetailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [introduceText, setIntroduceText] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

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

  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // ✅ placeDto
    const placeDto = {
      name: placeName,
      location: `${placeAddress} ${detailAddress}`,
      phone: phoneNumber,
      introduce: introduceText,
      tag1: keywords[0] || null,
      tag2: keywords[1] || null,
      tag3: keywords[2] || null,
      tag4: keywords[3] || null,
      tag5: keywords[4] || null,
      tag6: keywords[5] || null,
      tag7: keywords[6] || null,
      tag8: keywords[7] || null,
      tag9: keywords[8] || null,
      tag10: keywords[9] || null,
      lat: lat,
      log: lng,
    };
    formData.append(
      'placeDto',
      new Blob([JSON.stringify(placeDto)], { type: 'application/json' })
    );

    // ✅ roomDtoList
    const roomDtoList = rooms.map((room) => ({
      name: room.name,
      description: room.description,
      size: room.size,
      minPerson: room.minCapacity,
      maxPerson: room.maxCapacity,
      hasAirConditioner: room.facilities.airConditioner,
      hasHeater: room.facilities.heater,
      hasWifi: room.facilities.wifi,
      hasWindow: room.facilities.window,
      hasPowerOutlet: room.facilities.socket,
      hasTv: room.facilities.tv,
      hasProjector: room.facilities.projector,
      hasWhiteboard: room.facilities.whiteboard,
    }));
    formData.append(
      'roomDtoList',
      new Blob([JSON.stringify(roomDtoList)], { type: 'application/json' })
    );

    // ✅ sharedTimeSlots
    const sharedTimeSlots = [
      ...selectedWeekdaySlots.map((time) => ({
        time,
        isWeekend: false,
        active: true,
      })),
      ...selectedWeekendSlots.map((time) => ({
        time,
        isWeekend: true,
        active: true,
      })),
    ];
    formData.append(
      'sharedTimeSlots',
      new Blob([JSON.stringify(sharedTimeSlots)], { type: 'application/json' })
    );

    // ✅ placeImages (imagePreviews → File 변환)
    imagePreviews.forEach((base64, i) => {
      const file = dataURLtoFile(base64, `place_${i}.jpg`);
      formData.append('placeImages', file);
    });

    // ✅ roomImagesMap
    rooms.forEach((room, roomIndex) => {
      room.images.forEach((base64, imageIndex) => {
        const file = dataURLtoFile(
          base64,
          `room_${roomIndex}_${imageIndex}.jpg`
        );
        formData.append(
          'roomImagesMap',
          file,
          `room_${roomIndex}_${imageIndex}.jpg`
        );
      });
    });

    try {
      await axios.post(`${url}/placeAdd`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('장소 등록 완료!');
      navigate('/admin/placeList'); //  일단 목록으로 보냄
    } catch (err) {
      console.error(err);
      alert('등록 실패!');
    }
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
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft
            className="w-6 h-6"
            onClick={() => navigate('/adminPlaceList')}
          />
        </button>
        <h1 className="text-2xl font-bold">새 장소 추가</h1>
      </div>
      <BasicInfoSection
        placeName={placeName}
        setPlaceName={setPlaceName}
        placeAddress={placeAddress}
        setPlaceAddress={setPlaceAddress}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        setLat={setLat}
        setLng={setLng}
        detailAddress={detailAddress}
        setDetailAddress={setDetailAddress}
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
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-6">방 정보</h2>
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
      </section>
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-[#006989] text-white rounded-lg"
          onClick={handleSubmit}
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
    </div>
  );
}
