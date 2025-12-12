// src/components/BookCard.jsx
import React from 'react'

export function BookCard({ cover, title, author }) {
  return (
    <div className="flex flex-col space-y-2 w-[140px]">
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <img
          src={cover}
          alt={title}
          className="w-full h-[190px] object-cover"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm text-[#006989] line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-500">{author}</p>
      </div>
    </div>
  )
}
