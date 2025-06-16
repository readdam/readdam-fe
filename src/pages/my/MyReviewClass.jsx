import React from 'react';

const reviews = [
    {
        id: 1,
        title: '심리학 탐구 독서 모임',
        date: '2023.11.20',
        location: '서울 마포구',
        image: '/images/class1.jpg',
        content: '정말 유익한 시간이었습니다. 다양한 관점에서 심리학에 대해 토론할 수 있어서 좋았어요.',
        tags: ['독서모임', '심리'],
        rating: 5,
    },
    {
        id: 2,
        title: '철학 고전 읽기 모임',
        date: '2023.11.15',
        location: '경기 남양주시',
        image: '/images/class2.jpg',
        content: '낯설도 좋고 사람들과 진지하게 즐거운 모임이었습니다. 다음에도 참여하고 싶어요.',
        tags: ['철학', '고전', '인문학'],
        rating: 4,
    },
    {
        id: 3,
        title: '영어 원서 독파 스터디',
        date: '2023.11.10',
        location: '서울 강남구',
        image: '/images/class3.jpg',
        content: '직접 번역하는 스터디라 정말 재미있었어요. 리딩보다 자신감 얻을 수 있을 것 같아요.',
        tags: ['영어', '원서', '스터디'],
        rating: 3,
    },
    {
        id: 4,
        title: '도쿄 <특> 시리즈 완독',
        date: '2023.11.05',
        location: '서울 마포구',
        image: '/images/class4.jpg',
        content: '재밌는 시리즈라 일주일간 몰입해서 보기 좋았어요. 대화식이라 흥미로웠어요.',
        tags: ['SF/고전', '추리', '역사/사회'],
        rating: 4,
    },
];

const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-300'}>
            ★
        </span>
    ));
};

const MyReviewClass = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-6">나의 모임 리뷰</h2>

            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">총 {reviews.length}개의 리뷰</p>
                <button className="text-sm text-gray-500 hover:text-gray-800">최신순으로 정렬</button>
            </div>

            <div className="space-y-4">
                {reviews.map((r) => (
                    <div key={r.id} className="bg-white border rounded-lg p-4 flex items-start shadow-sm hover:shadow-md transition-shadow">
                        <img
                            src={r.image}
                            alt={r.title}
                            className="w-24 h-24 object-cover rounded-md border mr-4"
                        />
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-semibold text-gray-800">{r.title}</h3>
                                <div className="flex flex-wrap gap-1">
                                    {r.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">{r.date} · {r.location}</p>
                            <p className="text-sm text-gray-700">{r.content}</p>
                            <div className="mt-1 text-sm">{renderStars(r.rating)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyReviewClass;
