import React from 'react';
import { BellIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from "../atoms";

export function AdminHeader() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const handleLogout = () => {
    sessionStorage.clear();  // 모든 세션 제거
    localStorage.removeItem("token"); //자동로그인 정보 제거
    localStorage.removeItem("user"); //자동로그인 정보 제거
    setToken(null);
    setUser(null);

    // 로그아웃 후 메인페이지로 이동
    navigate('/');
  };

  // 메인페이지 이동 핸들러
  const goToMain = () => {
    navigate('/');
  };

  return (<header className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold">읽담 관리자</div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToMain}
            className="bg-[#006989] text-white px-3 py-1 rounded hover:bg-[#d87956] transition-colors"
          >
            메인페이지로
          </button>
          
          {/* <button className="relative p-1 rounded-full hover:bg-gray-700">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 bg-[#E88D67] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button> */}

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleLogout}
              className="p-1 rounded hover:bg-red-500 hover:shadow transition-all"
              title="로그아웃">
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
