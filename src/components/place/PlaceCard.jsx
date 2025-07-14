import React from 'react';
import { HeartIcon, MapPinIcon } from 'lucide-react';
import { url } from '@config/config';

const PlaceCard = ({ place, size = 'large' }) => {
  const isSmall = size === 'small';
  return (
    <div
      className={`
        border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow
 
        ${isSmall ? 'h-full' : ''}
      `}
    >
      <div className={`relative ${isSmall ? 'h-32' : 'h-48'} bg-gray-200`}>
        {place.image ? (
          <img
            src={`${url}/image?filename=${place.image}`}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-400 text-sm">이미지가 없습니다</p>
          </div>
        )}
        {place.isPromoted && (
          <div className="absolute top-2 left-2 bg-[#E88D67] text-white text-xs px-2 py-1 rounded">
            추천
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 flex items-center">
          <HeartIcon className="w-3 h-3 text-[#E88D67] mr-1" />
          <span className="text-xs font-medium">{place.likes}</span>
        </div>
      </div>
      <div className="p-3">
        <h3
          className={`font-bold ${
            isSmall ? 'text-base' : 'text-lg'
          } text-gray-800 mb-1 line-clamp-1`}
        >
          {place.name}
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPinIcon className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{place.address}</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
          <div className="inline-flex gap-1">
            {place.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-[#F3F7EC] text-[#006989] text-xs rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceCard;
