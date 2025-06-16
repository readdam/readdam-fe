import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { jwtDecode } from 'jwt-decode';

const OAuthRedirect = () => {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const hasHandled = useRef(false); // ✅ 중복 실행 방지

  useEffect(() => {
    if (hasHandled.current) return; // ✅ navigate 이후 재실행 방지
    hasHandled.current = true;

    const url = new URL(window.location.href);
    const access_token = url.searchParams.get('access_token');

    console.log('🧭 현재 URL:', window.location.href);
    console.log('🧪 access_token:', access_token);

    if (access_token) {
      setToken({
        access_token: `Bearer ${access_token}`,
        refresh_token: '',
      });

      const decoded = jwtDecode(access_token);
      setUser(prev => ({
        ...prev,
        username: decoded.sub,
        nickname: decoded.nickname,
        isAdmin: decoded.isAdmin,
        lat: decoded.lat,
        lng: decoded.lng,
      }));

      navigate('/'); // ✅ 이제 여기서 navigate 이후 다시 실행되지 않음
    } else {
      alert('access_token이 없습니다. 다시 로그인해주세요.');
    }
  }, []);

  return null;
};

export default OAuthRedirect;
