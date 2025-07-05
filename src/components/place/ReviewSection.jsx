import React, { useEffect, useState } from 'react';
import { StarIcon, EditIcon, TrashIcon } from 'lucide-react';
// StarRatingSvg 컴포넌트 import (책 리뷰에서 사용하던 것)
import StarRatingSvg from '@components/book/StarRatingSvg';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../atoms';
import { useAxios } from '@hooks/useAxios';
import { getPlaceReviews, writePlaceReview } from '@api/place';
import { useParams } from 'react-router';
import { createAxios } from '@config/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ReviewSection = () => {
  // const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({
    rating: 0,
    content: '',
    isHide: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAtomValue(userAtom);
  const axios = useAxios();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const queryClient = useQueryClient();

  const { data: reviewPage, isLoading: isReviewLoading } = useQuery({
    queryKey: ['placeReviews', id, currentPage],
    queryFn: async () =>
      await getPlaceReviews({
        placeId: id,
        page: currentPage,
        size: reviewsPerPage,
        axios: createAxios(),
      }),
    enabled: !!id,
  });

  useEffect(() => {
    console.log(user);
    console.log(reviewPage);
  }, [user, reviewPage]);

  // 로그인 체크 핸들러
  const handleCheckLogin = () => {
    if (!user?.username || user.username.trim() === '') {
      alert('로그인이 필요한 서비스입니다.');
      return false;
    }
    return true;
  };

  // 리뷰 추가 핸들러
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user?.username || user.username.trim() === '') {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (!newReview.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      // 서버에 저장하는 API 요청 예시
      await writePlaceReview({
        content: newReview.content,
        rating: newReview.rating,
        isHide: newReview.isHide,
        placeId: id,
        axios,
      });

      setNewReview({
        rating: 0,
        content: '',
        isHide: false,
      });
    } catch (err) {
      console.error(err);
      alert('리뷰 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
    alert('리뷰가 등록되었습니다!');
    queryClient.invalidateQueries(['placeReviews']);
  };

  // 기존 renderStars는 그대로 사용 가능
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-[#E88D67] fill-[#E88D67]' : 'text-gray-300'
          }`}
        />
      ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">리뷰</h2>

      {
        <form onSubmit={handleAddReview} className="mb-8 space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">평점</label>
            <StarRatingSvg
              rating={newReview.rating}
              setRating={(r) => {
                if (!handleCheckLogin()) return;
                setNewReview({ ...newReview, rating: r });
              }}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">내용</label>
            <textarea
              value={newReview.content}
              onFocus={(e) => {
                if (!handleCheckLogin()) {
                  e.target.blur(); // 포커스 해제
                }
              }}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006989]"
              rows={4}
              placeholder="리뷰를 작성해주세요"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newReview.isHide}
              onChange={(e) => {
                if (!handleCheckLogin()) return;
                setNewReview({ ...newReview, isHide: e.target.checked });
              }}
            />
            비공개
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] disabled:opacity-50"
          >
            {isSubmitting ? '등록 중...' : '리뷰 작성'}
          </button>
        </form>
      }

      {/* 리뷰 리스트 */}
      <div className="space-y-6">
        {isReviewLoading ? (
          <div className="text-center text-gray-400">리뷰 불러오는 중...</div>
        ) : reviewPage?.content?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            아직 리뷰가 없습니다.
          </p>
        ) : (
          reviewPage?.content.map((review) => (
            <div
              key={review.placeReviewId}
              className="border-b border-gray-100 pb-6 last:border-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="font-bold text-gray-800 flex items-center text-sm gap-2">
                    {review.nickname}
                    <span className="font-medium text-xs text-gray-500">
                      {review.regTime.split('T')[0].replace(/-/g, '.')}
                    </span>
                  </p>
                </div>
                {user.username === review.username && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-gray-500 hover:text-[#006989]"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.placeReviewId)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-base">{review.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            이전
          </button>
          {[...Array(reviewPage?.pageInfo?.totalPages || 0)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 text-sm rounded border ${
                currentPage === i
                  ? 'bg-[#006989] text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage === (reviewPage?.pageInfo?.totalPages || 1) - 1
            }
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            다음
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ReviewSection;
