import React, { useEffect, useState } from 'react';
import PlaceInfo from '@components/place/PlaceInfo';
import ReviewSection from '@components/place/ReviewSection';
import ReservationSystem from '@components/place/ReservationSystem';
import RelatedGroups from '@components/place/RelatedGroups';
import { useParams } from 'react-router';
import { useAxios } from '@hooks/useAxios';
import PlaceMapCard from '@components/place/PlaceMapCard';

// 임시 데이터
const groupsData = [
  {
    id: 1,
    title: '주말 소설 읽기 모임',
    description:
      '매주 토요일 오후, 다양한 소설을 함께 읽고 이야기 나누는 모임입니다.',
    date: '매주 토요일 14:00',
    members: 8,
    maxMembers: 10,
    tags: ['소설', '주말', '북카페'],
    image:
      'https://images.unsplash.com/photo-1530538987395-032d1800fdd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9vayUyMGNsdWJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    title: '비즈니스 도서 스터디',
    description:
      '경영, 마케팅, 자기계발 관련 도서를 함께 읽고 토론하는 모임입니다.',
    date: '매주 수요일 19:00',
    members: 5,
    maxMembers: 8,
    tags: ['비즈니스', '자기계발', '스터디'],
    image:
      'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
];

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
            <a href="#" className="hover:text-[#006989]">
              홈
            </a>
            <span className="mx-2">&gt;</span>
            <a href="#" className="hover:text-[#006989]">
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
            {/* <RelatedGroups tags={placeData.tags} groups={groupsData} /> */}
          </div>
        </div>
      </main>
    </div>
  );
};
export default PlaceDetail;
