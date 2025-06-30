// src/pages/Token.jsx
import { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom, fcmTokenAtom } from "../../atoms";
import axios from "axios";
import { url } from '../../config/config';
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function Token() {
  const params = new URL(window.location.href).searchParams;
  const tokenString = params.get("token");

  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const fcmToken = useAtomValue(fcmTokenAtom);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const parsed = JSON.parse(decodeURIComponent(tokenString));
      const accessToken = parsed.access_token;
      const refreshToken = parsed.refresh_token;

      const fullToken = {
        access_token: accessToken,
        refresh_token: refreshToken,
      };

      // ✅ 상태 저장
      setToken(fullToken);
      sessionStorage.setItem("token", JSON.stringify(fullToken));

      // ✅ FCM 토큰과 함께 사용자 정보 요청
      axios.post(
        `${url}/user`,
        { fcmToken }, // ✅ JSON으로 보냄
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
           // accessToken을 decode해서 isAdmin 여부 추출
           // 추출한 isAdmin을 userAtom에 같이 저장하기 위해 userData에 포함
          let decoded = null;
          let isAdmin = false;

          try {
            decoded = jwtDecode(accessToken);
            isAdmin = decoded.isAdmin === true;
          } catch (e) {
            console.error("토큰 decode 실패", e);
          }

          const userData = {
            ...res.data,
            isAdmin,
          };

        // useAtom(userAtom)에 저장 (관리자 권한 정보 포함)
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData)); 
        navigate("/");
      }).catch((err) => {
        console.error("❌ 유저 정보 요청 실패:", err);
      });
    } catch (e) {
      console.error("❌ 토큰 파싱 실패:", e);
    }
  }, [tokenString, setToken, setUser, navigate, fcmToken]);

  return null;
}
