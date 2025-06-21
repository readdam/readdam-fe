import { Outlet, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms'; 
import AdminLayout from '@layouts/AdminLayout';

export default function AdminRoutes() {
  const [user] = useAtom(userAtom); // 로그인 사용자
  const isAdmin = user?.isAdmin === true;

  // 로그인 안했거나, 관리자가 아니면 홈으로 이동
  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  // 관리자라면 레이아웃 포함한 하위 라우팅 허용
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
