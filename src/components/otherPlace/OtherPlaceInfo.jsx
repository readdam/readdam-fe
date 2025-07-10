import React from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  GlobeIcon,
  InfoIcon,
  HeartIcon,
} from 'lucide-react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createAxios, url } from '@config/config';
import { userAtom } from '../../atoms';
import ImageSlider from '@components/ImageSlider';

const OtherPlaceInfo = ({ place }) => {
  const { id } = useParams();
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const axios = createAxios();

  // 좋아요 여부 조회
  const { data: isLiked, isLoading: isLikeLoading } = useQuery({
    queryKey: ['otherPlaceLikeStatus', id],
    queryFn: async () => {
      const res = await axios.get(`/otherplace/likes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // 좋아요 수 조회
  const { data: likeCount, isLoading: isCountLoading } = useQuery({
    queryKey: ['otherPlaceLikeCount', id],
    queryFn: async () => {
      const res = await createAxios().get(`/otherplace/likes/${id}/count`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleLike = async () => {
    if (!user?.username || user.username.trim() === '') {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    try {
      await axios.post(`/otherplace/likes/${id}`);
      queryClient.invalidateQueries(['otherPlaceLikeStatus']);
      queryClient.invalidateQueries(['otherPlaceLikeCount']);
    } catch (err) {
      console.error(err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 큰 헤더 이미지 */}
      <ImageSlider place={place} />
      <div className="p-6 space-y-6">
        {/* 장소명 + 태그 + 좋아요 */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {place.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {place.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
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

        {/* 주소 / 전화 / 운영시간 */}
        <div className="space-y-3">
          {place.basicAddress && (
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
              <span className="text-gray-700">
                {place.basicAddress} {place.detailAddress}
              </span>
            </div>
          )}
          {place.phone && (
            <div className="flex items-start">
              <PhoneIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
              <span className="text-gray-700">{place.phone}</span>
            </div>
          )}
          {(place.weekdayStime || place.weekendStime) && (
            <div className="flex items-start">
              <ClockIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
              <span className="text-gray-700">
                평일 {place.weekdayStime ? place.weekdayStime.slice(0, 5) : '-'}{' '}
                ~ {place.weekdayEtime ? place.weekdayEtime.slice(0, 5) : '-'},
                주말 {place.weekendStime ? place.weekendStime.slice(0, 5) : '-'}{' '}
                ~ {place.weekendEtime ? place.weekendEtime.slice(0, 5) : '-'}
              </span>
            </div>
          )}
          {place.domain && (
            <div className="flex items-start">
              <GlobeIcon className="w-5 h-5 text-[#006989] mr-2 mt-0.5" />
              <a
                href={place.domain}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006989] hover:underline"
              >
                공식 웹사이트 방문하기
              </a>
            </div>
          )}
        </div>

        {/* 이용 요금 */}
        {place.fee && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              이용 요금
            </h2>
            <p className="text-gray-700">
              시간당 {place.fee.toLocaleString()}원
            </p>
          </div>
        )}

        {/* 시설 안내 */}
        {place.facilities && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              시설 안내
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {place.facilities}
            </p>
          </div>
        )}

        {/* 공간 소개 */}
        {place.introduce && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              공간 소개
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {place.introduce}
            </p>
          </div>
        )}

        {/* 유의사항 */}
        {place.usageGuide && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              유의사항
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {place.usageGuide}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherPlaceInfo;
