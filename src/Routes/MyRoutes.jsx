import { Navigate, Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms'; 
import MyLayout from '@layouts/MyLayout';

export default function MyRoutes() {
  const [user] = useAtom(userAtom); 

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <MyLayout>
      <Outlet />
    </MyLayout>
  );
}
