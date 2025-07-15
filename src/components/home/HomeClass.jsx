import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useAxios } from '../../hooks/useAxios';
import { url } from '../../config/config';
import ClassCard from '@components/class/ClassCard';

const HomeClass = () => {
  const axios = useAxios();
  const [groups, setGroups] = useState([]);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        let params = {
          limit: 4,
        };

      if (user?.lat !== undefined && user?.lng !== undefined) {
        if (user.lat != null && user.lng != null) {
          // 로그인했고 좌표 있는 경우 → 거리순
          params.sort = 'distance';
          params.lat = user.lat;
          params.lng = user.lng;
        } else {
          // 로그인했지만 좌표 없는 경우 → 최신순
          params.sort = 'latest';
        }
      } else {
        // user 자체가 아직 undefined → 무조건 latest
        params.sort = 'latest';
      }

      const res = await axios.get('/classes', { params });
      setGroups(res.data);
    } catch (err) {
      console.error('모임 데이터를 불러오지 못했습니다.', err);
      setGroups([]);
    }
  };

    fetchClasses();
  }, [user?.lat, user?.lng, axios]);

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* ✅ 상단 타이틀 + 링크 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            <span role="img" aria-label="books">📚</span> 
            {user?.lat && user?.lng
              ? '내 근처 독서모임을 찾아보세요!'
              : '최근 등록된 독서모임을 찾아보세요!'}
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
