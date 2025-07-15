import React, { useEffect, useState } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAtom } from "jotai";
import { tokenAtom } from "../../atoms";
import axios from "axios";
import ClassCard from "../../components/class/ClassCard";
import { url } from "../../config/config";

const ClassList = () => {
  const [token] = useAtom(tokenAtom);
  const [classList, setClassList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const pageSize = 8;
  const [hasSearched, setHasSearched] = useState(false);
  const [venueFilter, setVenueFilter] = useState("전체");
  const [tags, setTags] = useState("");
  const [place, setPlace] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  // const [keyword, setKeyword] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const keywordParam = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(keywordParam);
  const [searchTerm, setSearchTerm] = useState(keywordParam);

  const navigate = useNavigate();

  const fetchClassList = async (customPage = page) => {
    try {
      const res = await axios.get(`${url}/api/classList`, {
        params: {
          page: customPage,
          size: pageSize,
          keyword: keyword || "",
          tag: tags || "",
          place: place || "",
          sort: sortBy || "latest",
        },
      });
      const classes = res?.data?.content || [];

      if (customPage === 0) {
        // 첫 페이지이면 새로 설정
        setClassList(classes);
      } else {
        // 이후 페이지는 누적
        setClassList((prev) => [...prev, ...classes]);
      }

      setHasNext(!res.data.last); // Slice 리턴 구조 기준
      setPage(customPage + 1);
    } catch (err) {
      console.error("리스트 불러오기에 실패했습니다: ", err);
    }
  };

  useEffect(() => {
    // 정렬이나 검색어가 바뀌었을 때 리스트를 초기화하고 다시 가져오기
    setClassList([]);
    setPage(0);
    setHasNext(true);
    fetchClassList();
  }, [keyword, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색을 위한 상태 초기화
    setClassList([]); // 이전 결과 초기화
    setPage(0);
    setHasSearched(true);
    setKeyword(searchTerm); // 검색어 상태 업데이트
  };

  const handleSortChange = (newSort) => {
    if (sortBy !== newSort) {
      setSortBy(newSort);
      setClassList([]);
      setPage(0);
      setHasSearched(false);
      fetchClassList(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <main className="container mx-auto px-4 py-8">
        {/* ⭐ 상단 타이틀 + 안내문구 + 버튼 */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006989] mb-4">
              전체 모임
            </h1>
            <p className="text-gray-600">
              취향에 맞는 독서모임을 찾아보세요. 없다면 직접 개설해보세요!
            </p>
          </div>
          <button
            onClick={() => {
              if (!token?.access_token) {
                alert("로그인이 필요한 서비스입니다.");
                navigate("/login");
                return;
              }
              navigate("/classCreate");
            }}
            className={`flex items-center px-6 py-2.5 rounded-lg transition-colors bg-[#006989] text-white hover:bg-[#005C78]}`}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            모임 만들기
          </button>
        </div>

        {/* ⭐ 검색 영역 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* ⭐ 원본 주석 유지 */}
            {/* <select
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
            >
              <option value="전체">모든 장소</option>
              <option value="읽담">읽담에서 모임</option>
              <option value="타 장소">타 장소 모임</option>
            </select> */}
            <div className="flex-grow relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="모임 이름, 관심 있는 키워드로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006989]" // ⭐ 변경됨
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </form>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:opacity-90" // ⭐ 변경됨
            >
              검색
            </button>
          </div>

          {/* ⭐ 정렬칩 (검색칩) */}
          <div className="flex justify-end gap-2 mt-8 mb-8">
            <button
              className={`px-3 py-1 text-sm rounded border ${
                sortBy === "latest"
                  ? "bg-[#006989] text-white"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleSortChange("latest")}
            >
              최신순
            </button>
            <button
              className={`px-3 py-1 text-sm rounded border ${
                sortBy === "deadline"
                  ? "bg-[#006989] text-white"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleSortChange("deadline")}
            >
              마감 임박 순
            </button>
            <button
              className={`px-3 py-1 text-sm rounded border ${
                sortBy === "likes"
                  ? "bg-[#006989] text-white"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleSortChange("likes")}
            >
              좋아요 순
            </button>
            {/* <button
              className={`px-3 py-1 text-sm rounded border ${
                sortBy === "distance"
                  ? "bg-[#006989] text-white"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleSortChange("distance")}
            >
              모임장소 가까운 순
            </button> */}
          </div>
        </div>

        {hasSearched && (
          <p className="text-gray-600 mb-4">
            모임 카테고리에서 '{searchTerm}' 검색 결과입니다. (검색결과{" "}
            {classList.length}건)
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classList.map((group) => (
            <ClassCard key={group.classId} group={group} />
          ))}
        </div>
        {hasNext && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                fetchClassList(page);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              더보기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClassList;
