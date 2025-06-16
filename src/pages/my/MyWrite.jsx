import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '내가 작성한 글', path: '/myWrite' },
    { label: '작성한 첨삭', path: '/myWriteComment' },
    { label: '읽담 한줄', path: '/myWriteShort' },
];

const posts = [
    {
        id: 1,
        category: '수필',
        correctionStatus: '첨삭가능',
        title: '늦은 밤 카페에서: 일상의 작은 위로',
        author: 'essay_writer',
        date: '2023-11-08',
        timeAgo: '6일 12시간',
        image: '/images/write1.jpg',
        likes: 45,
        comments: 23,
        views: 234,
    },
    {
        id: 2,
        category: '독후감',
        correctionStatus: '첨삭진행중',
        title: '사피엔스: 인류의 역사를 관통하는 서',
        author: 'history_buff',
        date: '2023-11-07',
        timeAgo: '1일 8시간',
        image: '/images/write2.jpg',
        likes: 67,
        comments: 31,
        views: 445,
    },
];

const MyWrite = () => {
    const location = useLocation();

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">나의 글쓰기</h2>

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

            {/* 카드 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="flex bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* 이미지 */}
                        <img src={post.image} alt={post.title} className="w-36 h-36 object-cover" />

                        {/* 내용 */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            {/* 뱃지 */}
                            <div className="flex space-x-2 mb-1">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                    {post.category}
                                </span>
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                    {post.correctionStatus}
                                </span>
                            </div>

                            {/* 제목 */}
                            <h3 className="text-sm font-semibold line-clamp-1">{post.title}</h3>

                            {/* 작성자 정보 */}
                            <div className="text-sm text-gray-600">
                                <span className="text-blue-500 font-medium">{post.author}</span> · {post.date}
                            </div>

                            {/* 하단 정보 */}
                            <div className="flex justify-between items-end text-xs text-gray-500 mt-2">
                                <div className="flex space-x-4">
                                    <span>❤️ {post.likes}</span>
                                    <span>💬 {post.comments}</span>
                                    <span>👁 {post.views}</span>
                                </div>
                                <div>{post.timeAgo}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyWrite;
