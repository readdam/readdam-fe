import React, { useEffect, useState } from 'react';
import PlaceInfo from '@components/place/PlaceInfo';
import ReviewSection from '@components/place/ReviewSection';
import ReservationSystem from '@components/place/ReservationSystem';
import { useParams } from 'react-router';
import { useAxios } from '@hooks/useAxios';
import PlaceMapCard from '@components/place/PlaceMapCard';

const PlaceDetail = () => {
  const { id } = useParams(); // placeId
  const [placeData, setPlaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/place/${id}`);
        setPlaceData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('장소 상세 데이터 조회 실패', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!placeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>장소를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex text-sm text-gray-500">
            <a href="/" className="hover:text-[#006989]">
              홈
            </a>
            <span className="mx-2">&gt;</span>
            <a href="/place" className="hover:text-[#006989]">
              장소
            </a>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700">{placeData.name}</span>
          </nav>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PlaceInfo place={placeData} />
            <ReviewSection />
          </div>
          <div className="space-y-8">
            <PlaceMapCard
              name={placeData.name}
              address={placeData.basicAddress}
              detailAddress={placeData.detailAddress}
              lat={placeData.lat}
              lng={placeData.lng}
            />

            <ReservationSystem rooms={placeData.rooms} />
          </div>
        </div>
      </main>
    </div>
  );
};
export default PlaceDetail;
