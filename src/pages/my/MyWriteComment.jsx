import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { label: '내가 작성한 글', path: '/myWrite' },
    { label: '작성한 첨삭', path: '/myWriteComment' },
    { label: '읽담 한줄', path: '/myWriteShort' },
];

const comments = [
    {
        id: 1,
        category: '자기소개서',
        title: '2024 교육대학원 지원 자기소개서',
        author: 'novel_lover',
        date: '2023-05-08',
        content: `
교육은 개인의 잠재력을 실현하고 사회에 긍정적 변화를 이끄는 핵심 동력이라 믿습니다. 
저는 다양한 교육 현장에서의 경험을 통해, 학생 개개인의 성장을 도울 수 있는 교사의 역할에 대해 깊이 고민해왔습니다. 
특히, 학습자의 눈높이에 맞춘 소통과 지속적인 피드백의 중요성을 체감하며 교육 철학을 다져왔습니다. 
이러한 경험을 바탕으로, 보다 전문적인 교육 역량을 갖추기 위해 교육대학원에 진학하고자 합니다. 
더불어 향후에는 실천적 연구와 교육 현장 경험을 바탕으로 미래 교육에 기여하고자 합니다.`,
    },
];

const MyWriteComment = () => {
    const location = useLocation();
    const [expandedId, setExpandedId] = useState(null);

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">나의 글쓰기</h2>

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

            {/* 첨삭 목록 */}
            <div className="space-y-4">
                {comments.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                        <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                    {item.category}
                                </span>
                                <h3 className="font-semibold text-sm">{item.title}</h3>
                                <span className="ml-auto text-xs text-gray-500">
                                    {item.author} · {item.date}
                                </span>
                            </div>

                            <p
                                className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${isExpanded ? '' : 'line-clamp-[5]'
                                    }`}
                            >
                                {item.content}
                            </p>

                            {!isExpanded && (
                                <button
                                    className="mt-2 text-blue-500 text-sm font-medium"
                                    onClick={() => setExpandedId(item.id)}
                                >
                                    더보기
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyWriteComment;
