// src/pages/my/MyInquiryWrite.jsx
import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../atoms'
import { useAxios } from '../../hooks/useAxios'

const MyInquiryWrite = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ category: '', title: '', content: '' })
  const token = useAtomValue(tokenAtom)
  const axios = useAxios()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.category || !form.title || !form.content) {
      alert('모든 항목을 입력해주세요.')
      return
    }
    try {
      const { data } = await axios.post('/my/myInquiryWrite', {
        title: form.title,
        content: form.content,
        reason: form.category,
      })
      alert('문의가 등록되었습니다.')
      onCreate?.(data)
    } catch {
      alert('문의 등록 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="relative bg-white rounded-md">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>

      <h2 className="text-xl font-bold text-center mb-4">관리자에게 문의</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">문의 사유</label>
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

      <div className="mb-3">
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

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="문의 내용을 입력해 주세요"
          className="w-full h-60 border rounded-md p-2 resize-none"
        />
      </div>

      <p className="text-xs text-gray-400 mt-1">운영자 확인 후 24시간 이내 답변 드립니다.</p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#E88D67] text-white px-3 py-2 rounded-md hover:bg-[#D77C5A] text-sm"
        >
          문의 등록하기
        </button>
      </div>
    </div>
  )
}

export default MyInquiryWrite
