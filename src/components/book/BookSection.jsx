// src/components/BookSection.jsx
import React from 'react'
import { BookCard } from './BookCard'
import { PlusIcon } from 'lucide-react'

export function BookSection({ title, books, onAdd, onShowAll, onBookClick }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#005C78]">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="flex items-center gap-1 bg-[#E88D67] text-white rounded-md px-3 py-1.5 hover:bg-opacity-90 transition-colors"
          >
            <PlusIcon size={16} />
            <span>책 추가</span>
          </button>
          <button
            onClick={onShowAll}
            className="flex items-center border border-[#E88D67] text-[#E88D67] rounded-md px-3 py-1.5 hover:bg-[#E88D67] hover:text-white transition-colors"
          >
            전체 보기 &gt;
          </button>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {books.map(book => (
          <div key={book.id} onClick={() => onBookClick(book.id)}>
            <BookCard cover={book.cover} title={book.title} author={book.author} />
          </div>
        ))}
      </div>
    </div>
  )
}
