import { Outlet } from 'react-router';;
import MyLayout from '@layouts/MyLayout';

export default function MyRoutes() {
    return (
        <MyLayout>
            <Outlet />
        </MyLayout>
    );
}
