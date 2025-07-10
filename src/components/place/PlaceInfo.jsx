import React, { useState } from 'react';
import { HeartIcon, ClockIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { url } from '@config/config';
import { useAxios } from '@hooks/useAxios';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../atoms';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPlaceLikeCount,
  getPlaceLikeStatus,
  togglePlaceLike,
} from '@api/place';
import { createAxios } from '@config/config';
import { useParams } from 'react-router';
import ImageSlider from '@components/ImageSlider';

function formatTimeRanges(times) {
  if (!times || times.length === 0) return '';
  const sorted = [...new Set(times)].sort();
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const prevHour = parseInt(prev.split(':')[0], 10);
    const currHour = parseInt(curr.split(':')[0], 10);
    if (currHour !== prevHour + 1) {
      ranges.push(`${start}-${prev}`);
      start = curr;
    }
    prev = curr;
  }
  ranges.push(`${start}-${prev}`);
  return ranges.join(', ');
}

const PlaceInfo = ({ place }) => {
  const [liked, setLiked] = useState(false);
  // const [likeCount, setLikeCount] = useState(place.likes);

  const axios = useAxios();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const { id } = useParams();

  // 좋아요 상태 조회
  const { data: isLiked, isLoading: isLikeLoading } = useQuery({
    queryKey: ['placeLikeStatus', id],
    queryFn: () => getPlaceLikeStatus({ placeId: id, axios }),
    enabled: !!id,
  });

  // 좋아요 수 조회
  const { data: likeCount, isLoading: isCountLoading } = useQuery({
    queryKey: ['placeLikeCount', id],
    queryFn: () => getPlaceLikeCount({ placeId: id, axios: createAxios() }),
    enabled: !!id,
  });

  const handleLike = async () => {
    if (!user?.username || user.username.trim() === '') {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    try {
      await togglePlaceLike({ placeId: id, axios });
      queryClient.invalidateQueries(['placeLikeStatus']);
      queryClient.invalidateQueries(['placeLikeCount']);
    } catch (err) {
      console.error(err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 이미지 슬라이더 */}
      <ImageSlider place={place} />
      {/* 장소 정보 */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{place.name}</h1>
          <button
            onClick={handleLike}
            disabled={isLikeLoading || isCountLoading}
            className="flex items-center space-x-1 text-gray-600"
          >
            <HeartIcon
              className={`w-6 h-6 ${
                isLiked ? 'fill-[#E88D67] text-[#E88D67]' : 'text-gray-400'
              }`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <MapPinIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
            <span className="text-gray-700">
              {place.basicAddress} {place.detailAddress}
            </span>
          </div>
          <div className="flex items-start">
            <PhoneIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
            <span className="text-gray-700">{place.phone}</span>
          </div>
          <div className="flex items-start">
            <ClockIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
            <span className="text-gray-700">
              평일: {formatTimeRanges(place.weekdayTimes)} | 주말:{' '}
              {formatTimeRanges(place.weekendTimes)}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            공간 소개
          </h2>
          <p className="text-gray-600 leading-relaxed">{place.introduce}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">키워드</h2>
          <div className="flex flex-wrap gap-2">
            {place.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm rounded-full"
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
export default PlaceInfo;
