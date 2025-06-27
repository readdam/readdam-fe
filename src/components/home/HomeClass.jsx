import React from 'react'
import { Link } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, UsersIcon } from 'lucide-react'
const HomeClass = () => {
  const groups = [
    {
      id: 1,
      title: '에세이로 만나는 일상의 소소함',
      date: '2025.06.11',
      location: '서울 강남구',
      image:
        'https://images.unsplash.com/photo-1506880135364-e28660dc35fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      theme: '에세이',
    },
    {
      id: 2,
      title: '심리학 명저 함께 읽기',
      date: '2025.06.11',
      location: '서울 마포구',
      image:
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      theme: '심리',
    },
    {
      id: 3,
      title: '자기계발 북클럽',
      date: '2025.06.11',
      location: '서울 서초구',
      image:
        'https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      theme: '자기계발',
    },
    {
      id: 4,
      title: '고전문학 깊게 읽기',
      date: '2025.06.11',
      location: '서울 종로구',
      image:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      theme: '문학',
    },
  ]
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

        {/* ✅ 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="inline-block px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full mb-2">
                  {group.theme}
                </span>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {group.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{group.date}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{group.location}</span>
                </div>
                <button className="w-full px-4 py-2 bg-[#005C78] text-white rounded-lg hover:bg-[#004a61] transition-colors flex items-center justify-center">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  <span>참여하기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeClass
