import React, { useEffect, useState } from 'react'
import { url } from '../../config/config';
import { Link } from 'react-router-dom';
import WriteCard from '@components/write/WriteCard';

  const HomeWrite = () => {
    const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchLatestWrites = async () => {
      try {
        const res = await fetch(`${url}/writes?limit=4`)
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
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">최신 글 모아보기</h2>
        <p className="text-center text-gray-600 mb-8">글을 공유하고 첨삭 받을 수 있어요.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Link to={`/writeDetail/${post.writeId}`} key={post.writeId}>
              <WriteCard post={post} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeWrite;