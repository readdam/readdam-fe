// src/components/BookshelfHeader.jsx
import React from 'react'
import { EyeIcon } from 'lucide-react'

export function BookshelfHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-[#006989]">내 서재</h1>
      <p className="text-gray-600">읽고 있는 책과 좋아하는 책을 관리하세요</p>
      <div className="flex justify-end mt-4">
        <button className="flex items-center gap-2 bg-white border border-[#006989] text-[#006989] rounded-full px-4 py-2 hover:bg-[#006989] hover:text-white transition-colors">
          <EyeIcon size={18} />
          <span>내 서재 둘러보기</span>
        </button>
      </div>
    </div>
  )
}
