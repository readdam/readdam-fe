import { useEffect, useState } from 'react';
import { getClassesByBook } from '@api/book';
import { createAxios } from '@config/config';

const BookClassList = ({ title, authors }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const author = authors?.[0];

  useEffect(() => {
    if (!title || !author) return;

    const fetchClasses = async () => {
      try {
        const data = await getClassesByBook({
          title,
          author,
          axios: createAxios(),
        });
        setClasses(data);
      } catch (err) {
        console.error('모임 조회 실패', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [title, author]);

  if (loading) return <div>모임을 불러오는 중...</div>;

  return (
    <div className="mt-12" id="meetingSection">
      <h2 className="text-lg font-bold mb-4">📚 이 책으로 진행되는 모임</h2>

      {classes.length === 0 ? (
        <div className="text-sm text-gray-500">
          이 책으로 등록된 모임이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((c) => (
            <div key={c.classId} className="border rounded-xl p-4 shadow-sm">
              <img
                src={c.imageUrl || 'https://source.unsplash.com/300x180/?book'}
                alt={c.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <div className="text-sm font-semibold text-[#006989]">
                {c.title}
              </div>
              <div className="text-gray-500 text-xs">
                {c.round1Date?.replace(/-/g, '.')} ~{' '}
                {c.roundEndDate?.replace(/-/g, '.')}
              </div>
              <p className="text-xs text-gray-600 mt-1">{c.shortIntro}</p>
              <button className="mt-2 bg-[#006989] text-white px-3 py-1 rounded-md text-xs font-semibold">
                참여하기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookClassList;
