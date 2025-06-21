import { Trash2, Upload } from 'lucide-react';

export function RoomList({
  rooms,
  handleEditRoom,
  handleDeleteRoom,
  facilityOptions,
}) {
  if (rooms.length === 0) return null;

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
                <p className="text-sm text-gray-600 mb-2">{room.description}</p>
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
