import React, { useState } from "react";

const ReservationSelectModal = ({
  reservations,
  onApply,
  onClose,
  sessionCount,
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const handleCheckboxChange = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else if (selectedIndexes.length < sessionCount) {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleApply = () => {
    const selected = selectedIndexes.map((i) => reservations[i]);
    if (selected.length !== sessionCount) {
      alert(`예약을 ${sessionCount}개 선택해주세요.`);
      return;
    }

    // 첫 번째 예약에서 장소 정보 추출
    const first = selected[0];
    const venueName = first.placeName || "";
    const venueAddress = first.placeAddress || "";
    const lat = first.lat || "";
    const log = first.log || "";

    if (
      !venueName ||
      !venueAddress ||
      !lat ||
      !log ||
      !Array.isArray(first.dates) ||
      first.dates.length === 0
    ) {
      alert("선택한 예약의 장소 정보 또는 날짜가 누락되었습니다.");
      return;
    }

    // 날짜 정렬
    const dates = selected
      .map((r) => r.dates[0])
      .sort((a, b) => new Date(a) - new Date(b));

    // 선택된 reservationId 목록
    const reservationIds = selected.map((r) => r.reservationId);

    // 부모 컴포넌트로 전달
    onApply({
      dates,
      venueName,
      venueAddress,
      lat,
      log,
      reservationIds,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4">
        <h2 className="text-lg font-bold">
          예약 내역 선택 (최대 {sessionCount}개)
        </h2>
        <ul className="space-y-4">
          {reservations.map((res, idx) => (
            <li
              key={idx}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{res.placeName}</p>
                <p className="text-sm text-gray-600">{res.placeAddress}</p>
                <p className="text-sm text-gray-500">{res.dates[0]}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedIndexes.includes(idx)}
                onChange={() => handleCheckboxChange(idx)}
                disabled={
                  !selectedIndexes.includes(idx) &&
                  selectedIndexes.length >= sessionCount
                }
              />
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={selectedIndexes.length !== sessionCount}
            className={`px-4 py-2 rounded text-white ${
              selectedIndexes.length === sessionCount
                ? "bg-[#006989]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSelectModal;
