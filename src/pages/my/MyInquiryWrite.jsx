import React, { useState } from 'react';
import { X } from 'lucide-react'; // 아이콘 사용할 경우 (없으면 아래 대체코드 참고)

const MyInquiryWrite = ({ onClose }) => {
    const [form, setForm] = useState({
        category: '',
        title: '',
        content: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log('문의 등록:', form);
        onClose(); // 등록 후 모달 닫기
    };

    return (
        <div className="relative max-w-2xl mx-auto px-4 py-10">
            {/* 상단 X 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center mb-8">관리자에게 문의</h2>

            {/* 문의 사유 선택 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">문의 사유 선택</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                >
                    <option value="">문의 사유 선택</option>
                    <option value="포인트 관련">포인트 관련</option>
                    <option value="결제 오류">결제 오류</option>
                    <option value="계정 문의">계정 문의</option>
                    <option value="기타">기타</option>
                </select>
            </div>

            {/* 제목 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="제목을 입력하세요"
                    className="w-full border rounded-md p-2"
                />
            </div>

            {/* 내용 */}
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="문의 내용을 자세히 입력해 주세요"
                    className="w-full h-40 border rounded-md p-2 resize-none"
                />
            </div>

            {/* 안내문구 */}
            <p className="text-xs text-gray-400 mt-2">
                운영자 확인 후 24시간 이내 답변드릴 예정입니다.
            </p>

            {/* 하단 버튼 */}
            <div className="mt-8 flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 text-sm"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 text-sm"
                >
                    문의 등록하기
                </button>
            </div>
        </div>
    );
};

export default MyInquiryWrite;
