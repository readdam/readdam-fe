// src/utils/time.js (잔여시간 재사용 용도)
export const getTimeRemaining = (endDate) => {
  if (!endDate) return null;

  const now = new Date();
  const end = new Date(endDate); // 문자열이든 Date든 자동 파싱
  const diffMs = end - now;

  if (diffMs <= 0) return null;

  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `${days}일 ${hours}시간 ${minutes}분`;
};
