import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BasicInfoSection from '@components/admin/place/BasicInfoSection';
import { AvailableTimeSection } from '@components/admin/place/AvailableTimeSection';
import PlaceDetailForm from '@components/admin/place/PlaceDetailForm';
import { RoomList } from '@components/admin/place/RoomList';
import RoomForm from '@components/admin/place/RoomForm';
import { ArrowLeft } from 'lucide-react';
import { getPlace, updatePlace } from '@api/place';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const facilityOptions = {
  airConditioner: { label: '에어컨', emoji: '❄️' },
  heater: { label: '난방', emoji: '🔥' },
  tv: { label: 'TV', emoji: '📺' },
  whiteboard: { label: '화이트보드', emoji: '📋' },
  wifi: { label: '와이파이', emoji: '📶' },
  projector: { label: '프로젝터', emoji: '📽️' },
  powerOutlet: { label: '콘센트', emoji: '🔌' },
  window: { label: '창문', emoji: '🪟' },
};

export default function PlaceEdit() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const [place, setPlace] = useState(null);

  const token = useAtomValue(tokenAtom); // localStorage 등에서 가져오는 방식에 맞게 구현 필요
  useEffect(() => {
    getPlace(token, placeId)
      .then((data) => {
        setPlace(data);

        setPlaceName(data.name);
        setPlaceAddress(data.basicAddress || '');
        setDetailAddress(data.detailAddress || '');
        setPhoneNumber(data.phone);
        setIntroduceText(data.introduce);
        setLat(data.lat);
        setLng(data.lng);

        setKeywords(data.tags || []);
        setImagePreviews(data.images || []);
        setSelectedWeekdaySlots(data.weekdayTimes || []);
        setSelectedWeekendSlots(data.weekendTimes || []);

        if (data.rooms && Array.isArray(data.rooms)) {
          const parsedRooms = data.rooms.map((room) => ({
            id: room.roomId,
            name: room.name,
            introduce: room.introduce,
            size: room.size,
            minPerson: room.minPerson,
            maxPerson: room.maxPerson,
            images: room.images || [],
            facilities: {
              airConditioner: room.facilities?.airConditioner ?? false,
              heater: room.facilities?.heater ?? false,
              wifi: room.facilities?.wifi ?? false,
              window: room.facilities?.window ?? false,
              powerOutlet: room.facilities?.powerOutlet ?? false, // ✅ 여기 주의
              whiteboard: room.facilities?.whiteboard ?? false,
              tv: room.facilities?.tv ?? false,
              projector: room.facilities?.projector ?? false,
            },
          }));

          setRooms(parsedRooms);
        }
      })
      .catch((err) => {
        console.error('장소 상세 조회 실패:', err);
      });
  }, [placeId]);

  // 장소 정보
  const [placeName, setPlaceName] = useState('');
  const [placeAddress, setPlaceAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [introduceText, setIntroduceText] = useState('');
  const [keywords, setKeywords] = useState([]);
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
      introduce: '',
      size: '',
      minPerson: 3,
      maxPerson: 5,
      images: [],
      facilities: Object.fromEntries(
        Object.keys(facilityOptions).map((key) => [key, false])
      ),
    };
  }

  const handleAddRoom = () => {
    const { name, introduce, size, minPerson, maxPerson, facilities } =
      currentRoom;

    if (!name || !name.trim()) return alert('방 이름을 입력하세요.');
    if (!introduce || !introduce.trim()) return alert('방 소개를 입력하세요.');
    if (!size || !size.trim()) return alert('방 크기를 입력하세요.');
    if (!minPerson || !maxPerson || minPerson <= 0 || maxPerson <= 0)
      return alert('최소/최대 인원을 올바르게 입력하세요.');
    if (minPerson > maxPerson)
      return alert('최대 인원은 최소 인원보다 같거나 커야 합니다.');
    if (images.length === 0) return alert('방 사진을 1장 이상 등록하세요.');

    // ✅ 기존 이미지 경로와 새 이미지 분리
    const existingImageNames = images.filter(
      (img) =>
        typeof img === 'string' &&
        !img.startsWith('blob:') &&
        !img.startsWith('data:')
    );

    const newImageFiles = images.filter(
      (img) => typeof img === 'string' && img.startsWith('data:image/')
    );

    const newRoom = {
      id: editingRoom?.id ?? null,
      name,
      introduce,
      size,
      minPerson,
      maxPerson,
      facilities,
      images: [...existingImageNames, ...newImageFiles], // 이미지 전체 저장
    };

    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? newRoom : r)));
      setEditingRoom(null);
    } else {
      setRooms([...rooms, newRoom]);
    }

    setCurrentRoom(createInitialRoom());
    setImages([]);
  };

  const handleEditRoom = (room) => {
    const filledFacilities = Object.fromEntries(
      Object.keys(facilityOptions).map((key) => [
        key,
        room.facilities?.[key] ?? false,
      ])
    );

    setCurrentRoom({
      id: room.roomId ?? Date.now(),
      name: room.name ?? '',
      introduce: room.introduce ?? '',
      size: room.size ?? '',
      minPerson: room.minPerson ?? 3,
      maxPerson: room.maxPerson ?? 5,
      images: room.images ?? [],
      facilities: filledFacilities,
    });
    setEditingRoom(room);
    setImages(room.images || []);
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter((r) => r.id !== roomId));
  };

  function dataURLtoFile(dataurl, filename) {
    if (!dataurl || typeof dataurl !== 'string') return null;
    if (!dataurl.startsWith('data:image/')) return null;

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

    if (!placeName.trim()) return alert('장소명을 입력해주세요.');
    if (!placeAddress.trim()) return alert('주소를 입력해주세요.');
    if (!detailAddress.trim()) return alert('상세 주소를 입력해주세요.');
    if (!phoneNumber.trim()) return alert('전화번호를 입력해주세요.');
    if (!introduceText.trim()) return alert('소개글을 입력해주세요.');
    if (lat == null || lng == null)
      return alert('지도에서 위치를 선택해주세요.');
    if (keywords.length === 0 || keywords.some((k) => !k.trim()))
      return alert('태그(키워드)를 최소 1개 이상 입력해주세요.');
    if (imagePreviews.length === 0)
      return alert('장소 사진을 1장 이상 등록해주세요.');
    if (rooms.length === 0) return alert('방을 최소 1개 이상 등록해주세요.');

    for (const room of rooms) {
      if (!room.name.trim()) return alert('방 이름을 입력해주세요.');
      if (!room.size.trim()) return alert('방 크기를 입력해주세요.');
      if (!room.minPerson || !room.maxPerson)
        return alert('방 최소/최대 인원을 입력해주세요.');
      if (room.minPerson > room.maxPerson)
        return alert('방 최대 인원은 최소 인원보다 같거나 커야 합니다.');
      if (!room.images || room.images.length === 0)
        return alert(`"${room.name}" 방에 사진을 1장 이상 등록해주세요.`);
    }

    const formData = new FormData();

    // 📌 placeDto
    const placeDto = {
      name: placeName,
      basicAddress: placeAddress,
      detailAddress: detailAddress,
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
      lat,
      lng: lng,
    };
    formData.append(
      'placeDto',
      new Blob([JSON.stringify(placeDto)], { type: 'application/json' })
    );

    // 📌 roomDtoList
    const roomDtoList = rooms.map((room) => {
      const isNew = typeof room.id === 'string' && room.id.startsWith('new_');
      return {
        placeRoomId: isNew ? null : room.id,
        name: room.name,
        introduce: room.introduce,
        size: room.size,
        minPerson: room.minPerson,
        maxPerson: room.maxPerson,
        hasAirConditioner: !!room.facilities.airConditioner,
        hasHeater: !!room.facilities.heater,
        hasWifi: !!room.facilities.wifi,
        hasWindow: !!room.facilities.window,
        hasPowerOutlet: !!room.facilities.powerOutlet,
        hasTv: !!room.facilities.tv,
        hasProjector: !!room.facilities.projector,
        hasWhiteboard: !!room.facilities.whiteboard,
      };
    });
    formData.append(
      'roomDtoList',
      new Blob([JSON.stringify(roomDtoList)], { type: 'application/json' })
    );

    // 📌 sharedTimeSlots
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

    // 📌 placeImages: 신규
    imagePreviews.forEach((img, i) => {
      if (typeof img === 'string' && img.startsWith('data:image/')) {
        const file = dataURLtoFile(img, `place_${i}.jpg`);
        if (file) formData.append('placeImages', file);
      }
    });

    // 📌 placeImages: 기존
    const existingPlaceImages = imagePreviews.filter(
      (img) => typeof img === 'string' && !img.startsWith('data:image/')
    );
    formData.append(
      'existingPlaceImages',
      new Blob([JSON.stringify(existingPlaceImages)], {
        type: 'application/json',
      })
    );

    // 🔹 새 이미지 업로드
    rooms.forEach((room, i) => {
      room.images.forEach((img, index) => {
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          const file = dataURLtoFile(img, `room_${i}_${index}.jpg`);
          formData.append('roomImagesMap', file, `room_${i}_${index}.jpg`);
        }
      });
    });

    // 🔹 기존 이미지 유지
    const existingRoomImages = [];
    rooms.forEach((room, i) => {
      room.images.forEach((img) => {
        if (typeof img === 'string' && !img.startsWith('data:image/')) {
          existingRoomImages.push(`${i}|${img}`);
        }
      });
    });

    formData.append(
      'existingRoomImages',
      new Blob([JSON.stringify(existingRoomImages)], {
        type: 'application/json',
      })
    );

    try {
      console.log('🟡 updatePlace 호출');
      await updatePlace(token, placeId, formData);
      console.log('🟢 updatePlace 성공');
    } catch (err) {
      console.error('🔴 updatePlace 실패', err);

      if (err.response) {
        const { status, data } = err.response;
        if (status === 409 && data?.error === 'room_has_reservation') {
          alert(data.message || '해당 방에 예약이 있어 삭제할 수 없습니다.');
          return;
        }

        alert(data.message || '요청 처리 중 오류가 발생했습니다.');
        return;
      } else {
        alert(err?.message || '서버에 연결할 수 없습니다.');
        return;
      }
    }

    // 이 부분은 성공했을 때만 실행됩니다.

    alert('장소 수정 완료!');
    navigate('/admin/placeList');
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
    const filesToAdd = files.slice(0, allowedCount);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;

        // 기존 이미지 + 새 이미지 유지
        setCurrentRoom((prev) => ({
          ...prev,
          images: [...(prev.images || []), base64],
        }));

        // UI용 이미지 프리뷰도 갱신
        setImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveRoomImage = (index) => {
    const updatedImages = currentRoom.images.filter((_, i) => i !== index);

    setCurrentRoom((prevRoom) => ({
      ...prevRoom,
      images: updatedImages,
    }));

    setImages(updatedImages); // UI 이미지 프리뷰 반영

    // ✅ 현재 방이 rooms에 존재한다면, 그 방의 images도 갱신
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === currentRoom.id ? { ...room, images: updatedImages } : room
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft
              className="w-6 h-6"
              onClick={() => navigate('/admin/placeList')}
            />
          </button>
          <h1 className="text-2xl font-bold">장소 수정</h1>
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
          lat={lat}
          lng={lng}
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
            type="button"
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
    </div>
  );
}
