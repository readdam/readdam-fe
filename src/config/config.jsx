// src/config/config.jsx
import axios from "axios";
import { isTokenExpiringSoon } from "../lib/jwtUtils";

export const url = "http://localhost:8080";
export const reactUrl = "http://localhost:5173";

export const createAxios = (_unused, setToken) => {
  const instance = axios.create({
    baseURL: url,
    timeout: 5000,
    withCredentials: true,
  });

  instance.interceptors.request.use(async config => {
    const { access_token, refresh_token } = JSON.parse(
      sessionStorage.getItem("token") || "{}"
    );

    if (access_token && isTokenExpiringSoon(access_token, 60)) {
      try {
        const { data } = await axios.post(
          `${url}/refresh`,
          { refreshToken: refresh_token }
        );
        console.log("[Token Refresh] 새 accessToken:", data.accessToken);
        const newToken = { access_token: data.accessToken, refresh_token };
        sessionStorage.setItem("token", JSON.stringify(newToken));
        setToken(newToken);
        config.headers.Authorization = `Bearer ${data.accessToken}`;
      } catch (e) {
        console.error("토큰 갱신 실패:", e);
        window.location.href = `${reactUrl}/login`;
        return Promise.reject(e);
      }
    } else if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  });

  return instance;
};
