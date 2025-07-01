import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, UsersIcon } from 'lucide-react'
import { useAxios } from '../../hooks/useAxios';

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
            <div
              key={group.classId}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={group.mainImg}
                  alt={group.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="inline-block px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full mb-2">
                  {group.tag1}
                </span>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {group.title} 
                </h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{group.round1Date }</span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{group.round1PlaceName}</span>
                </div>
                <button className="w-full px-4 py-2 bg-[#005C78] text-white rounded-lg hover:bg-[#004a61] transition-colors flex items-center justify-center">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  <span>참여하기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default HomeClass
