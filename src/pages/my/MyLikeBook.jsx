import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '모임', path: '/myLikeClass' },
    { label: '장소', path: '/myLikePlace' },
    { label: '글쓰기', path: '/myLikeWrite' },
    { label: '책', path: '/myLikeBook' },
];

const books = [
    {
        id: 1,
        title: '미움받을 용기',
        author: '기시미 이치로',
        publisher: '인플루엔셜',
        image: '/images/book1.jpg',
    },
    {
        id: 2,
        title: '사피엔스',
        author: '유발 하라리',
        publisher: '김영사',
        image: '/images/book2.jpg',
    },
    {
        id: 3,
        title: '어린 왕자',
        author: '생텍쥐페리',
        publisher: '열림원',
        image: '',
    },
    {
        id: 4,
        title: '1984',
        author: '조지 오웰',
        publisher: '민음사',
        image: '/images/book3.jpg',
    },
    {
        id: 5,
        title: '데미안',
        author: '헤르만 헤세',
        publisher: '민음사',
        image: '/images/book4.jpg',
    },
    {
        id: 6,
        title: '아몬드',
        author: '손원평',
        publisher: '창비',
        image: '/images/book5.jpg',
    },
    {
        id: 7,
        title: '이기적 유전자',
        author: '리처드 도킨스',
        publisher: '을유문화사',
        image: '/images/book6.jpg',
    },
    {
        id: 8,
        title: '채식주의자',
        author: '한강',
        publisher: '창비',
        image: '/images/book7.jpg',
    },
    {
        id: 9,
        title: '나미야 잡화점의 기적',
        author: '히가시노 게이고',
        publisher: '현대문학',
        image: '/images/book8.jpg',
    },
];

const MyLikeBook = () => {
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

            {/* Book Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="bg-white border rounded-xl shadow-sm overflow-hidden relative">
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

                        {/* 이미지 영역 */}
                        {book.image ? (
                            <img src={book.image} alt={book.title} className="w-full h-44 object-cover" />
                        ) : (
                            <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                                <div className="w-10 h-14 border-2 rounded-md" />
                            </div>
                        )}

                        {/* 책 정보 */}
                        <div className="p-3">
                            <div className="text-sm font-semibold truncate">{book.title}</div>
                            <div className="text-xs text-gray-500 truncate">
                                {book.author} · {book.publisher}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center mt-10">
                <button className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    더보기
                </button>
            </div>
        </div>
    );
};

export default MyLikeBook;
