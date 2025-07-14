import React, { useState, useEffect } from "react";
import { useAxios } from "../../hooks/useAxios";
import { HomeIcon } from "lucide-react";
import { url } from "../../config/config";
import SearchFilter from "../../components/admin/user/SearchFilter";
import Pagination from "../../components/admin/user/Pagination";
import UserTable from "../../components/admin/user/UserTable";
import AdminUserModal from "@components/admin/user/AdminUserModal";

const AdminUserList = () => {
  const axios = useAxios();

  // 검색어 & 페이징 상태
  const [keyword, setKeyword] = useState("");
  const [members, setMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // 조회된 user의 수
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  // 회원 조회 함수
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

  // 검색 버튼
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  // 페이지 변경시 자동 조회
  useEffect(() => {
    if (page !== 1) {
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
            <div className="flex gap-4 mb-6">
              <SearchFilter
                keyword={keyword}
                setKeyword={setKeyword}
                onSearch={handleSearch}
              />
            </div>

            {/* 조회 결과(테이블) 영역 */}
            {members?.length > 0 && (
              <>
                <div className="bg-white rounded-lg shadow min-w-[800px]">
                  <p className="text-sm text-gray-700">
                    총 {totalCount}명의 회원이 검색됐습니다.
                  </p>
                  <UserTable members={members} />
                </div>

                {/* 페이지네이션 */}
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={page}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminUserList;
