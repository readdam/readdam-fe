import React, { useEffect, useState } from 'react'
import { url } from '../../config/config';
import { Link } from 'react-router-dom';
import {
  ThumbsUpIcon,
  MessageSquareIcon,
  EyeIcon,
  BookOpenIcon,
  ClockIcon,
} from 'lucide-react'

const getReviewStatus = (needReview, endDate) => {
  if (!needReview || !endDate) return '첨삭제외'
  return new Date(endDate) > new Date() ? '첨삭가능' : '첨삭종료'
}

const typeMap = {
  bookreview: '독후감',
  essay: '수필',
  personal: '자기소개서',
  assignment: '과제',
  other: '기타',
};

const HomeWrite = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchLatestWrites = async () => {
      try {
        const res = await fetch(`${url}/writes?limit=4`)
        // const text = await res.text();
        // console.log('서버 응답:', text);
        if (!res.ok) throw new Error('글 불러오기 실패')
          //응답 본문을 JSON 형태로 변환 (res.json()은 비동기 작업이므로 await 필요)
        const data = await res.json()
        setPosts(data)
      } catch (e) {
        console.error(e)
      }
    }
    // 컴포넌트 마운트 시 1회 실행
    fetchLatestWrites()
  }, [])

   return (
    <section className="w-full py-16 bg-[#F3F7EC]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          최신 글 모아보기
        </h2>
        <p className="text-center text-gray-600 mb-8">
          글을 공유하고 첨삭 받을 수 있어요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            
            <Link to={`writeDetail/${post.writeId}`} key={post.writeId}> {/* 상세 페이지 링크 추가 */}
            <div className="bg-white rounded-lg p-4 flex gap-4 hover:shadow-sm transition-shadow"
            >
              {post.img ? (
                <img
                  src={`${url}/image?filename=${post.img}`} 
                  alt=""
                  className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-48 h-48 bg-[#F3D5C9] rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="w-12 h-12 text-[#E88D67]" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 text-sm rounded-full bg-[#F3F7EC] text-[#006989]">
                    {typeMap[post.type]}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-[#FDF3F0] text-[#E88D67]">
                    {getReviewStatus(post.needReview, post.endDate)}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2">{post.title}</h3>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium text-[#006989]">
                    {post.username?.nickname}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{post.regDate?.slice(0, 10)}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUpIcon className="w-4 h-4 text-[#E88D67]" />
                    {post.likeCnt || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquareIcon className="w-4 h-4 text-[#006989]" />
                    {post.commentCnt || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {post.viewCnt || 0}
                  </div>
                  {post.needReview && post.endDate && (
                    <div className="flex items-center gap-1 ml-auto">
                      <ClockIcon className="w-4 h-4" />
                      <span>{post.endDate.slice(0, 10)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeWrite