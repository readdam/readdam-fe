import React, { useState } from 'react';
import MyInquirydetail from './MyInquirydetail';
import MyInquiryWrite from './MyInquiryWrite';

const inquiries = [
    {
        date: '2025.05.25',
        title: '포인트 충전이 되지 않았습니다',
        content: '포인트 충전을 했는데 아직 반영이 되지 않았습니다. 확인 부탁드립니다.',
        status: '답변완료',
    },
    {
        date: '2025.05.22',
        title: '환불 절차에 대해 문의드립니다',
        content: '구매한 상품을 환불하고 싶은데 어떻게 해야 하나요?',
        status: '답변완료',
    },
    {
        date: '2025.05.20',
        title: '계정 정보 변경 방법',
        content: '개인정보를 수정하고 싶은데 어디서 변경할 수 있나요?',
        status: '미답변',
    },
];

const InquiryListPage = () => {
    const [selectedInquiry, setSelectedInquiry] = useState(null); // 상세 모달용
    const [isWriteOpen, setIsWriteOpen] = useState(false); // 작성 모달용

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-xl font-semibold mb-6">나의 문의 내역</h1>

            <div className="w-full border rounded-lg overflow-hidden">
                <div className="bg-gray-50 text-sm font-medium grid grid-cols-12 px-4 py-2 border-b">
                    <div className="col-span-2">작성일자</div>
                    <div className="col-span-8">제목</div>
                    <div className="col-span-2 text-right">답변상태</div>
                </div>

                {inquiries.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedInquiry(item)}
                        className="grid grid-cols-12 px-4 py-4 border-b text-sm items-start hover:bg-gray-50 cursor-pointer"
                    >
                        <div className="col-span-2 text-gray-500">{item.date}</div>
                        <div className="col-span-8">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-gray-500 text-xs">{item.content}</div>
                        </div>
                        <div className="col-span-2 text-right">
                            <span
                                className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${item.status === '답변완료'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <button className="text-sm text-blue-600 hover:underline">더보기</button>
            </div>

            <div className="fixed bottom-8 right-8">
                <button
                    onClick={() => setIsWriteOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                >
                    <span className="text-lg">＋</span> 1:1 문의 작성
                </button>
            </div>

            {/* 상세 모달 */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl rounded-md p-6 shadow-lg">
                        <MyInquirydetail inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />
                    </div>
                </div>
            )}

            {/* 작성 모달 */}
            {isWriteOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl rounded-md p-6 shadow-lg">
                        <MyInquiryWrite onClose={() => setIsWriteOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquiryListPage;
