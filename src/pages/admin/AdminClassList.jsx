import React, { useEffect, useState } from 'react';
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from 'lucide-react';
import { useAxios } from '@hooks/useAxios';

// statusFilter 변환 함수
const mapStatus = (value) => {
  switch (value) {
    case 'recruiting':
      return '모집중';
    case 'in_progress':
      return '진행중';
    case 'completed':
      return '종료';
    default:
      return null;
  }
};

// periodFilter 변환 함수
const mapPeriod = (value) => {
  switch (value) {
    case 'week':
      return 'week';
    case 'three_months':
      return '3month';
    case 'six_months':
      return '6month';
    default:
      return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case '모집중':
      return 'bg-blue-100 text-blue-800';
    case '진행중':
      return 'bg-green-100 text-green-800';
    case '종료':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminClassList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const axios = useAxios();
  const [groups, setGroups] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchClassList = async () => {
    if (currentPage < 1) return;
    try {
      const params = {
        keyword: searchTerm || '',
        status: mapStatus(statusFilter),
        period: mapPeriod(dateFilter),
        page: currentPage - 1,
        size: 10,
      };

      const res = await axios.get('/admin/classList', { params });
      setGroups(res.data.content);
      setTotal(res.data.pageInfo.totalElements);
      console.log(res);
    } catch (error) {
      console.error('모임 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchClassList(); // 컴포넌트 최초 마운트 시 자동 호출
  }, [currentPage]); // 페이지 변경 시도 자동 호출

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(total / 10)) {
      setCurrentPage(pageNumber);
      fetchClassList(); // 변경된 페이지로 요청
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100">
      {/* Main Content Area */}
      <main className="p-8 overflow-auto max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">모임 관리</h1>
        </div>
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-4 gap-4">
            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchClassList();
              }}
              className="col-span-2 relative"
            >
              <input
                type="text"
                placeholder="모임명, 개설자 이름 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </form>
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
              <button
                className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
                onClick={fetchClassList}
              >
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
                  닉네임
                </th>

                {/* <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                  모임글 작성일
                </th> */}
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
                  key={group.classId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/adminClassDetail/${group.classId}`;
                  }}
                >
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {group.no}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {group.title}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {group.leaderName}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {group.leaderNickname}
                  </td>
                  {/* <td className="px-4 py-4 text-sm text-gray-500">
                    {group.createdAt.split('T')[0]}
                  </td> */}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {group.startDate}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        group.status
                      )}`}
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
              총 <span className="font-medium">{total}</span>개의 모임이
              있습니다
            </p>
          </div>
          {/* Pagination */}
          {total > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
              <nav className="flex items-center gap-2">
                {/* 이전 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`border px-3 py-1 rounded cursor-pointer ${
                    currentPage === 1
                      ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed'
                      : 'hover:bg-gray-50 border-[#e5e7eb] text-gray-700'
                  }`}
                >
                  이전
                </button>

                {/* 페이지 번호 버튼 */}
                {Array.from({ length: Math.ceil(total / 10) }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`px-3 py-1 text-sm border rounded cursor-pointer ${
                        pageNumber === currentPage
                          ? 'bg-[#006989] text-white border-[#006989]'
                          : 'hover:bg-gray-50 border-[#e5e7eb] text-gray-700'
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* 다음 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(total / 10)}
                  className={`border px-3 py-1 rounded cursor-pointer ${
                    currentPage >= Math.ceil(total / 10)
                      ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed'
                      : 'hover:bg-gray-50 border-[#e5e7eb] text-gray-700'
                  }`}
                >
                  다음
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default AdminClassList;
