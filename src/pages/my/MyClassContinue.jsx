import React, { useEffect, useState } from 'react';
import { url } from '@config/config';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import ClassCard from '@components/class/ClassCard';  // 실제 경로에 맞게 조정하세요

const tabs = [
  { label: '참여 중인 모임', path: '/myClassContinue' },
  { label: '참여가 종료된 모임', path: '/myClassEnd' },
  { label: '내가 개설한 모임', path: '/myClassIMade' },
];

const MyClassContinue = () => {
  const location = useLocation();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const { data } = await axios.get(`${url}/classes/my/continue`);
        setClasses(data);
      } catch (error) {
        console.error('내 모임 조회 실패', error);
      }
    };
    fetchMyClasses();
  }, []);

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">나의 모임</h2>

      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.path}
            className={`pb-2 transition-all ${
              location.pathname === tab.path
                ? 'text-black border-b-2 border-blue-500 font-semibold'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* ClassCard 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {classes.map((group) => (
          <ClassCard key={group.classId} group={group} />
        ))}
      </div>
    </div>
  );
};

export default MyClassContinue;
