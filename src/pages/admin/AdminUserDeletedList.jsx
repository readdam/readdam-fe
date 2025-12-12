import React, { useState } from 'react'
import {
  SearchIcon,
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  MessageSquareIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileTextIcon,
} from 'lucide-react'

const AdminUserDeletedList = () => {
  const [activeTab, setActiveTab] = useState('전체 회원')
  const [searchCondition, setSearchCondition] = useState('전체')
  const [activeMenu, setActiveMenu] = useState('회원관리')

  // 더미 회원 데이터
  const members = [
    {
      username: 1,
      name: '김탈퇴',
      nickname: 'user1',
      email: 'user1@example.com',
      joinDate: '2023-05-15',
      withdrawalDate: '2025-02-01'
    },
    {
      username: 2,
      name: '이삭제',
      nickname: 'reader2',
      email: 'reader2@example.com',
      joinDate: '2023-04-22',
      withdrawalDate: '2025-03-01'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <main className="flex-1 p-6">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>회원</span>
            <span>〉</span>
            <span>탈퇴 회원</span>
          </div>

          {/* 검색 영역 */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">탈퇴 회원</h2>
              
            </div>
           
            {/* 검색 필터 */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-4">
                <SearchIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색어 입력"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">검색 조건</label>
                <select
                  value={searchCondition}
                  onChange={(e) => setSearchCondition(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2C5F5F]"
                >
                  <option>전체</option>
                  <option>이름</option>
                  <option>아이디</option>
                  <option>이메일</option>
                </select>
              </div>
              <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
                검색
              </button>
            </div>
          </div>

          {/* 회원 목록 테이블 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회원번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    닉네임
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    탈퇴일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.nickname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.withdrawalDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                총 5명의 회원이 있습니다.
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  이전
                </button>
                <button className="px-3 py-1 bg-black text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  다음
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
export default AdminUserDeletedList;
