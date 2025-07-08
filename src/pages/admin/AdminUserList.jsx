import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, HomeIcon } from "lucide-react";
import { url } from "@config/config";
import SearchFilter from "@components/admin/user/SearchFilter";
import Pagination from "@components/admin/user/Pagination";
import UserTable from "@components/admin/user/UserTable";

const AdminUserList = () => {
  const [keyword, setKeyword] = useState("");

  const [members, setMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/admin/userList`, {
        params: {
          keyword,
          page,
          size: pageSize,
        },
      });
      console.log(response.data);
      setMembers(response.data.users);
      setTotalCount(response.data.users.length);
    } catch (err) {
      console.error("회원조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchMembers();
  }

  useEffect(()=> {
    if(page !== 1) {
      fetchMembers();
    }
  }, [page]);

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

          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">회원 조회</h2>
            </div>

            {/* 검색 영역 */}
            <SearchFilter 
              keyword = {keyword}
              setKeyword = {setKeyword}
              onSearch = {handleSearch}
            />
            { members?.length > 0 && (
              <>
                <p>총 {totalCount}명의 회원이 검색됐습니다.</p>
                <UserTable members={members} />

                <Pagination
                  currentPage = {page}
                  totalCount = {totalCount}
                  pageSize = {pageSize}
                  onPageChange = {setPage}
                />
              </>
            )}
          </div>

            {/* 페이지네이션 */}
            {/* <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
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
          </div> */}
        </main>
      </div>
    </div>
  );
};
export default AdminUserList;
