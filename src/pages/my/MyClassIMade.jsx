import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '참여 중인 모임', path: '/myClassContinue' },
    { label: '참여가 종료된 모임', path: '/myClassEnd' },
    { label: '내가 개설한 모임', path: '/myClassIMade' },
];

const ongoingClasses = [
    {
        id: 1,
        category: '에세이',
        title: '에세이로 만나는 일상의 소소함',
        date: '2023.11.15',
        location: '서울 강남구',
        participants: '8/10 명',
        image: '/images/class1.jpg',
    },
];

const MyClassContinue = () => {
    const location = useLocation();

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">나의 모임</h2>

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

            {/* 모임 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {ongoingClasses.map((cls) => (
                    <div key={cls.id} className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow">
                        <img src={cls.image} alt={cls.title} className="w-full h-44 object-cover" />
                        <div className="p-4 space-y-2">
                            <div className="text-xs inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                {cls.category}
                            </div>
                            <div className="text-sm font-semibold">{cls.title}</div>
                            <div className="text-sm text-gray-500">📅 {cls.date}</div>
                            <div className="text-sm text-gray-500">📍 {cls.location}</div>
                            <div className="text-sm text-gray-500">👥 {cls.participants}</div>
                            <button className="mt-2 w-full bg-teal-700 hover:bg-teal-800 text-white text-sm py-2 rounded-md flex items-center justify-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                보러가기
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyClassContinue;
