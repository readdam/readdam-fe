import React from 'react';

const reviews = [
    {
        id: 1,
        title: '심리학 책',
        date: '2023.11.20',
        content: '정말 유익한 시간이었습니다. 다양한 관점에서 심리학에 대해 토론할 수 있어서 좋았어요.',
        image: '/images/book1.jpg',
        rating: 5,
    },
    {
        id: 2,
        title: '철학 고전 책',
        date: '2023.11.15',
        content: '낯설도 좋고 사람들과 진지해서 즐겁고 유의미했습니다. 다음에도 참여하고 싶어요.',
        image: '/images/book2.jpg',
        rating: 4,
    },
    {
        id: 3,
        title: '영어 원서',
        date: '2023.11.10',
        content: '직접 번역하는 스터디로 정말 재미있었어요. 리딩보다 자신감 얻을 수 있을 것 같습니다.',
        image: '/images/book3.jpg',
        rating: 3,
    },
    {
        id: 4,
        title: '책 이름',
        date: '2023.11.05',
        content: '세계관은 차갑고 임팩트에서 호불호가 갈릴 수 있겠네요. 대화식으로 흥미로웠어요.',
        image: '/images/book4.jpg',
        rating: 2,
    },
];

const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={i <= count ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        );
    }
    return stars;
};

const MyReviewBook = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-6">나의 책 후기</h2>

            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">총 {reviews.length}개의 리뷰</p>
                <button className="text-sm text-gray-500 hover:text-gray-800">최신순으로 정렬</button>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white border rounded-lg p-4 flex items-start shadow-sm hover:shadow-md transition-shadow"
                    >
                        <img
                            src={review.image}
                            alt={review.title}
                            className="w-20 h-28 object-cover rounded-md mr-4 border"
                        />
                        <div className="flex-1 space-y-1">
                            <h3 className="text-sm font-semibold text-gray-800">{review.title}</h3>
                            <p className="text-xs text-gray-500">{review.date}</p>
                            <p className="text-sm text-gray-700 leading-snug mt-1">{review.content}</p>
                            <div className="mt-2 text-sm">{renderStars(review.rating)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyReviewBook;
