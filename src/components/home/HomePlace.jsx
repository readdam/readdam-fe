import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import PlaceCard from '@components/place/PlaceCard';

const HomePlace = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAtom(userAtom); // 사용자 위치(lat/lng) 접근용

  // ✅ 기본 최신순 장소 불러오기 (4개만)
  useEffect(() => {
    const fetchLatestPlaces = async () => {
      try {
        const res = await fetch('/api/places?sort=latest&limit=4');
        if (!res.ok) throw new Error('요청 실패');
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error('장소 불러오기 실패:', err);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPlaces();
  }, []);

  // ✅ userAtom에 저장된 위치 기반 정렬 (Header → user.lat/lng 갱신된 경우)
  useEffect(() => {
    const isLocationValid = user?.lat !== 0 && user?.lng !== 0;
    if (!isLocationValid) return;

    const fetchLocationBasedPlaces = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/places?sort=location&lat=${user.lat}&lng=${user.lng}&limit=4`
        );
        if (!res.ok) throw new Error('위치 기반 요청 실패');
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error('위치 기반 장소 불러오기 실패:', err);
        // 실패해도 fallback은 필요 없음 (기존 목록 유지)
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationBasedPlaces();
  }, [user.lat, user.lng]);

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {user?.lat && user?.lng ? '내 근처 추천 장소' : '최근 등록된 장소'}
          </h2>
        </div>

        {isLoading ? (
          <p className="text-gray-500">불러오는 중...</p>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">등록된 장소가 없습니다.</div>
        )}
      </div>
    </section>
  );
};

export default HomePlace;
