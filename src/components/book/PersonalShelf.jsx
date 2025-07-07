// src/components/PersonalShelf.jsx
import React from 'react'
import { PlusIcon } from 'lucide-react'

export function PersonalShelf({ shelves, onAdd, onSelect }) {
  // 최소 3칸 확보 로직
  const slots = shelves.length > 0
    ? [...shelves]
    : []
  const placeholdersCount = Math.max(0, 3 - slots.length)

  return (
    <div className="space-y-4 mb-8 px-4">
      {/* 헤더 */}
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

      {/* 선반 */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {/* 실제 있는 서재들 */}
        {slots.map(shelf => (
          <div
            key={shelf.id}
            className="w-[140px] cursor-pointer flex-shrink-0"
            onClick={() => onSelect(shelf.name)}
          >
            <div
              className="relative w-[140px] h-[190px] overflow-hidden rounded-lg"
              style={{ perspective: '800px' }}
            >
              {shelf.books.length > 0
                ? shelf.books.slice(0, 3).map((book, idx) => {
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
                  })
                : <div className="w-full h-full bg-gray-100 rounded-lg" />
              }
            </div>
            <p className="mt-2 text-center text-sm font-medium text-[#006989]">
              {shelf.name} ({shelf.books.length})
            </p>
          </div>
        ))}

        {/* 빈칸 placeholder */}
        {Array.from({ length: placeholdersCount }).map((_, idx) => (
          <div
            key={`ph-${idx}`}
            className="w-[140px] h-[190px] bg-gray-100 rounded-lg flex-shrink-0"
          />
        ))}
      </div>
    </div>
  )
}

export default PersonalShelf
