import React from "react";
import { SearchIcon, Calendar } from "lucide-react";

const SearchFilter = ({ keyword, setKeyword, onSearch }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="아이디, 닉네임, 이메일, 이름 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="min-w-[800px] pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <button
          onClick={onSearch}
          className="px-6 py-2 bg-[#E88D67] text-white rounded hover:bg-gray-800"
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
