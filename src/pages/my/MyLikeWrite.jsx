import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '모임', path: '/myLikeClass' },
    { label: '장소', path: '/myLikePlace' },
    { label: '글쓰기', path: '/myLikeWrite' },
    { label: '책', path: '/myLikeBook' },
];

const posts = [
    {
        id: 1,
        type: '독후감',
        title: '미움받을 용기를 읽고 나서: 아들러 심리학의 통찰',
        author: 'reader123',
        image: '/images/post1.jpg',
        likes: 24,
        comments: 12,
        views: 156,
    },
    {
        id: 2,
        type: '자기소개서',
        title: '2024 교육대학원 지원 자기소개서',
        author: 'future_teacher',
        image: '',
        likes: 15,
        comments: 8,
        views: 98,
    },
    {
        id: 3,
        type: '수필',
        title: '늦은 밤 카페에서: 일상의 작은 위로',
        author: 'essay_writer',
        image: '/images/post2.jpg',
        likes: 45,
        comments: 23,
        views: 234,
    },
    {
        id: 4,
        type: '독후감',
        title: '사피엔스: 인류의 역사를 관통하는 대서사',
        author: 'history_buff',
        image: '/images/post3.jpg',
        likes: 67,
        comments: 31,
        views: 445,
    },
];

const MyLikeWrite = () => {
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

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow">
                        {/* 이미지 영역 */}
                        {post.image ? (
                            <img src={post.image} alt={post.title} className="w-full h-44 object-cover" />
                        ) : (
                            <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                                <div className="w-10 h-14 border-2 rounded-md" />
                            </div>
                        )}
                        <div className="p-4 space-y-2">
                            <div className="text-xs inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                {post.type}
                            </div>
                            <h3 className="text-sm font-semibold leading-snug">{post.title}</h3>
                            <p className="text-sm text-blue-500">{post.author}</p>
                            <div className="flex items-center space-x-4 text-gray-500 text-sm mt-2">
                                <div className="flex items-center space-x-1">
                                    <span>❤️</span>
                                    <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span>💬</span>
                                    <span>{post.comments}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span>👁</span>
                                    <span>{post.views}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-10">
                <button className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    더보기
                </button>
            </div>
        </div>
    );
};

export default MyLikeWrite;
