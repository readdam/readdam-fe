import { Plus, Upload, X } from 'lucide-react';
import { url } from '../../../config/config';

export default function RoomForm({
  currentRoom,
  setCurrentRoom,
  editingRoom,
  handleAddRoom,
  handleCancelEdit,
  images,
  handleRoomImageUpload,
  handleRemoveImage,
  facilityOptions,
}) {
  const isRawImage = (img) =>
    typeof img === 'string' &&
    (img.startsWith('data:image') ||
      img.startsWith('blob:') ||
      img.startsWith('http'));
  // console.log(currentRoom);
  return (
    <div className="space-y-6">
      <h3 className="font-medium text-gray-700">
        {editingRoom ? '방 정보 수정' : '새 방 추가'}
      </h3>
      <div className="space-y-6">
        {/* 방 사진 */}
        <div>
          <label className="block text-sm font-medium mb-2">방 사진</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={
                    isRawImage(image) ? image : `${url}/image?filename=${image}`
                  }
                  // src={
                  //   window.location.pathname.includes('/admin/placeAdd')
                  //     ? image
                  //     : `${url}/image?filename=${image}`
                  // }
                  // src={`${url}/image?filename=${image}`}
                  alt={`공간 사진 ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#006989]">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">사진 업로드</span>
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
            최대 10장까지 업로드 가능합니다
          </p>
        </div>

        {/* 방 이름 */}
        <div>
          <label className="block text-sm font-medium mb-2">방 이름</label>
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

        {/* 방 설명 */}
        <div>
          <label className="block text-sm font-medium mb-2">방 설명</label>
          <textarea
            value={currentRoom.introduce}
            onChange={(e) =>
              setCurrentRoom({
                ...currentRoom,
                introduce: e.target.value,
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            rows={4}
            placeholder="방의 특징과 구비된 물품 등을 자세히 설명해주세요"
          />
        </div>

        {/* 방 크기 */}
        <div>
          <label className="block text-sm font-medium mb-2">방 크기</label>
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

        {/* 수용 인원 */}
        <div>
          <label className="block text-sm font-medium mb-2">수용 인원</label>
          <div className="flex items-center gap-4">
            {/* 최소 인원 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">최소</span>
              <select
                value={currentRoom.minPerson}
                onChange={(e) =>
                  setCurrentRoom({
                    ...currentRoom,
                    minPerson: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
              >
                {Array.from({ length: 8 }, (_, i) => i + 3).map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>

            {/* 최대 인원 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">최대</span>
              <select
                value={currentRoom.maxPerson}
                onChange={(e) =>
                  setCurrentRoom({
                    ...currentRoom,
                    maxPerson: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
              >
                {Array.from({ length: 8 }, (_, i) => i + 3).map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 시설 정보 */}
        <div>
          <label className="block text-sm font-medium mb-2">시설 정보</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(facilityOptions).map(([key, { label, emoji }]) => (
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
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddRoom}
            className="flex-1 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            {editingRoom ? '수정 완료' : '방 추가하기'}
          </button>
          {editingRoom && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              수정 취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
