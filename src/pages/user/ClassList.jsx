import React, { useEffect, useState } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [venueFilter, setVenueFilter] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [tags, setTags] = useState("");
  const [place, setPlace] = useState("");
  const [sortBy, setSortBy] = useState("latest");

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
          sort: sortBy || 'latest',
        },
      });
      const classes = res?.data?.content || [];
      
      if(customPage === 0) {
        // 첫 페이지이면 새로 설정
        setClassList(classes);
      }else {
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
    if(sortBy !== newSort) {
      setSortBy(newSort);
      setClassList([]);
      setPage(0);
      setHasSearched(false);
      fetchClassList(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F7EC]">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">전체 모임</h1>
          <button
            onClick={() => {
              if (!token?.access_token) {
                alert("로그인이 필요한 서비스입니다.");
                navigate("/login");
                return;
              }
              navigate("/classCreate");
            }}
            className="px-6 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            모임 만들기
          </button>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
            >
              <option value="전체">모든 장소</option>
              <option value="읽담">읽담에서 모임</option>
              <option value="타 장소">타 장소 모임</option>
            </select>
            <div className="flex gap-2">
               <button
                className={`px-4 py-2 rounded-full ${
                  sortBy === "latest"
                    ? "bg-[#006989] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleSortChange("latest")}
              >
                최신순
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  sortBy === "deadline"
                    ? "bg-[#006989] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleSortChange("deadline")}
              >
                마감 임박 순
              </button>
              {/* <button
                className={`px-4 py-2 rounded-full ${
                  sortBy === "start"
                    ? "bg-[#006989] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSortBy("start")}
              >
                빠른 시작 순
              </button> */}
              <button
                className={`px-4 py-2 rounded-full ${
                  sortBy === "likes"
                    ? "bg-[#006989] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleSortChange("likes")}
              >
                좋아요 순
              </button>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="모임 이름, 관심 있는 키워드로 검색"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
        {hasSearched && (
          <p className="text-gray-600 mb-4">
            모임 카테고리에서 '{searchTerm}' 검색 결과입니다. (검색결과 {classList.length}건)
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
