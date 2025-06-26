// src/components/PersonalShelf.jsx
import React from 'react'
import { PlusIcon } from 'lucide-react'

export function PersonalShelf({ shelves, onAdd, onSelect }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#005C78]">나만의 서재</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 bg-[#E88D67] text-white rounded-md px-3 py-1.5 hover:bg-opacity-90 transition-colors"
        >
          <PlusIcon size={16} />
          <span>서재 추가</span>
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {shelves.map(shelf => (
          <div
            key={shelf.id}
            className="w-[140px] cursor-pointer"
            onClick={() => onSelect(shelf.name)}
          >
            {/* 3D 컨테이너: perspective */}
            <div
              className="relative w-[140px] h-[190px] overflow-hidden rounded-lg"
              style={{ perspective: '800px' }}
            >
              {shelf.books.slice(0, 3).map((book, idx) => {
                const yAngles = [-15, 0, 15]
                return (
                  <img
                    key={book.id}
                    src={book.cover}
                    alt={book.title}
                    className="absolute w-[140px] h-[190px] object-cover transition-shadow hover:shadow-lg"
                    style={{
                      left: `${idx * 20}px`,
                      zIndex: idx,
                      transform: `rotateY(${yAngles[idx]}deg)`,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  />
                )
              })}
            </div>
            <p className="mt-2 text-center text-sm font-medium text-[#006989]">
              {shelf.name} ({shelf.books.length})
            </p>
          </div>
        ))}

        <div
          onClick={onAdd}
          className="w-[140px] h-[190px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
        >
          <PlusIcon size={32} className="text-gray-300" />
        </div>
      </div>
    </div>
  )
}
