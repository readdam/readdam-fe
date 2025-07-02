// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import './index.css';
import App from './App.jsx';

const queryClient = new QueryClient();

// → ① 세션스토리지에서 토큰 꺼내기
const saved = sessionStorage.getItem('token');
let accessToken = '';
if (saved) {
  try {
    accessToken = JSON.parse(saved).access_token;
  } catch {}
}

// → ② 전역 axios defaults 설정 (렌더 전에)
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
if (accessToken) {
  axios.defaults.headers.common['Authorization'] = accessToken;
}

// → ③ 한 번만 렌더링
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

// → FCM Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((reg) => console.log('✅ FCM SW 등록 성공:', reg))
      .catch((err) => console.error('❌ FCM SW 등록 실패:', err));
  });
}
