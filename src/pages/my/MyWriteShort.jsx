import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '내가 작성한 글', path: '/myWrite' },
    { label: '작성한 첨삭', path: '/myWriteComment' },
    { label: '읽담 한줄', path: '/myWriteShort' },
];

const answers = [
    {
        id: 1,
        question: '오늘 읽은 책에서 가장 인상 깊었던 구절은 무엇인가요?',
        answer: '삶이 그대로 슬퍼지지도 슬퍼져야만 하지 않다. 삶을 눌렀을 때 고진감래 기쁜 밤이 오리니',
        likes: 32,
        bg: 'bg-blue-50',
    },
    {
        id: 2,
        question: '오늘 읽은 책에서 마음에 남은 조언은 무엇이었나요?',
        answer: '가장 어두운 밤도 끝나고 결국 해는 떠오른다.',
        likes: 54,
        bg: 'bg-yellow-50',
    },
    {
        id: 3,
        question: '책을 읽다 문득 떠오른 생각이 있나요?',
        answer: '작은 친절 하나가 하루를 밝히는 빛이 될 수 있구나.',
        likes: 64,
        bg: 'bg-rose-50',
    },
    {
        id: 4,
        question: '오늘 책 속 인물에게 배우고 싶은 점이 있다면요?',
        answer: '두려움 속에서도 앞으로 나아가던 그 용기. 나도 가져보고 싶다.',
        likes: 45,
        bg: 'bg-amber-50',
    },
    {
        id: 5,
        question: '오늘 책 속에서 기억하고 싶은 문장을 적어주세요.',
        answer: '행복은 멀리 있는 게 아니라, 지금 내 곁에 있는 것을 알아보는 마음에서 시작된다.',
        likes: 23,
        bg: 'bg-indigo-50',
    },
    {
        id: 6,
        question: '오늘 읽은 책에서 가장 공감 갔던 한 문장은 무엇인가요?',
        answer: '지금 이 순간에도 당신은 충분히 잘하고 있어. 자신을 믿어도 괜찮아.',
        likes: 22,
        bg: 'bg-pink-50',
    },
];

const MyShortWrite = () => {
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

            {/* 읊담 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {answers.map(item => (
                    <div
                        key={item.id}
                        className={`rounded-xl p-4 shadow-sm ${item.bg} aspect-square flex flex-col justify-between`}
                    >
                        <div>
                            <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
                                {item.question}
                            </h3>
                            <p className="text-sm text-gray-700 line-clamp-5">{item.answer}</p>
                        </div>
                        <div className="text-right text-xs text-gray-500">❤️ {item.likes}</div>
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

export default MyShortWrite;
