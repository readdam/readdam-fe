// src/config/config.jsx
import axios from "axios";

export const url = "http://localhost:8080";
export const reactUrl = "http://localhost:5173";

export const createAxios = (token, setToken) => {
  const instance = axios.create({
    baseURL: url,
    timeout: 5000,
  });

  instance.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    response => {
      const newToken = response.headers.authorization;
      if (newToken) {
        setToken(prev => ({ ...prev, access_token: newToken }));
      }
      return response;
    },
    error => {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        window.location.href = `${reactUrl}/login`;
        return Promise.reject(error); //토큰 만료 시 무한 호출되서 리턴값 줌
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

