import { useRef, useState } from 'react';
import { StarIcon, HeartIcon, LockIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchBook } from '@api/kakaoApi';
import BookReviewSection from '@components/book/BookReviewSection';

export default function BookDetail() {
  const param = useParams();
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

  const [activeTab, setActiveTab] = useState('review');
  const reviewRef = useRef(null);
  const meetingRef = useRef(null);
  const lifeBookRef = useRef(null);

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
        <BookReviewSection isbn={isbnParam} />
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
