import { useState } from 'react';

export default function StarRatingSvg({ rating, setRating }) {
  const [hover, setHover] = useState(null);
  const current = hover ?? rating;

  const getFill = (value) => (current >= value ? '#E88D67' : 'transparent');

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const leftValue = index - 0.5;
        const rightValue = index;

        return (
          <div key={index} className="relative w-6 h-6">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <defs>
                <clipPath id={`left-half-${index}`}>
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
                <clipPath id={`right-half-${index}`}>
                  <rect x="12" y="0" width="12" height="24" />
                </clipPath>
              </defs>

              {/* 배경 회색 별 */}
              <path
                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 
                1.42 8.293L12 18.896 4.58 23.563 
                6 15.27 0 9.423l8.332-1.268z"
                fill="#D1D5DB"
              />

              {/* 왼쪽 반 별 */}
              <path
                clipPath={`url(#left-half-${index})`}
                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 
                1.42 8.293L12 18.896 4.58 23.563 
                6 15.27 0 9.423l8.332-1.268z"
                fill={getFill(leftValue)}
                className="cursor-pointer"
                onMouseEnter={() => setHover(leftValue)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRating(leftValue)}
              />

              {/* 오른쪽 반 별 */}
              <path
                clipPath={`url(#right-half-${index})`}
                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 
                1.42 8.293L12 18.896 4.58 23.563 
                6 15.27 0 9.423l8.332-1.268z"
                fill={getFill(rightValue)}
                className="cursor-pointer"
                onMouseEnter={() => setHover(rightValue)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRating(rightValue)}
              />
            </svg>
          </div>
        );
      })}
      <span className="text-xs mt-1 text-gray-500">{rating}</span>
    </div>
  );
}
