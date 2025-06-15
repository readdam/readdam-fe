import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '모임', path: '/myLikeClass' },
    { label: '장소', path: '/myLikePlace' },
    { label: '글쓰기', path: '/myLikeWrite' },
    { label: '책', path: '/myLikeBook' },
];

const places = [
    {
        id: 1,
        category: '북카페',
        name: '북카페 리드미',
        address: '서울 마포구 연남동 -4',
        image: '/images/place1.jpg',
    },
    {
        id: 2,
        category: '서점',
        name: '책방 오후',
        address: '서울 서초구 방배동 9-1',
        image: '/images/place2.jpg',
    },
    {
        id: 3,
        category: '스터디룸',
        name: '스터디룸 페이지',
        address: '서울 강남구 역삼동 6-7',
        image: '/images/place3.jpg',
    },
    {
        id: 4,
        category: '북카페',
        name: '독서당',
        address: '서울 서대문구 연희동',
        image: '',
    },
    {
        id: 5,
        category: '도서관',
        name: '지혜의 숲',
        address: '서울 종로구 삼청동 -4',
        image: '',
    },
    {
        id: 6,
        category: '북카페',
        name: '카페 북스테이',
        address: '서울 용산구 이태원동',
        image: '/images/place6.jpg',
    },
    {
        id: 7,
        category: '스터디카페',
        name: '스터디카페 집중',
        address: '서울 송파구 잠실동 4-',
        image: '/images/place7.jpg',
    },
    {
        id: 8,
        category: '도서관',
        name: '책 읽는 공간',
        address: '서울 영등포구 문산동',
        image: '/images/place8.jpg',
    },
];

const MyLikePlace = () => {
    const location = useLocation();

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">좋아요</h2>

            {/* Tabs */}
            <div className="flex space-x-6 border-b mb-8">
                {tabs.map(tab => (
                    <Link
                        key={tab.label}
                        to={tab.path}
                        className={`pb-2 transition-all ${location.pathname === tab.path
                                ? 'text-black border-b-2 border-blue-500 font-semibold'
                                : 'text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Place Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {places.map(place => (
                    <div
                        key={place.id}
                        className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow relative"
                    >
                        {/* 하트 아이콘 */}
                        <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                            <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                3.57 2.36h1.87C13.46 5.99 14.96 
                5 16.5 5 18.5 5 20 6.5 20 
                8.5c0 3.78-3.4 6.86-8.55 
                11.54L12 21.35z" />
                            </svg>
                        </button>

                        {/* 이미지 */}
                        {place.image ? (
                            <img src={place.image} alt={place.name} className="w-full h-40 object-cover" />
                        ) : (
                            <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                <div className="w-10 h-14 border-2 rounded-md" />
                            </div>
                        )}

                        {/* 정보 */}
                        <div className="p-3 space-y-1">
                            <div className="text-xs inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                {place.category}
                            </div>
                            <div className="font-semibold text-sm">{place.name}</div>
                            <div className="text-sm text-gray-500">{place.address}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-10">
                <button className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    더보기
                </button>
            </div>
        </div>
    );
};

export default MyLikePlace;
