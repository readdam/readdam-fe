import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '참여 중인 모임', path: '/myClassContinue' },
    { label: '참여가 종료된 모임', path: '/myClassEnd' },
    { label: '내가 개설한 모임', path: '/myClassIMade' },
];

const endedClasses = [
    {
        id: 1,
        category: '심리',
        title: '심리학 명저 함께 읽기',
        date: '2023.11.20',
        location: '서울 마포구',
        image: '/images/class2.jpg',
    },
    {
        id: 2,
        category: '자기계발',
        title: '자기계발 북클럽',
        date: '2023.11.25',
        location: '서울 서초구',
        image: '/images/class3.jpg',
    },
    {
        id: 3,
        category: '문학',
        title: '고전문학 깊게 읽기',
        date: '2023.12.01',
        location: '서울 종로구',
        image: '/images/class4.jpg',
    },
];

const MyClassEnd = () => {
    const location = useLocation();

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">나의 모임</h2>

            {/* 탭 */}
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

            {/* 카드 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {endedClasses.map((cls) => (
                    <div
                        key={cls.id}
                        className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow"
                    >
                        <img src={cls.image} alt={cls.title} className="w-full h-44 object-cover" />
                        <div className="p-4 space-y-2">
                            <div className="text-xs inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                {cls.category}
                            </div>
                            <div className="text-sm font-semibold">{cls.title}</div>
                            <div className="text-sm text-gray-500">📅 {cls.date}</div>
                            <div className="text-sm text-gray-500">📍 {cls.location}</div>

                            {/* 버튼 그룹 */}
                            <div className="flex space-x-2 mt-3">
                                <button className="flex-1 bg-teal-700 hover:bg-teal-800 text-white text-sm py-2 rounded-md flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    보러가기
                                </button>
                                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 rounded-md flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    후기 등록
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyClassEnd;
