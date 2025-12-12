import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { url } from '../../config/config';
import { getFcmToken } from '../../fcmToken';

const OAuthRedirect = () => {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const handleOAuth = async () => {
      const urlObj = new URL(window.location.href);
      const access_token = urlObj.searchParams.get('access_token');
      const refresh_token = urlObj.searchParams.get("refresh_token");  // ← 추가

      if (!access_token) {
        alert("access_token이 없습니다.");
        return navigate('/login');
      }

      const tokenObj = {
        access_token: `Bearer ${access_token}`,
        refresh_token,
      };
      setToken(tokenObj);
      sessionStorage.setItem("token", JSON.stringify(tokenObj));

      const decoded = jwtDecode(access_token);
      const userInfo = {
        username: decoded.sub,
        nickname: decoded.nickname,
        isAdmin: decoded.isAdmin,
        lat: decoded.lat,
        lng: decoded.lng,
      };
      setUser(userInfo);
      sessionStorage.setItem("user", JSON.stringify(userInfo));

      // ✅ FCM 토큰 직접 발급해서 서버에 저장 요청
      const fcmToken = await getFcmToken();
      if (fcmToken) {
        console.log("✅ 받은 fcmToken:", fcmToken);
        await axios.post(`${url}/user`, { fcmToken }, {
          headers: {
            Authorization: tokenObj.access_token,
            "Content-Type": "application/json",
          },
        });
      }

      navigate('/');
    };

    handleOAuth();
  }, []);

  return null;
};

export default OAuthRedirect;
