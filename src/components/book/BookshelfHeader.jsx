// src/components/BookshelfHeader.jsx
import React from 'react'
import { EyeIcon } from 'lucide-react'

export function BookshelfHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-[#006989]">내 서재</h1>
      <p className="text-gray-600">읽고 있는 책과 좋아하는 책을 관리하세요</p>
    </div>
  )
}
