// src/routes/AdminRoutes.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom } from '../atoms';
import AdminLayout from '@layouts/AdminLayout';

export default function AdminRoutes() {
  const [token] = useAtom(tokenAtom);

  // 토큰이 없으면 메인으로 리다이렉트
  if (!token?.access_token) {
    return <Navigate to="/" replace />;
  }

  // 토큰이 있으면 관리자 레이아웃 및 하위 라우트 렌더링
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
