import React, { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminSidebar } from '../components/AdminSidebar';
import PlaceAdd from '@pages/admin/PlaceAdd';
import Footer from '@components/Footer';
import { Outlet } from "react-router-dom";
import AdminInquiryList from '@pages/admin/AdminInquiryList';

const sidebarMenus = [
  {
    id: 'members',
    title: '회원',
    submenus: [
      '회원 조회', '탈퇴회원']
  }, {
    id: 'meetings',
    title: '모임',
    submenus: []
  },
  {
    id: 'places',
    title: '장소',
    submenus: ['읽담 장소 등록', '읽담 예약 관리','외부 장소 등록']
  }, {
    id: 'revenue',
    title: '포인트 매출 조회',
    submenus: []
  }, {
    id: 'reports',
    title: '신고',
    submenus: []
  },
  {
    id: 'alert',
    title: '알림',
    submenus: []
  }, {
    id: 'notices',
    title: '공지사항',
    submenus: []
  }, {
    id: 'event',
    title: '이벤트',
    submenus: []
  },{
    id: 'banners',
    title: '배너',
    submenus: []
  },{
    id: 'inquiries',
    title: '1:1문의/피드백',
    submenus: []
  }
];

export function AdminLayout() {
  const [sidebarMenus, setSidebarMenus] = useState('');
  return (
    <>
      {/* 상단 관리자 헤더 */}
      <AdminHeader />

      {/* 사이드바 + 메인 */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar sidebarMenus={sidebarMenus} />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
            {sidebarMenus === 'places' && <PlaceAdd />}
            {sidebarMenus === 'inquiries' && <AdminInquiryList />}


          </main>
        </div>
      </div>

    {/* 하단 푸터(공통) */}
    <Footer />
    </>
    );
};
export default AdminLayout;