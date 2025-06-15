import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import axios from "axios";
import { url } from '../../config/config';
import { useNavigate } from "react-router";

export default function Token() {
  const params = new URL(window.location.href).searchParams;
  const tokenString = params.get("token");

  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();
  const rawToken = params.get('token');
if (rawToken) {
  const parsed = JSON.parse(decodeURIComponent(rawToken));
  const accessToken = parsed.access_token;
  const refreshToken = parsed.refresh_token;

  const fullToken = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  setToken(fullToken); // jotai 저장
  sessionStorage.setItem('token', JSON.stringify(fullToken)); // storage에도 명시적 저장
}


  useEffect(() => {
    try {
      const parsedToken = JSON.parse(tokenString); // ✅ 문자열 → 객체
      console.log("👉 저장할 토큰:", parsedToken);
      setToken(parsedToken);

      axios.post(`${url}/user`, null, {
        headers: { Authorization: parsedToken.access_token }
      })
      .then(res => {
        console.log("✅ 로그인 유저 정보:", res.data);
        setUser(res.data);
        navigate("/");
      })
      .catch(err => {
        console.error("❌ 유저 정보 요청 실패:", err);
      });
    } catch (e) {
      console.error("❌ 토큰 파싱 실패:", e);
    }
  }, [tokenString]);

  return null;
}
