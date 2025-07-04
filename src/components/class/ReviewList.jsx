import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import axios from "axios";
import { url } from "../../config/config";

const ReviewList = ({ classDetail }) => {
  const user = useAtomValue(userAtom); //로그인한 사용자 정보
  const token = useAtomValue(tokenAtom);
  const isLoggedIn = !!user?.username;

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewPerPage = 5;

  // 리뷰 조회
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${url}/classReview/${classDetail.classId}?page=${currentPage}`
      );
      const reviewData = res.data;
      console.log("리뷰 전체: ", reviewData);

      if (reviewData && Array.isArray(reviewData.data)) {
        setReviews(reviewData.data);
        setTotalPages(reviewData.totalPages || 1);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("리뷰 목록 조회 실패", err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [classDetail.classId, currentPage]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleReviewSubmit = async () => {
    setCurrentPage(1);
    if (!reviewText.trim()) return alert("리뷰 내용을 입력해주세요.");
    if (rating === 0) return alert("별점을 선택해주세요.");

    const formData = new FormData();
    formData.append("classId", classDetail.classId);
    formData.append("content", reviewText);
    formData.append("rating", rating);
    if (imgFile) {
      formData.append("ifile", imgFile);
      formData.append("img", imgFile.name);
    }

    try {
      await axios.post(`${url}/classReview`, formData, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("리뷰가 등록되었습니다.");
      setReviewText("");
      setRating(0);
      setImgFile(null);
      setPreview(null);
      fetchReviews();
      //   if(onSubmitted) onSubmitted();
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      alert("리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace("-", ".");
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">모임 참여회원 리뷰</h3>

      {isLoggedIn ? (
        <div>
          {/* 별점 선택 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  onClick={() => handleRating(i)}
                  className={`w-6 h-6 cursor-pointer ${
                    i <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.463a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.538 1.118l-3.388-2.463a1 1 0 00-1.175 0l-3.388 2.463c-.782.57-1.837-.197-1.538-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.037 9.394c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </div>

            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg resize-none mb-2"
              placeholder="모임 리뷰를 남겨보세요."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
            />
            {/* 이미지 업로드 */}
            <div className="flex items-center justify-between">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded"
                />
              )}

              <button
                onClick={handleReviewSubmit}
                className="px-4 py-2 bg-[#006989] text-white rounded hover:bg-[#005C78] transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">리뷰를 작성하려면 로그인하세요.</p>
      )}

      {/* 리뷰 목록 불러오기*/}

      <div className="space-y-6">
        {/* {console.log("📌 렌더 직전 reviews:", reviews)} */}
        {reviews.map((review) => (
          <div
            key={review.classReviewId}
            className="border-b border-gray-100 pb-6"
          >
            <div className="flex items-start gap-4">
              <img src={user.profileImg} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{user.nickname || "익명"}</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.regDate)}
                  </span>
                </div>

                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.463a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.538 1.118l-3.388-2.463a1 1 0 00-1.175 0l-3.388 2.463c-.782.57-1.837-.197-1.538-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.037 9.394c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 mb-4">{review.content}</p>

                {review.img && (
                  <img
                    src={`${url}/image?filename=${review.img}`}
                    alt="리뷰 이미지"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 간단한 페이지네이션
      <div className="flex justify-center mt-4">
        <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>이전</button>
        <span className="mx-2">{currentPage}</span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>다음</button>
      </div> */}
    </div>
  );
};
export default ReviewList;
