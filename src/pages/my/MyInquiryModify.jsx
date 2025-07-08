// src/pages/my/MyInquiryModify.jsx
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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.title || !form.content || !form.reason) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    try {
      const { data } = await axios.post(
        `${url}/my/myInquiryUpdate`,
        {
          inquiryId: inquiry.inquiryId,
          title: form.title,
          content: form.content,
          reason: form.reason,
          regDate: inquiry.regDate,
        },
        {
          headers: {
            Authorization: token.access_token.startsWith('Bearer ')
              ? token.access_token
              : `Bearer ${token.access_token}`,
          },
          withCredentials: true,
        }
      );
      alert('문의가 수정되었습니다.');
      onUpdated?.(data);
      onClose();
    } catch (error) {
      console.error('수정 실패:', error);
      alert('문의 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.post(
        `${url}/my/myInquiryDelete/${inquiry.inquiryId}`,
        {},
        {
          headers: {
            Authorization: token.access_token.startsWith('Bearer ')
              ? token.access_token
              : `Bearer ${token.access_token}`,
          },
          withCredentials: true,
        }
      );
      alert('문의가 삭제되었습니다.');
      onDeleted?.(inquiry.inquiryId);
      onClose();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('문의 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="relative px-4 pt-4 pb-6">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-bold text-center mb-6">문의 수정</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">문의 사유</label>
        <select
          name="reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3"
        >
          <option value="">문의 사유 선택</option>
          <option value="포인트 관련">포인트 관련</option>
          <option value="결제 오류">결제 오류</option>
          <option value="계정 문의">계정 문의</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full h-40 border border-gray-300 rounded-md p-3 resize-none"
        />
      </div>

      <div className="flex justify-between mt-12">
        <button
          onClick={handleDelete}
          className="px-6 py-2 rounded-md bg-[#E88D67] text-white hover:bg-[#D77C5A] focus:outline-none focus:ring-2 focus:ring-[#D77C5A] text-sm"
        >
          삭제하기
        </button>
        <button
          onClick={handleUpdate}
          className="px-6 py-2 rounded-md bg-[#006989] text-white hover:bg-[#005f78] focus:outline-none focus:ring-2 focus:ring-[#005f78] text-sm"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default MyInquiryModify;
