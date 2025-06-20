import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const MyInquiryModify = ({ inquiry, onClose, onUpdated, onDeleted }) => {
    const [form, setForm] = useState({
        title: inquiry.title || '',
        content: inquiry.content || '',
        reason: inquiry.reason || '',
    });

    const token = useAtomValue(tokenAtom);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!form.title || !form.content || !form.reason) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        try {
            const { data } = await axios.post(`${url}/my/myInquiryUpdate`, {
                inquiryId: inquiry.inquiryId,
                title: form.title,
                content: form.content,
                reason: form.reason,
                regDate: inquiry.regDate // 등록 시간은 그대로 유지
            }, {
                headers: {
                    Authorization: token.access_token.startsWith('Bearer ')
                        ? token.access_token
                        : `Bearer ${token.access_token}`,
                },
                withCredentials: true,
            });

            alert('문의가 수정되었습니다.');
            if (onUpdated) onUpdated(data);
            onClose();
        } catch (error) {
            console.error("수정 실패:", error);
            alert("문의 수정 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.post(`${url}/my/myInquiryDelete/${inquiry.inquiryId}`,{}, {
                headers: {
                    Authorization: token.access_token.startsWith('Bearer ')
                        ? token.access_token
                        : `Bearer ${token.access_token}`,
                },
                withCredentials: true,
            });

            alert("문의가 삭제되었습니다.");
            if (onDeleted) onDeleted(inquiry.inquiryId);
            onClose();
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("문의 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="relative max-w-2xl mx-auto px-4 py-10">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center mb-8">문의 수정</h2>

            {/* 문의 사유 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">문의 사유</label>
                <select
                    name="reason"
                    value={form.reason}
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
                    className="w-full border rounded-md p-2"
                />
            </div>

            {/* 내용 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full h-40 border rounded-md p-2 resize-none"
                />
            </div>

            {/* 하단 버튼 */}
            <div className="mt-8 flex justify-end gap-4">
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 text-sm"
                >
                    삭제하기
                </button>
                <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 text-sm"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
};

export default MyInquiryModify;
