import { useRef, useState } from 'react';
import { StarIcon, HeartIcon, LockIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { searchBook } from '@api/kakaoApi';
import { getReviews, getReviewStats, writeReview } from '@api/book';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms'; // 로그인 사용자 정보
import StarRatingSvg from '@components/book/StarRatingSvg';

export default function BookDetail() {
  const token = useAtomValue(tokenAtom);
  const param = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['bookDetail', param.isbn],
    queryFn: () =>
      searchBook({
        query: param.isbn.split(' ')[0],
      }),
    enabled: !!param.isbn,
  });

  const isbnParam = decodeURIComponent(param.isbn); // 공백 포함된 ISBN 복원

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;

  // 로그인 유저 정보 (예: username)
  const user = useAtomValue(userAtom);
  const username = user?.username; // 또는 토큰 decode해서 꺼내기

  const { data: reviewPage, isLoading: isReviewLoading } = useQuery({
    queryKey: ['bookReviews', isbnParam, username, currentPage],
    queryFn: () =>
      getReviews({
        isbn: isbnParam,
        username,
        page: currentPage,
        size: reviewsPerPage,
      }),
    enabled: !!isbnParam && !!username,
  });

  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  // const currentReviews = allReviews.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState('');
  const [isHide, setIsHide] = useState(false);
  const [activeTab, setActiveTab] = useState('review');
  const reviewRef = useRef(null);
  const meetingRef = useRef(null);
  const lifeBookRef = useRef(null);

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      alert('리뷰 내용을 입력하세요!');
      return;
    }

    try {
      await writeReview({
        comment,
        rating,
        isHide,
        bookIsbn: isbnParam,
        token,
      });
      alert('리뷰가 등록되었습니다!');
      setComment('');
      setRating(0);
      setIsHide(false);
      setCurrentPage(0); // 첫 페이지로 이동
      queryClient.invalidateQueries(['bookReviews']); // 목록 다시 불러오기
    } catch (err) {
      console.error(err);
      alert('리뷰 등록에 실패했습니다.');
    }
  };

  if (isLoading || !data?.documents?.[0]) {
    return (
      <div className="text-center py-10 text-gray-500">로딩 중입니다...</div>
    );
  }

  const book = data.documents.find((doc) => doc.isbn.includes(isbnParam));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 책 정보 */}
      <div className="flex gap-8">
        <div className="w-80 h-80 flex justify-center items-center bg-[#F6F6F6]">
          <img
            src={`${book.thumbnail}`}
            alt={`${book.thumbnail}`}
            className=" h-fit"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-sm mb-1">저자 {book.authors.join(', ')}</p>
          <p className="text-sm mb-1">출판 {book.publisher}</p>
          <p className="text-sm mb-2">
            발행 {book.datetime.split('T')[0].split('-').join('.')}
          </p>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">책 리뷰</span>
              <span className="text-sm text-[#006989] font-bold">
                {book.reviewCnt}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(book.rating)
                        ? 'fill-[#E88D67] text-[#E88D67]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-sm">{book.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">{book.contents}...</p>

          <button
            className="bg-[#006989] text-white w-24 h-10 rounded-lg text-xs font-bold cursor-pointer"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            서재에 담기
          </button>
        </div>
      </div>

      {/* 리뷰 작성 */}
      <div ref={reviewRef} id="reviewSection" className="mt-10">
        <div className="sticky pt-4 top-0 bg-white z-10 border-b border-gray-300 mb-4 flex gap-6 text-sm">
          <button
            className={`pb-1 cursor-pointer ${
              activeTab === 'review'
                ? 'text-[#005C78] font-semibold border-b-2 border-[#005C78]'
                : 'text-gray-500'
            }`}
            onClick={() => {
              setActiveTab('review');
              document
                .getElementById('reviewSection')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            리뷰({book.reviewCnt}){/* 리뷰(0) */}
          </button>

          <button
            className={`pb-1 cursor-pointer ${
              activeTab === 'meeting'
                ? 'text-[#005C78] font-semibold border-b-2 border-[#005C78]'
                : 'text-gray-500'
            }`}
            onClick={() => {
              setActiveTab('meeting');
              document
                .getElementById('meetingSection')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            모임
          </button>

          <button
            className={`pb-1 cursor-pointer ${
              activeTab === 'lifeBook'
                ? 'text-[#005C78] font-semibold border-b-2 border-[#005C78]'
                : 'text-gray-500'
            }`}
            onClick={() => {
              setActiveTab('lifeBook');
              document
                .getElementById('lifeBookSection')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            인생책
          </button>
        </div>

        <div className="mb-4">
          <span className="text-sm">평점 </span>
          <StarRatingSvg rating={rating} setRating={setRating} />
          <span className="text-sm">내용</span>
          <textarea
            className="w-full border rounded-md p-3 text-sm resize-none h-24"
            placeholder="리뷰를 입력해주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />{' '}
          <label className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={isHide}
              onChange={(e) => setIsHide(e.target.checked)}
            />
            비공개
          </label>
          <button
            className="mt-2 bg-[#006989] text-white px-4 py-2 rounded-md text-sm font-semibold"
            onClick={handleSubmitReview}
          >
            리뷰 작성
          </button>
        </div>

        {/* 리뷰 목록 */}

        <div className="space-y-6">
          {isReviewLoading ? (
            <div className="text-center text-gray-400">리뷰 불러오는 중...</div>
          ) : (
            reviewPage?.content?.map((review) => (
              <div key={review.bookReviewId} className="flex gap-4">
                <img
                  src={
                    review.profileImg
                      ? `http://localhost:8080/image?filename=${review.profileImg}`
                      : 'https://i.ibb.co/X8xG7VG/dog1.png'
                  } // 임시 아바타
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {review.nickname}
                    <span className="text-xs font-normal text-gray-500">
                      | {review.regTime.split('T')[0].replace(/-/g, '.')}
                    </span>
                  </div>
                  <div className="flex gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-[#E88D67] fill-[#E88D67]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={reviewPage?.first}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            {[...Array(reviewPage?.totalPages || 0)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={reviewPage?.last}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </nav>
        </div>
      </div>

      {/* 추천 도서 */}
      <div ref={meetingRef} id="meetingSection" className="mt-12">
        <h2 className="text-lg font-bold mb-4">📚 이 책을 주제로 한 모임</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((id) => (
            <div key={id} className="border rounded-xl p-4 shadow-sm">
              <img
                src="https://source.unsplash.com/300x180/?book"
                alt=""
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <div className="text-sm font-semibold">함께 읽는 독서모임</div>
              <div className="text-gray-500 text-xs">
                2025.06.14 ~ 2025.07.14
              </div>
              <button className="mt-2 bg-[#006989] text-white px-3 py-1 rounded-md text-xs font-semibold">
                참여하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 이 책이 인생책인 회원 */}
      <div ref={lifeBookRef} id="lifeBookSection" className="mt-12">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <HeartIcon className="w-6 h-6  text-[#E88D67]" /> 이 책이 인생책인
          회원
        </h2>
        <div className="flex gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="text-center">
              <img
                src="https://i.pravatar.cc/60?img=${i}"
                alt="user"
                className="w-16 h-16 rounded-full mx-auto"
              />
              <div className="text-xs mt-1">독서왕</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
