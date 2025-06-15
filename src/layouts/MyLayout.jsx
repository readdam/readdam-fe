import Footer from '../components/Footer';
import Header from '../components/Header';
import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    BookmarkIcon,
    HeartIcon,
    UsersIcon,
    PenToolIcon,
    FileEditIcon,
    BookOpenIcon,
    WalletIcon,
    ClockIcon,
    BellIcon,
    HelpCircleIcon,
} from 'lucide-react';

const groupedSidebarItems = [
    {
        category: '',
        items: [
            { label: '나의 서재', icon: BookmarkIcon, path: '/myLibrary' },
            { label: '좋아요', icon: HeartIcon, path: '/myLikeClass' },
            { label: '나의 모임', icon: UsersIcon, path: '/myClassContinue' },
        ],
    },
    {
        category: '글쓰기',
        items: [
            { label: '내가 쓴 글', icon: PenToolIcon, path: '/myWrite' },
            { label: '작성한 첨삭', icon: FileEditIcon, path: '/myWriteComment' },
        ],
    },
    {
        category: '리뷰',
        items: [
            { label: '책 리뷰', icon: BookOpenIcon, path: '/myReviewBook' },
            { label: '모임리뷰', icon: UsersIcon, path: '/myReviewClass' },
        ],
    },
    {
        category: '포인트',
        items: [
            { label: '포인트 충전', icon: WalletIcon, path: '/myPointCharge' },
            { label: '포인트 내역', icon: ClockIcon, path: '/myPointList' },
        ],
    },
    {
        category: '알림 및 문의',
        items: [
            { label: '예약 내역 보기', icon: BookOpenIcon, path: '/myReservation' },
            { label: '알림', icon: BellIcon, path: '/myAlert' },
            { label: '1:1 문의', icon: HelpCircleIcon, path: '/myInquiry' },
        ],
    },
];

const MyLayout = ({ children }) => {
    const location = useLocation();

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 text-black flex">
                {/* Sidebar */}
                <div className="w-60 bg-white shadow-md min-h-screen flex flex-col items-center py-6">
                    <Link
                        to="/myProfile"
                        className="flex flex-col items-center mb-4 cursor-pointer hover:opacity-80"
                    >
                        <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
                        <p className="text-sm font-semibold">닉네임</p>
                    </Link>
                    <hr className="w-48 border-gray-200 mb-4" />
                    <div className="w-full">
                        {groupedSidebarItems.map((group, idx) => (
                            <div key={idx} className="mb-6">
                                {group.category && (
                                    <h3 className="text-xs font-semibold text-gray-500 mb-2 px-6">
                                        {group.category}
                                    </h3>
                                )}
                                {group.items.map(({ label, icon: Icon, path }) => {
                                    const isLikeGroupActive =
                                        label === '좋아요' &&
                                        location.pathname.startsWith('/myLike');
                                    
                                    const isClassGroupActive =
                                        label === '나의 모임' &&
                                        location.pathname.startsWith('/myClass');
                                    
                                    const isWriteGroupActive =
                                        label === '내가 쓴 글' &&
                                        (location.pathname === '/myWrite' || location.pathname === '/myWriteShort');


                                    return (    
                                        <NavLink
                                            to={path}
                                            key={path}
                                            className={({ isActive }) =>
                                                `w-full flex items-center px-6 py-2 text-sm transition-colors ${isActive || isLikeGroupActive || isClassGroupActive || isWriteGroupActive
                                                    ? 'bg-[#EB8F6A] text-white font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`
                                            }
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="ml-3">{label}</span>
                                        </NavLink>
                                    );
                                })}

                            </div>
                        ))}
                    </div>
                </div>



                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto">{children}</div>
            </div>
            <Footer />
        </>
    );
};


export default MyLayout;
