import { useRef } from 'react';

export function AvailableTimeSection({
  selectedWeekdaySlots,
  setSelectedWeekdaySlots,
  selectedWeekendSlots,
  setSelectedWeekendSlots,
}) {
  const generateTimeSlots = () =>
    Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const weekdaySlots = generateTimeSlots();
  const weekendSlots = generateTimeSlots();

  const lastSelectedSlotRef = useRef({ weekday: null, weekend: null });

  const handleTimeSelection = (time, type) => {
    const slots = type === 'weekday' ? weekdaySlots : weekendSlots;
    const selectedSlots =
      type === 'weekday' ? selectedWeekdaySlots : selectedWeekendSlots;
    const setSelectedSlots =
      type === 'weekday' ? setSelectedWeekdaySlots : setSelectedWeekendSlots;
    const lastSlot = lastSelectedSlotRef.current[type];

    const slotIndex = slots.indexOf(time);

    if (window.event.shiftKey && lastSlot !== null) {
      const lastIndex = slots.indexOf(lastSlot);
      const [start, end] = [
        Math.min(lastIndex, slotIndex),
        Math.max(lastIndex, slotIndex),
      ];
      const newRange = slots.slice(start, end + 1);
      const allSelected = newRange.every((s) => selectedSlots.includes(s));
      setSelectedSlots(
        allSelected
          ? selectedSlots.filter((s) => !newRange.includes(s))
          : [...new Set([...selectedSlots, ...newRange])]
      );
    } else {
      setSelectedSlots(
        selectedSlots.includes(time)
          ? selectedSlots.filter((t) => t !== time)
          : [...selectedSlots, time]
      );
      lastSelectedSlotRef.current[type] = time;
    }
  };

  const toggleAllSlots = (type) => {
    const slots = type === 'weekday' ? weekdaySlots : weekendSlots;
    const state =
      type === 'weekday' ? selectedWeekdaySlots : selectedWeekendSlots;
    const setState =
      type === 'weekday' ? setSelectedWeekdaySlots : setSelectedWeekendSlots;
    setState(state.length === slots.length ? [] : slots);
  };

  const renderButtons = (slots, type, selectedSlots) => (
    <div className="grid grid-cols-6 gap-2">
      {slots.map((slot) => (
        <button
          key={`${type}-${slot}`}
          type="button"
          onClick={() => handleTimeSelection(slot, type)}
          className={`py-2 rounded-md text-sm font-medium border transition cursor-pointer ${
            selectedSlots.includes(slot)
              ? 'bg-[#006989] text-white border-[#006989]'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-6">예약 가능 시간대</h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">평일</h3>
          <button
            type="button"
            onClick={() => toggleAllSlots('weekday')}
            className="flex items-center gap-1 text-sm bg-[#006989] text-white px-3 py-1 rounded hover:bg-[#005c78] transition cursor-pointer"
          >
            {selectedWeekdaySlots.length === weekdaySlots.length
              ? '모두 해제'
              : '모두 선택'}
          </button>
        </div>
        {renderButtons(weekdaySlots, 'weekday', selectedWeekdaySlots)}
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">주말</h3>
          <button
            type="button"
            onClick={() => toggleAllSlots('weekend')}
            className="flex items-center gap-1 text-sm bg-[#006989] text-white px-3 py-1 rounded hover:bg-[#005c78] transition cursor-pointer"
          >
            {selectedWeekendSlots.length === weekendSlots.length
              ? '모두 해제'
              : '모두 선택'}
          </button>
        </div>
        {renderButtons(weekendSlots, 'weekend', selectedWeekendSlots)}
      </div>
    </section>
  );
}
