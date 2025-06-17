import React, { useState } from 'react'
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from 'lucide-react'
const AdminClassList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  // Dummy data
  const groups = [
    {
      id: 1,
      name: '철학 고전 읽기 모임',
      creator: '책벌레123',
      createdAt: '2024-03-15',
      startDate: '2024-04-01',
      status: '모집중',
    },
    {
      id: 2,
      name: '현대시 깊이 읽기',
      creator: '시인의마음',
      createdAt: '2024-03-10',
      startDate: '2024-03-20',
      status: '진행중',
    },
    {
      id: 3,
      name: '영어 원서 독파 스터디',
      creator: '영문학도',
      createdAt: '2024-02-15',
      startDate: '2024-03-01',
      status: '진행중',
    },
    {
      id: 4,
      name: '소설 창작 워크샵',
      creator: '글쓰는밤',
      createdAt: '2024-01-20',
      startDate: '2024-02-01',
      status: '종료',
    },
    {
      id: 5,
      name: '에세이 리딩 클럽',
      creator: '감성수채화',
      createdAt: '2024-03-01',
      startDate: '2024-03-15',
      status: '모집중',
    },
  ]
  const getStatusColor = (status) => {
    switch (status) {
      case '모집중':
        return 'bg-blue-100 text-blue-800'
      case '진행중':
        return 'bg-green-100 text-green-800'
      case '종료':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  return (
    <div className="flex h-screen bg-gray-100">
       
        {/* Main Content Area */}
        <main className="p-8 overflow-auto h-[calc(100vh-64px)]">
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-4 gap-4">
              {/* Search */}
              <div className="col-span-2 relative">
                <input
                  type="text"
                  placeholder="모임명, 개설자 이름 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
              >
                <option value="all">전체 상태</option>
                <option value="recruiting">모집중</option>
                <option value="in_progress">진행중</option>
                <option value="completed">종료</option>
              </select>
              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
              >
                <option value="all">전체 기간</option>
                <option value="week">최근 일주일</option>
                <option value="three_months">최근 3개월</option>
                <option value="six_months">최근 6개월</option>
              </select>
              {/* Search Button */}
              <div className="col-span-4 flex justify-end">
                <button className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:bg-opacity-90 transition-colors">
                  검색
                </button>
              </div>
            </div>
          </div>
          {/* Groups Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    No.
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    모임명
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    개설자
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    모임글 작성일
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    모임 시작일
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    진행 상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/adminClassDetail/${group.id}`
                    }}
                  >
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {group.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {group.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {group.creator}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {group.createdAt}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {group.startDate}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}
                      >
                        {group.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Total Count */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                총 <span className="font-medium">{groups.length}</span>개의
                모임이 있습니다
              </p>
            </div>
            {/* Pagination */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
              <nav className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-[#006989] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </main>
    </div>
  );
};
export default AdminClassList;
