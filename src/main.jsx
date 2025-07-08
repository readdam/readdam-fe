// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAxios } from './hooks/useAxios';   // 경로 확인
import './index.css';
import App from './App.jsx';

const queryClient = new QueryClient();

function Root() {
  const axios = useAxios();  // baseURL, withCredentials, Authorization 헤더 등 전부 useAxios 훅에서 설정

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

// FCM Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(reg => console.log('✅ FCM SW 등록 성공:', reg))
      .catch(err => console.error('❌ FCM SW 등록 실패:', err));
  });
}
