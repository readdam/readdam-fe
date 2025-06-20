import { Navigate, Outlet } from 'react-router-dom';
import MyLayout from '@layouts/MyLayout';

export default function MyRoutes() {
  const tokenStr = sessionStorage.getItem('token');
  let accessToken = null;

  if (tokenStr) {
    try {
      const token = JSON.parse(tokenStr);
      accessToken = token?.access_token;
    } catch (e) {
      console.error('토큰 파싱 실패:', e);
    }
  }

  // 토큰 없으면 로그인으로 리다이렉트
  if (!accessToken) {
    alert('로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  return (
    <MyLayout>
      <Outlet />
    </MyLayout>
  );
}
