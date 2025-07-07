import React, { useEffect, useState } from 'react';
import PlaceInfo from '@components/place/PlaceInfo';
import ReviewSection from '@components/place/ReviewSection';
import ReservationSystem from '@components/place/ReservationSystem';
import RelatedGroups from '@components/place/RelatedGroups';
import { useParams } from 'react-router';
import { useAxios } from '@hooks/useAxios';
import PlaceMapCard from '@components/place/PlaceMapCard';
import OtherPlaceInfo from '@components/otherPlace/OtherPlaceInfo';
import OtherPlaceReviewSection from '@components/otherPlace/OtherPlaceReviewSection';

// 임시 데이터
const placeData = {
  id: 1,
  name: '북카페 읽담',
  address: '서울시 강남구 테헤란로 123',
  contact: '02-1234-5678',
  hours: '평일 10:00 - 22:00, 주말 11:00 - 21:00',
  description:
    '책과 함께하는 편안한 시간을 위한 공간, 북카페 읽담입니다. 다양한 장르의 책과 함께 맛있는 커피와 디저트를 즐기실 수 있습니다. 독서모임을 위한 공간 대여도 가능합니다.',
  images: [
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9vayUyMGNhZmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  ],
  tags: ['카페', '북카페', '독서모임', '스터디', '강남'],
  likes: 124,
};
const reviewsData = [
  {
    id: 1,
    userId: 1,
    userName: '책벌레',
    rating: 5,
    content:
      '조용하고 아늑한 분위기가 정말 좋아요. 책을 읽기에 최적의 장소입니다. 커피도 맛있어요!',
    date: '2023-05-15',
  },
  {
    id: 2,
    userId: 2,
    userName: '카페홀릭',
    rating: 4,
    content:
      '책 종류가 다양하고 인테리어가 예뻐요. 다만 주말에는 자리 잡기가 조금 힘들어요.',
    date: '2023-05-10',
  },
  {
    id: 3,
    userId: 3,
    userName: '독서광',
    rating: 5,
    content:
      '독서모임을 위한 공간이 따로 마련되어 있어서 좋아요. 조명도 책 읽기에 딱 좋습니다.',
    date: '2023-05-01',
  },
];
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
// 임시 방 데이터 추가
const roomsData = [
  {
    id: 1,
    name: '조용한 독서룸',
    description:
      '조용하고 아늑한 공간입니다. 독서에 집중하기 좋은 환경을 제공합니다.',
    size: '20평',
    minCapacity: 3,
    maxCapacity: 8,
    image:
      'https://images.unsplash.com/photo-1530538987395-032d1800fdd4?ixlib=rb-4.0.3',
    facilities: {
      airConditioner: true,
      heater: true,
      tv: false,
      whiteboard: true,
      wifi: true,
      projector: false,
      socket: true,
      window: true,
    },
  },
  {
    id: 2,
    name: '밝은 스터디룸',
    description:
      '밝고 넓은 스터디룸입니다. 화이트보드와 프로젝터가 구비되어 있어 그룹 스터디에 적합합니다.',
    size: '30평',
    minCapacity: 4,
    maxCapacity: 10,
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3',
    facilities: {
      airConditioner: true,
      heater: true,
      tv: true,
      whiteboard: true,
      wifi: true,
      projector: true,
      socket: true,
      window: true,
    },
  },
];
// 운영 시간 데이터 추가
const operatingHoursData = {
  weekday: {
    start: '09:00',
    end: '22:00',
    slots: [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
    ],
  },
  weekend: {
    start: '10:00',
    end: '20:00',
    slots: [
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ],
  },
};
const OtherPlaceDetail = () => {
  const { id } = useParams(); // placeId
  const [placeData, setPlaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 실제 로그인 상태 연동 필요
  const axios = useAxios();

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/otherPlace/${id}`);
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
            <OtherPlaceInfo place={placeData} />
            <OtherPlaceReviewSection
              placeId={placeData.id}
              initialReviews={reviewsData}
              isLoggedIn={isLoggedIn}
            />
          </div>
          <div className="space-y-8">
            <PlaceMapCard
              name={placeData.name}
              address={placeData.basicAddress}
              detailAddress={placeData.detailAddress}
              lat={placeData.lat}
              lng={placeData.lng}
            />
            {/* <ReservationSystem
              placeId={placeData.id}
              isLoggedIn={isLoggedIn}
              rooms={placeData.rooms}
              operatingHours={operatingHoursData}
            />
            <RelatedGroups tags={placeData.tags} groups={groupsData} /> */}
          </div>
        </div>
      </main>
    </div>
  );
};
export default OtherPlaceDetail;
