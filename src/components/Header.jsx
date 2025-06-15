import { SearchIcon, BookOpenIcon, MapPinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header className="w-full py-4 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="flex items-center">
              <span
                className="text-3xl font-bold"
                style={{
                  color: '#006989',
                  fontFamily: 'sans-serif',
                }}
              >
                읽
              </span>
              <span
                className="text-3xl font-bold"
                style={{
                  color: '#006989',
                  fontFamily: 'sans-serif',
                }}
              >
                담
              </span>
              <BookOpenIcon
                className="h-6 w-6 ml-0.5"
                style={{
                  color: '#E88D67',
                }}
              />
          </Link>
          {/* 메인 메뉴 */}
         <nav className="hidden md:flex items-center space-x-8">
          <Link to="/classList" className="text-gray-600 hover:text-[#006989] font-bold">
            모임
          </Link>
          <Link to="/place" className="text-gray-600 hover:text-[#006989] font-bold">
            장소
          </Link>
          <Link to="/writeList" className="text-gray-600 hover:text-[#006989] font-bold">
            글쓰기
          </Link>
          <Link to="/book" className="text-gray-600 hover:text-[#006989] font-bold">
            책
          </Link>
        </nav>
          {/* 검색창 */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="모임, 장소, 책 검색하세요"
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-[#E88D67] rounded-lg focus:outline-none focus:border-[#E88D67]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          {/* 로그인/회원가입 버튼 */}
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm text-[#006989] hover:text-[#005C78] flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />내 위치
            </button>
            <Link to="/login" className="px-3 py-1.5 text-sm text-white bg-[#006989] rounded hover:bg-[#005C78]">
              로그인
            </Link>
            <Link to="/join" className="px-3 py-1.5 text-sm text-white bg-[#E88D67] rounded hover:opacity-90">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
