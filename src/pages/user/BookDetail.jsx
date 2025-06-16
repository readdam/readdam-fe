import React, { useState } from 'react';
import { StarIcon, HeartIcon, LockIcon } from 'lucide-react';

export default function BookDetail() {
  const allReviews = [
    {
      id: 1,
      name: '강강지',
      date: '2025.05.24',
      rating: 5,
      content:
        '아 정말 도움이 되는 내용이었고 앞으로의 삶에 잘 녹여낼 수 있을 것 같다. 아직 안읽었다면 빨리 읽어보기 바란다!',
      avatar: 'https://i.ibb.co/X8xG7VG/dog1.png',
    },
    {
      id: 2,
      name: '독서광',
      date: '2025.05.21',
      rating: 4,
      content:
        '책이 정말 인상 깊었어요. 특히 인간관계에 대한 통찰이 놀라웠습니다.',
      avatar: 'https://i.ibb.co/SBRM8hH/dog2.png',
    },
    {
      id: 3,
      name: '책사랑',
      date: '2025.05.19',
      rating: 5,
      content: '시간 가는 줄 모르고 읽었습니다. 지인들에게 추천하고 싶네요.',
      avatar: 'https://i.ibb.co/bNzNCKP/dog3.png',
    },
    {
      id: 4,
      name: '리더',
      date: '2025.05.17',
      rating: 3,
      content: '좋은 책이긴 했지만, 기대보다는 평범했어요.',
      avatar: 'https://i.ibb.co/X8xG7VG/dog1.png',
    },
    {
      id: 5,
      name: '생각가',
      date: '2025.05.15',
      rating: 5,
      content: '철학적 관점에서 인생을 다시 바라보게 만든 책입니다.',
      avatar: 'https://i.ibb.co/SBRM8hH/dog2.png',
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = allReviews.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 책 정보 */}
      <div className="flex gap-8">
        <div className="w-80 h-80 flex justify-center items-center bg-[#F6F6F6]">
          <img
            src="https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1467038"
            alt="미움받을 용기"
            className=" h-fit"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">미움받을 용기</h1>
          <p className="text-sm mb-1">저자 기시미 이치로, 고가 후미타케</p>
          <p className="text-sm mb-1">출판 인플루엔셜</p>
          <p className="text-sm mb-2">발행 2014.11.17</p>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">책 리뷰</span>
              <span className="text-sm text-[#006989] font-bold">1,032</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4 ? 'fill-[#E88D67] text-[#E88D67]' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-sm">4.4</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            2014 아마존 일본 ‘종합’ 베스트셀러 1위. &lt;미움받을 용기&gt;는
            아들러 심리학을 바탕으로 하는 책이다. 아들러 심리학에 관한 일본의
            제1인자인 철학자 기시미 이치로의 명 해석과 베스트셀러 작가인 고가
            후미타케의 맛깔스러운 글이 잘 결합되어 새로운 형식을 선보인다.
          </p>

          <button
            className="bg-[#006989] text-white w-24 h-10 rounded-lg text-xs font-bold cursor-pointer"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            서재에 담기
          </button>
        </div>
      </div>

      {/* 리뷰 작성 */}
      <div className="mt-10">
        <div className="border-b border-gray-300 mb-4 flex gap-6 text-sm">
          <button className="font-semibold border-b-2 border-[#005C78] pb-1 cursor-pointer text-[#005C78]">
            리뷰(1,032)
          </button>
          <button className="text-gray-500">모임</button>
          <button className="text-gray-500">인생책</button>
        </div>

        <div className="mb-4">
          <span className="text-sm">평점</span>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-[#E88D67]" />
            ))}
          </div>
          <span className="text-sm">내용</span>
          <textarea
            className="w-full border rounded-md p-3 text-sm resize-none h-24"
            placeholder="리뷰를 입력해주세요"
          />
          <button className="mt-2 bg-[#006989] text-white px-4 py-2 rounded-md text-sm font-semibold">
            리뷰 작성
          </button>
        </div>

        {/* 리뷰 목록 */}

        <div className="space-y-6">
          {currentReviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <img
                src={review.avatar}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {review.name}
                  <span className="text-xs font-normal text-gray-500">
                    | {review.date}
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
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            {[...Array(Math.ceil(allReviews.length / reviewsPerPage))].map(
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 text-sm rounded border ${
                    currentPage === i + 1
                      ? 'bg-[#006989] text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLast >= allReviews.length}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </nav>
        </div>
      </div>

      {/* 추천 도서 */}
      <div className="mt-12">
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
      <div className="mt-12">
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
