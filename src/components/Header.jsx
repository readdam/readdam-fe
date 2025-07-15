import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from "../atoms";
import { SearchIcon, BookOpenIcon, MapPinIcon } from 'lucide-react';
import { Link, useNavigate  } from 'react-router-dom';
import { useAxios } from "../hooks/useAxios";
import { useEffect, useState } from 'react';

const Header = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const axios = useAxios();
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin === true;
  const [address, setAddress] = useState('');

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken({ access_token: '', refresh_token: '' });
    setUser(null);
    setAddress('');
    navigate('/');

  };  
  const handleUpdateLocation = () => {
    if (!token || !user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        axios
          .put("/user/location", {
            latitude,
            longitude,
          })
          .then((res) => {
            setUser(res.data);
            alert("위치가 갱신되었어요! 😊");
          })
          .catch((err) => {
            const msg =
              err.response?.data ||
              "위치 저장에 실패했어요 😥";
            alert(msg);
            console.error(err);
          });
      },
      (err) => {
        alert("위치 정보를 가져올 수 없어요 😥");
        console.error(err);
      }
    );
  };

  useEffect(() => {
    if (!token || !user) {
      return;
    }
    if (user?.lat && user?.lng) {
      axios
        .get('/user/location-address')
        .then((res) => {
          setAddress(res.data.address);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user?.lat, user?.lng, token]);

    const handleSearch = () => {
    if (searchKeyword.trim() !== '') {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      setSearchKeyword('');
    }
  };

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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                placeholder="모임, 장소, 책 검색하세요"
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-[#E88D67] rounded-lg focus:outline-none focus:border-[#E88D67]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
              onClick={handleSearch} />
            </div>
          </div>

          {/* 로그인 상태에 따른 버튼 */}
          <div className="flex items-center space-x-2">
            <button 
            onClick={handleUpdateLocation}
            className="px-3 py-1.5 text-sm text-[#006989] hover:text-[#005C78] flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />내 위치
            </button>
            {address && (
              <span className="text-sm text-gray-500">
                : {address}
              </span>
            )}

            {token && user && (user.nickname || user.username) ?  (
              <>
                <span className="text-sm text-[#006989] font-semibold">{user?.nickname ?? user?.username} 님</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm text-white bg-[#006989] rounded hover:bg-[#005C78]"
                >
                  로그아웃
                </button>
                <Link to="/myLibrary" className="px-3 py-1.5 text-sm text-white bg-[#E88D67] rounded hover:opacity-90">
                  마이페이지
                </Link>

                    {/* ✅ 관리자 버튼 */}
                {isAdmin && (
                <Link
                  to="admin/userList"
                  className="px-3 py-1.5 text-sm border border-[#006989] text-[#006989] bg-white rounded hover:bg-gray-50"
                >
                  관리자
                </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-sm text-white bg-[#006989] rounded hover:bg-[#005C78]">
                  로그인
                </Link>
                <Link to="/join" className="px-3 py-1.5 text-sm text-white bg-[#E88D67] rounded hover:opacity-90">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
