import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '모임', path: '/myLikeClass' },
    { label: '장소', path: '/myLikePlace' },
    { label: '글쓰기', path: '/myLikeWrite' },
    { label: '책', path: '/myLikeBook' },
];

const meetings = [
    {
        id: 1,
        title: '에세이로 만나는 일상의 소',
        date: '2023.11.15',
        location: '서울 강남구',
        participants: '8/10명',
        tags: ['정기모임', '도서관'],
        image: '/images/meeting1.jpg',
    },
    {
        id: 2,
        title: '심리학 명저 함께 읽기',
        date: '2023.11.20',
        location: '서울 마포구',
        participants: '5/8명',
        tags: ['정기모임', '도서관'],
        image: '/images/meeting2.jpg',
    },
    {
        id: 3,
        title: '자기계발 북클럽',
        date: '2023.11.25',
        location: '서울 서초구',
        participants: '6/10명',
        tags: [],
        image: '/images/meeting3.jpg',
    },
    {
        id: 4,
        title: '고전 문학 함께 읽기',
        date: '2023.12.01',
        location: '서울 종로구',
        participants: '4/8명',
        tags: [],
        image: '/images/meeting4.jpg',
    },
];

const HomePage = () => {
    const location = useLocation();

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">좋아요</h2>

            {/* Tabs */}
            <div className="flex space-x-6 border-b mb-8">
                {tabs.map((tab) => (
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

            {/* Meeting Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {meetings.map((meeting) => (
                    <div
                        key={meeting.id}
                        className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow"
                    >
                        <img
                            src={meeting.image}
                            alt={meeting.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 space-y-1">
                            <div className="font-semibold text-sm">{meeting.title}</div>

                            {meeting.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {meeting.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="text-sm text-gray-500 mt-2">
                                📅 {meeting.date}
                            </div>
                            <div className="text-sm text-gray-500">📍 {meeting.location}</div>
                            <div className="text-sm text-gray-500">👥 {meeting.participants}</div>
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

export default HomePage;
