// src/pages/admin/AdminEventJoinedList.jsx
import React, { useState, useEffect } from "react";
import { HomeIcon, SearchIcon } from "lucide-react";
import { useAxios } from "../../hooks/useAxios";

const AdminEventJoinedList = () => {
  const axios = useAxios();
  const [activePage] = useState("이벤트 참여 내역");

  // 연·월 드롭다운 옵션
  const now = new Date();
  const defaultYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [yearMonths, setYearMonths] = useState([]);
  const [selectedYM, setSelectedYM] = useState(defaultYM);

  // 정렬 기준
  const [sortBy, setSortBy] = useState("date");
  // 페이지, 페이지당 사이즈, 총 페이지
  const [page, setPage] = useState(1);
  const size = 20;
  const [totalPages, setTotalPages] = useState(1);

  // 실제 조회된 데이터
  const [participations, setParticipations] = useState([]);

  // 1) 마운트 시 연·월 목록만 로드
  useEffect(() => {
    axios
      .get("/admin/events/year-months")
      .then(res => setYearMonths(res.data))
      .catch(() => setYearMonths([defaultYM]));
  }, [axios, defaultYM]);

  // 2) 페이지 진입 시 자동으로 이번 달 1페이지 조회
  useEffect(() => {
    fetchData(selectedYM, sortBy, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) 조회 / 정렬 / 페이지 이동 함수
  const fetchData = (ym, sort, pageNum) => {
    axios
      .get("/admin/events/participations", {
        params: { yearMonth: ym, sortBy: sort, page: pageNum, size }
      })
      .then(res => {
        setParticipations(res.data.content);
        setTotalPages(res.data.pageInfo.totalPages);
        setPage(pageNum);
      })
      .catch(console.error);
  };

  const handleSearch = () => {
    fetchData(selectedYM, sortBy, 1);
  };

  const handleSort = key => {
    setSortBy(key);
    fetchData(selectedYM, key, 1);
  };

  const goTo = p => {
    if (p < 1 || p > totalPages) return;
    fetchData(selectedYM, sortBy, p);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-6xl mx-auto">
        <main className="flex-1 p-6">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>이벤트</span>
            <span>&gt;</span>
            <span>{activePage}</span>
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{activePage}</h2>

          {/* 필터 & 정렬 & 조회 */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6 flex items-center">
            <div className="flex items-center space-x-4">
              <select
                value={selectedYM}
                onChange={e => setSelectedYM(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
              >
                {yearMonths.map(ym => (
                  <option key={ym} value={ym}>
                    {`${ym.slice(0, 4)}년 ${ym.slice(5)}월`}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleSort("date")}
                className={`px-3 py-1 rounded ${
                  sortBy === "date"
                    ? "bg-[#006989] text-white"
                    : "border border-gray-300"
                }`}
              >
                일자순
              </button>
              <button
                type="button"
                onClick={() => handleSort("likes")}
                className={`px-3 py-1 rounded ${
                  sortBy === "likes"
                    ? "bg-[#006989] text-white"
                    : "border border-gray-300"
                }`}
              >
                좋아요순
              </button>
            </div>
            <div className="ml-auto">
              <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] flex items-center"
              >
                <SearchIcon className="w-4 h-4 mr-1" />
                조회
              </button>
            </div>
          </div>

          {/* 테이블 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold">참여 내역</h3>
              <span className="text-sm text-gray-600">총 {participations.length}건</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F3F7EC]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      사용자명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      참여 내용
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      등록일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      좋아요
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participations.map(item => (
                    <tr key={item.writeshortId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                        {item.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.regDate.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.likes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이징 */}
          <div className="flex justify-center space-x-2 mb-8">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`px-3 py-1 border rounded ${
                  p === page ? "bg-[#006989] text-white" : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              다음
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEventJoinedList;
