import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, UserIcon, MapPin, MessageCircleQuestion, BookIcon, DollarSign, FlagIcon, LucideBell, PencilIcon, MegaphoneIcon, ImagesIcon  } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const sidebarMenus = [
  {
    title: '회원',
    icon: <UserIcon className="w-4 h-4 mr-2" />,
    path: "",
    submenus: [
      {name: '회원 조회', path:"/admin/userList"}, 
      {name: '탈퇴 회원', path:"/admin/userDeletedList"}
    ]
  }, {
    title: '모임',
    icon: <BookIcon className="w-4 h-4 mr-2" />,
    path:"/admin/classList",
    submenus: []
  }, {
    title: '장소',
    icon: <MapPin className="w-4 h-4 mr-2" />,
    path: "/admin/placeList",
    submenus: [
      {name: '읽담 장소', path: "/admin/placeList" },
      {name: '읽담 예약 관리', path:"/admin/placeReservationList"},
      {name: '읽담 장소 등록', path:"/admin/placeAdd"},
      {name: '외부 장소', path:"/admin/otherPlaceList"},
      {name: '외부 장소 등록', path:"/admin/otherPlaceAdd"}]
  }, {
    title: '포인트 매출 조회',
    icon: <DollarSign className="w-4 h-4 mr-2" />,
    path:"/admin/pointStats",
    submenus: []
  }, {
    title: '신고',
    icon: <FlagIcon className="w-4 h-4 mr-2" />,
    path:"/admin/reportList",
    submenus: []
  }, {
    title: '알림',
    icon: <LucideBell className="w-4 h-4 mr-2" />, 
    path:"#",
    submenus: [
      {name: '알림 목록', path:"/admin/alertList"}, 
      {name: '알림 보내기', path:"/admin/alertCreate"}
    ]
  }, {
    title: '공지사항',
    icon: <MegaphoneIcon className="w-4 h-4 mr-2" />,
    path:"/admin/notice",
    submenus: []
  }, {
    title: '이벤트',
    icon: <PencilIcon className="w-4 h-4 mr-2" />,
    path:"#",
    submenus: [
      {name: '이벤트 등록/포인트 지급', path: "/admin/eventReg"}, 
      {name: '이벤트 참여 내역', path:"/admin/eventJoinedList"}
    ]
  }, {
    title: '1:1문의/피드백',
    icon: <MessageCircleQuestion className="w-4 h-4 mr-2" />,
    path:"/admin/inquiryList",
    submenus: []
  }, {
    title: '배너',
    icon: <ImagesIcon className="w-4 h-4 mr-2" />,
    path:"/admin/bannerList",
    submenus: []
  }, 
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuTitle) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }));
  };

  return (
    <aside className="w-64 bg-[#006989] text-white overflow-y-auto">
      <nav className="py-2">
        {sidebarMenus.map((menu, idx) => {
          const isMenuActive = location.pathname.startsWith(menu.path);
          return (
          <div key={idx} className="mb-1">
            <button 
                    className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-[#005C78] ${

                    isMenuActive ? "bg-[#005C78]" : ""}`}
                    onClick={() => {
                    if (menu.submenus.length > 0) {
                      toggleMenu(menu.title)
                    }else{
                      navigate(menu.path);
                    };}}>
              <div className='flex items-center'>
                {menu.icon}
                <span>{menu.title}</span>
              </div>
              {menu.submenus.length > 0 && (expandedMenus[menu.title] ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />)}
            </button>
            {expandedMenus[menu.title] && menu.submenus.length > 0 && (
              <div className="bg-[#005C78] pl-8">
                {menu.submenus.map((submenu) => (
                  <button key={submenu.name} 
                          onClick={() => navigate(submenu.path)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#004c66] ${
                      location.pathname === submenu.path ? "bg-[#004c66] font-bold" : ""
                    }`}>
                    {submenu.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )})}
      </nav>
    </aside>);
}