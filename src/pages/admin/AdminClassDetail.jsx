import React, { useState } from 'react'
import {
  ChevronLeftIcon,
  StarIcon,
  UsersIcon,
  MessageCircleIcon,
  CalendarIcon,
  SearchIcon,
  AlertTriangleIcon,
  MapPinIcon,
  BookIcon,
  ClockIcon,
} from 'lucide-react'
const AdminClassDetail = () => {
  const [activeTab, setActiveTab] = useState('info')
  const [searchTerm, setSearchTerm] = useState('')
  const groupData = {
    id: 1,
    name: '첫 번째 모임',
    status: '진행 중',
    creator: 'user1',
    createdAt: '2023-01-01',
    reviewCount: 5,
    memberCount: 10,
    maxMembers: 15,
    period: '2023-02-10-30',
  }
  const memberList = [
    {
      id: 'UserA',
      name: '홍길동',
      joinDate: '2023-01-10',
      role: '작성 권한',
      status: '정상',
      hasReview: true,
    },
    {
      id: 'user2',
      name: '김빛수',
      joinDate: '2023-01-15',
      role: '미작성',
      status: '정상',
      hasReview: false,
    },
  ]
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <button className="flex items-center text-gray-600 hover:text-[#006989] transition-colors">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          모임 리스트로 돌아가기
        </button>
      </div>
      {/* Top Summary Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full">
                {groupData.type}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {groupData.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {groupData.name}
            </h1>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <BookIcon className="w-4 h-4 text-[#E88D67]" />
                <span>카테고리: {groupData.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-[#E88D67]" />
                <span>
                  참여인원: {groupData.memberCount}/{groupData.maxMembers}명
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#E88D67]" />
                <span>개설일: {groupData.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4 text-[#E88D67]" />
                <span>
                  평점: {groupData.rating} ({groupData.reviewCount}개 리뷰)
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#F3F7EC] text-[#006989] rounded-lg hover:bg-[#E88D67] hover:text-white transition-colors shadow-md">
              모임정보 수정
            </button>
            <button className="px-4 py-2 bg-[#F3F7EC] text-[#006989] rounded-lg hover:bg-[#005C78] hover:text-white transition-colors shadow-md">
              모임 비활성화
            </button>
            <button className="px-4 py-2 bg-[#E88D67] text-white rounded-lg hover:bg-[#005C78] transition-colors shadow-md">
              모집 중지
            </button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
       
        <div className="p-6">
          {/* Search Bar */}
          {['members', 'reviews'].includes(activeTab) && (
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          )}
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      이름
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      아이디
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      참여일
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      후기작성
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memberList.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{member.name}</td>
                      <td className="py-3 px-4">{member.id}</td>
                      <td className="py-3 px-4">{member.joinDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${member.hasReview ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-[#F3F7EC] text-[#006989] rounded-full text-xs font-medium">
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
export default AdminClassDetail;
