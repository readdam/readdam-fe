import { useEffect, useRef, useState } from 'react';
import { StarIcon, HeartIcon, LockIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchBook } from '@api/kakaoApi';
import BookReviewSection from '@components/book/BookReviewSection';
import { checkBookLike, fetchLifeBookUsers, toggleBookLike } from '@api/book';
import { useAxios } from '@hooks/useAxios';
import { url } from '@config/config';
import LibraryModal from '@components/book/LibraryModal';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

export default function BookDetail() {
  const param = useParams();
  const [isLiked, setIsLiked] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['bookDetail', param.isbn],
    queryFn: () =>
      searchBook({
        query: param.isbn.split(' ')[0],
      }),
    enabled: !!param.isbn,
  });

  const isbnParam = decodeURIComponent(param.isbn); // 공백 포함된 ISBN 복원
  const { data: lifeBookUsers, isLoading: isLifeBookLoading } = useQuery({
    queryKey: ['lifeBookUsers', isbnParam],
    queryFn: () => fetchLifeBookUsers({ isbn: isbnParam, axios }),
    enabled: !!isbnParam,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('review');
  const reviewRef = useRef(null);
  const meetingRef = useRef(null);
  const lifeBookRef = useRef(null);
  const axios = useAxios();
  const token = useAtomValue(tokenAtom);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const book = data?.documents.find((doc) => doc.isbn.includes(isbnParam));

  // 좋아요 상태 불러오기
  useEffect(() => {
    if (isbnParam) {
      checkBookLike({ isbn: isbnParam, axios })
        .then((res) => {
          setIsLiked(res.data === true);
        })
        .catch((err) => {
          console.error('좋아요 상태 확인 실패:', err);
        });
    }
  }, [isbnParam]);

  if (isLoading || !data?.documents?.[0]) {
    return (
      <div className="text-center py-10 text-gray-500">로딩 중입니다...</div>
    );
  }

  // 좋아요 토글 함수
  const handleToggleLike = async () => {
    try {
      const res = await toggleBookLike({ isbn: isbnParam, axios });
      if (res.status === 200) {
        setIsLiked((prev) => !prev);
      }
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      alert('로그인이 필요합니다.');
    }
  };

  return (
    <>
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
          <div className="flex-1 relative">
            <HeartIcon
              className={`w-6 h-6 ${
                isLiked ? 'fill-[#E88D67] text-[#E88D67]' : 'text-gray-400'
              } absolute top-2 right-2`}
              onClick={() => handleToggleLike()}
            />
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
              onClick={() => {
                if (!token?.access_token) {
                  alert('로그인이 필요한 서비스입니다.');
                  return navigate('/login');
                }
                setIsModalOpen(!isModalOpen);
              }}
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
        </div>
        <BookReviewSection isbn={isbnParam} />

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

          {isLifeBookLoading ? (
            <div className="text-gray-400 text-sm">불러오는 중...</div>
          ) : lifeBookUsers?.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex gap-6 flex-nowrap min-w-max">
                {lifeBookUsers.map((user, i) => (
                  <div key={i} className="text-center shrink-0">
                    <img
                      src={`${url}/image?filename=${
                        user.profileImg?.trim() || 'defaultProfile.jpg'
                      }`}
                      alt={user.nickname}
                      className="w-16 h-16 rounded-full mx-auto object-cover"
                    />
                    <div className="text-xs mt-1">{user.nickname}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              아직 인생책으로 등록한 유저가 없어요.
            </div>
          )}
        </div>
      </div>
      <LibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        book={{
          isbn: isbnParam,
          title: book.title,
          author: book.authors?.join(', '),
          imageName: book.thumbnail,
          publisher: book.publisher,
          pubDate: book.datetime?.split('T')[0],
        }}
      />
    </>
  );
}
