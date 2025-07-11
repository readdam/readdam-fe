import React, { useEffect, useState } from 'react';
import { StarIcon, EditIcon, TrashIcon } from 'lucide-react';
import StarRatingSvg from '@components/book/StarRatingSvg';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../atoms';
import { useAxios } from '@hooks/useAxios';
import {
  deleteOtherPlaceReview,
  getOtherPlaceReviews,
  updateOtherPlaceReview,
  writeOtherPlaceReview,
} from '@api/otherPlace';
import { useParams } from 'react-router';
import { createAxios } from '@config/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useReportModal } from '@hooks/useReportModal';
import { REPORT_CATEGORY } from '@constants/reportCategory';
import singoIcon from '@assets/singo.png';

const OtherPlaceReviewSection = () => {
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
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editIsHide, setEditIsHide] = useState(false);

  // 데이터 조회
  const { data: reviewPage, isLoading: isReviewLoading } = useQuery({
    queryKey: ['otherPlaceReviews', id, currentPage],
    queryFn: async () =>
      await getOtherPlaceReviews({
        otherPlaceId: id,
        page: currentPage,
        size: reviewsPerPage,
        axios: createAxios(),
      }),
    enabled: !!id,
  });

  const { openReportModal, ReportModalComponent } = useReportModal({
    defaultCategory: REPORT_CATEGORY.OTHER_PLACE_REVIEW,
    onSuccess: () => {
      alert('신고가 접수되었습니다.');
    },
  });

  // 로그인 체크
  const handleCheckLogin = () => {
    if (!user?.username || user.username.trim() === '') {
      alert('로그인이 필요한 서비스입니다.');
      return false;
    }
    return true;
  };

  // 리뷰 작성
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!handleCheckLogin()) return;
    if (!newReview.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      await writeOtherPlaceReview({
        content: newReview.content,
        rating: newReview.rating,
        isHide: newReview.isHide,
        otherPlaceId: id,
        axios,
      });
      setNewReview({ rating: 0, content: '', isHide: false });
      alert('리뷰가 등록되었습니다!');
      queryClient.invalidateQueries(['otherPlaceReviews']);
    } catch (err) {
      console.error(err);
      alert('리뷰 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 리뷰 수정
  const handleEdit = (review) => {
    setEditingId(review.otherPlaceReviewId);
    setEditContent(review.content);
    setEditRating(review.rating);
    setEditIsHide(review.isHide);
  };

  const handleUpdateReview = async () => {
    if (!editContent.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }
    try {
      await updateOtherPlaceReview({
        reviewId: editingId,
        content: editContent,
        rating: editRating,
        isHide: editIsHide,
        axios,
      });
      alert('리뷰가 수정되었습니다.');
      setEditingId(null);
      queryClient.invalidateQueries(['otherPlaceReviews']);
    } catch (err) {
      console.error(err);
      alert('리뷰 수정에 실패했습니다.');
    }
  };

  // 리뷰 삭제
  const handleDelete = async (reviewId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteOtherPlaceReview({ reviewId, axios });
      alert('리뷰가 삭제되었습니다.');
      queryClient.invalidateQueries(['otherPlaceReviews']);
    } catch (err) {
      console.error(err);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  // 별점 렌더링
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

      {/* 작성 폼 */}
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
              if (!handleCheckLogin()) e.target.blur();
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
        <div className="flex justify-end gap-4">
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
            {isSubmitting ? '등록 중...' : '작성하기'}
          </button>
        </div>
      </form>

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
              key={review.otherPlaceReviewId}
              className="border-b border-gray-100 pb-6 last:border-0"
            >
              {editingId === review.otherPlaceReviewId ? (
                <div className="space-y-3 w-full">
                  <h3 className="font-bold">리뷰 수정하기</h3>
                  <label className="block text-gray-700 mb-1">평점</label>
                  <StarRatingSvg
                    rating={editRating}
                    setRating={setEditRating}
                  />
                  <label className="block text-gray-700 mb-1">내용</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006989]"
                    rows={4}
                  />
                  <div className="flex justify-end gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editIsHide}
                        onChange={(e) => setEditIsHide(e.target.checked)}
                      />
                      비공개
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateReview}
                        className="px-3 py-1 bg-[#006989] text-white rounded-md text-sm hover:bg-[#005C78]"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <p className="font-bold text-gray-800 flex items-center text-sm gap-2">
                        {review.nickname}
                        <span className="font-medium text-xs text-gray-500">
                          {review.regTime.split('T')[0].replace(/-/g, '.')}
                        </span>
                      </p>
                    </div>
                    {user.username === review.username ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-gray-500 hover:text-[#006989]"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(review.otherPlaceReviewId)
                          }
                          className="text-gray-500 hover:text-red-500"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() =>
                            openReportModal({
                              id: review.otherPlaceReviewId,
                              username: review.username,
                            })
                          }
                          className="cursor-pointer"
                        >
                          <img src={singoIcon} alt="신고" className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-base">{review.content}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
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
      {ReportModalComponent}
    </div>
  );
};

export default OtherPlaceReviewSection;
