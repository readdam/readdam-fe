// src/api/axiosInstance.js
import axios from 'axios';
import { url } from '../config/config';

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const tokenStr = sessionStorage.getItem('token');
    if (tokenStr) {
      const token = JSON.parse(tokenStr);
      if (token?.access_token) {
        config.headers.Authorization = token.access_token.startsWith('Bearer ')
          ? token.access_token
          : `Bearer ${token.access_token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
