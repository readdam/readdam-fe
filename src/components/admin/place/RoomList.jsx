import { Trash2, Upload } from 'lucide-react';
import { url } from '../../../config/config';

export function RoomList({
  rooms,
  handleEditRoom,
  handleDeleteRoom,
  facilityOptions,
}) {
  if (rooms.length === 0) return null;
  const isRawImage = (img) =>
    typeof img === 'string' &&
    (img.startsWith('data:image') ||
      img.startsWith('blob:') ||
      img.startsWith('http'));

  return (
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
              {room.images && room.images.length > 0 ? (
                <img
                  src={
                    isRawImage(room.images[0])
                      ? room.images[0]
                      : `${url}/image?filename=${room.images[0]}`
                  }
                  alt={room.name}
                  className="w-32 h-20 object-cover rounded-md border"
                />
              ) : (
                <div className="w-32 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border">
                  <span className="text-sm">이미지 없음</span>
                </div>
              )}

              <div className="flex-1">
                <h4 className="font-medium mb-2">{room.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{room.introduce}</p>
                <div className="text-sm text-gray-600">
                  <p>크기: {room.size}</p>
                  <p>
                    수용 인원: {room.minPerson}~{room.maxPerson}명
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(room.facilities)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <span
                      key={key}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {facilityOptions[key].emoji} {facilityOptions[key].label}
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
  );
}
