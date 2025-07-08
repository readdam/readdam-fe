import React from 'react';
import { SearchIcon, Calendar } from 'lucide-react';

const SearchFilter = ({
  keyword,
  setKeyword,
  onSearch,
}) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
       <SearchIcon className="w-5 h-5 text-gray-400" />  


    <div className="flex items-center gap-2">
      <div className="flex items-center space-x-4">
            <input
                type="text"
                placeholder="아이디, 닉네임, 이메일, 이름 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
            />
        </div>

      <button 
        onClick={onSearch}
        className="px-6 py-2 bg-[#E88D67] text-white rounded hover:bg-gray-800">
            검색
      </button>
    </div>
    </div>
  );
};

export default SearchFilter;
