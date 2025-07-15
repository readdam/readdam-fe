import { useEffect, useState } from 'react';
import { getClassesByBook } from '@api/book';
import { createAxios } from '@config/config';
import ClassCard from '@components/class/ClassCard';

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
        <>
          {classes.length === 0 ? (
            <div className="text-sm text-gray-500">
              이 책으로 등록된 모임이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((group) => (
                <ClassCard key={group.classId} group={group} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookClassList;
