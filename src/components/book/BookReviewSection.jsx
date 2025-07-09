import React, { useState } from 'react';
import { StarIcon, EditIcon, TrashIcon } from 'lucide-react';
import StarRatingSvg from '@components/book/StarRatingSvg';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../atoms';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getReviews, writeReview, updateReview, deleteReview } from '@api/book';
import { createAxios } from '@config/config';
import { useAxios } from '@hooks/useAxios';

const BookReviewSection = ({ isbn }) => {
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    isHide: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editIsHide, setEditIsHide] = useState(false);

  const axios = useAxios();

  const { data: reviewPage, isLoading } = useQuery({
    queryKey: ['bookReviews', isbn, user?.username, currentPage],
    queryFn: () =>
      getReviews({
        isbn,
        username: user?.username,
        page: currentPage,
        size: reviewsPerPage,
        axios: createAxios(),
      }),
    enabled: !!isbn,
  });

  const handleAddReview = async () => {
    if (!user?.username) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newReview.comment.trim()) {
      alert('내용을 입력하세요.');
      return;
    }

    try {
      await writeReview({
        comment: newReview.comment,
        rating: newReview.rating,
        isHide: newReview.isHide,
        bookIsbn: isbn,
        axios,
      });
      alert('리뷰가 등록되었습니다!');
      setNewReview({ rating: 0, comment: '', isHide: false });
      setCurrentPage(0);
      queryClient.invalidateQueries(['bookReviews']);
    } catch (err) {
      console.error(err);
      alert('등록 실패');
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.bookReviewId);
    setEditComment(review.comment ?? '');
    setEditRating(review.rating ?? 0);
    setEditIsHide(review.isHide ?? false);
  };

  const handleUpdateReview = async () => {
    if (!editComment.trim()) {
      alert('내용을 입력하세요.');
      return;
    }
    console.log(editComment);
    try {
      await updateReview({
        reviewId: editingId,
        comment: editComment,
        rating: editRating,
        isHide: editIsHide,
        axios,
      });
      alert('수정되었습니다.');
      setEditingId(null);
      queryClient.invalidateQueries(['bookReviews']);
    } catch (err) {
      console.error(err);
      alert('수정 실패');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await deleteReview({ reviewId, axios });
      alert('삭제되었습니다.');
      queryClient.invalidateQueries(['bookReviews']);
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  };

  const renderStars = (rating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-[#E88D67] fill-[#E88D67]' : 'text-gray-300'
          }`}
        />
      ));

  return (
    <div className="bg-white mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">리뷰</h2>

      {/* 작성 */}
      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 text-sm">평점</label>
          <StarRatingSvg
            rating={newReview.rating}
            setRating={(r) => setNewReview({ ...newReview, rating: r })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm">내용</label>
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#006989]"
            rows={3}
            placeholder="리뷰를 작성해주세요"
          />
        </div>
        <div className="flex justify-end gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={newReview.isHide}
              onChange={(e) =>
                setNewReview({ ...newReview, isHide: e.target.checked })
              }
            />
            비공개
          </label>
          <button
            onClick={handleAddReview}
            className="px-4 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78]"
          >
            작성하기
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-gray-400">불러오는 중...</div>
        ) : reviewPage?.content?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">리뷰가 없습니다.</p>
        ) : (
          reviewPage?.content.map((r) => (
            <div key={r.bookReviewId} className="flex gap-4">
              <img
                src={
                  r.profileImg
                    ? `http://localhost:8080/image?filename=${r.profileImg}`
                    : 'https://i.ibb.co/X8xG7VG/dog1.png'
                }
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1 border-b border-gray-100 pb-6">
                {editingId === r.bookReviewId ? (
                  <div className="space-y-3 w-full">
                    <h3 className="font-bold">리뷰 수정</h3>
                    <label className="block text-gray-700 mb-1 text-sm">
                      평점
                    </label>
                    <StarRatingSvg
                      rating={editRating}
                      setRating={setEditRating}
                    />
                    <label className="block text-gray-700 mb-1 text-sm">
                      내용
                    </label>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
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
                          className="px-3 py-1 bg-[#006989] text-white rounded-md text-sm"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex">{renderStars(r.rating)}</div>
                        <div className="font-bold text-sm flex gap-2 items-center">
                          {r.nickname}
                          <span className="font-medium text-xs text-gray-500">
                            {r.regTime.split('T')[0].replace(/-/g, '.')}
                          </span>
                        </div>
                      </div>
                      {user?.username === r.username && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(r)}
                            className="text-gray-500 hover:text-[#006989]"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.bookReviewId)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700">{r.comment}</p>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이징 */}
      {reviewPage && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage(reviewPage.pageInfo.currentPage - 2)
              }
              disabled={reviewPage.pageInfo.currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              이전
            </button>
            {Array.from({ length: reviewPage.pageInfo.totalPages }).map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 text-sm rounded border ${
                    reviewPage.pageInfo.currentPage - 1 === i
                      ? 'bg-[#006989] text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(reviewPage.pageInfo.currentPage)}
              disabled={reviewPage.pageInfo.isLastPage}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BookReviewSection;
