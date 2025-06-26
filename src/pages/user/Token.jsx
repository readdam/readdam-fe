// src/pages/Token.jsx
import { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom, fcmTokenAtom } from "../../atoms";
import axios from "axios";
import { url } from '../../config/config';
import { useNavigate } from "react-router";

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
        access_token,
        refresh_token,
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
        setUser(res.data);
        navigate("/");
      }).catch((err) => {
        console.error("❌ 유저 정보 요청 실패:", err);
      });
    } catch (e) {
      console.error("❌ 토큰 파싱 실패:", e);
    }
  }, [tokenString]);

  return null;
}
