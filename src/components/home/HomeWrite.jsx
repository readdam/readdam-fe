import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import WriteCard from '@components/write/WriteCard';
import { useAxios } from '@hooks/useAxios';

  const HomeWrite = () => {
    const axios = useAxios();
    const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchLatestWrites = async () => {
      try {
        const res = await axios.get('/writes', {
          params: { limit: 4 },
        });
        setPosts(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatestWrites();
  }, [axios]);

   return (
    <section className="w-full py-16 bg-[#F3F7EC]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          <span role="img" aria-label="memo">✍️</span> 함께 쓰고, 첨삭으로 더 나아져요!
        </h2>
        <Link
          to="/writeList"
          className="text-sm text-center block text-gray-500 underline hover:text-[#006989] mb-8"
        >
          전체 글 보러가기
        </Link>

        {posts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            등록된 글이 없습니다. 첫 게시글의 주인공이 되어보세요.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Link to={`/writeDetail/${post.writeId}`} key={post.writeId}>
              <WriteCard post={post} />
            </Link>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default HomeWrite;