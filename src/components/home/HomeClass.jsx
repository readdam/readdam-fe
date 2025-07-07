import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';
import { url } from '../../config/config';
import ClassCard from '@components/class/ClassCard';

const HomeClass = () => {
  const axios = useAxios();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios
      .get('/classes') 
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => {
        console.error('모임 데이터를 불러오지 못했습니다.', err);
      });
  }, []);
   
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* ✅ 상단 타이틀 + 링크 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            <span role="img" aria-label="books">📚</span> 나와 취향이 맞는 독서모임을 찾아보세요!
          </h2>
          <Link
            to="/classList"
            className="text-sm text-gray-500 underline hover:text-[#006989]"
          >
            전체 모임 보러가기
          </Link>
        </div>

      {/* ✅ 카드 그리드 OR 빈 문구 */}
      {groups.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          등록된 모임이 없습니다. 첫 모임을 개설해 보시겠어요?
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <ClassCard key={group.classId} group={group} />
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default HomeClass
