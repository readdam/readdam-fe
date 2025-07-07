import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, HomeIcon } from "lucide-react";
import { url } from "@config/config";

const AdminUserList = () => {
  const [keyword, setKeyword] = useState("");
  const [dateType, setDateType] = useState("join");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [members, setMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/admin/userList`, {
        params: {
          keyword,
          dateType,
          startDate,
          endDate,
          page,
          size: pageSize,
        },
      });
      setMembers(response.data.members);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      console.error("회원조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <main className="flex-1 p-6">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>회원</span>
            <span>〉</span>
            <span>회원 조회</span>
          </div>

          {/* 검색 영역 */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">회원 조회</h2>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.username} className="hover:bg-gray-50">
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
  );
};
export default AdminUserList;
