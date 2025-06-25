import { ClockIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTimeRemaining } from '@utils/time';

const TimeRemainingText = ({ endDate, autoUpdate = false }) => {
  const [timeStr, setTimeStr] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    // (!autoUpdate) 다중 카드에서 성능 이슈를 막기 위해 기본적으로 1회 렌더만 수행함
    // autoUpdate === true일 경우에만 1분마다 남은 시간을 갱신함 (ex. 이벤트 상단 등)
    if (!autoUpdate) return; 
    const update = () => setTimeStr(getTimeRemaining(endDate));
    const interval = setInterval(update, 60000);
    update(); // mount 시 바로 계산
    return () => clearInterval(interval); // unmount 시 정리
  }, [endDate, autoUpdate]);

  if (!timeStr) return null;

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <ClockIcon className="w-4 h-4" />
      <span>{timeStr}</span>
    </div>
  );
};

export default TimeRemainingText;
