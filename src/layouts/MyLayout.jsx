// src/layout/MyLayout.jsx
import React, { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAxios } from '../hooks/useAxios';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAtom } from 'jotai';
import { userAtom, tokenAtom } from '../atoms';
import { url } from '../config/config';
import {
  BookmarkIcon,
  HeartIcon,
  UsersIcon,
  PenToolIcon,
  FileEditIcon,
  BookOpenIcon,
  WalletIcon,
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
      { label: '포인트 관리', icon: WalletIcon, path: '/myPointList' },
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
  const [user, setUser] = useAtom(userAtom);
  const [token] = useAtom(tokenAtom);
  const axios = useAxios();

  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .post(
        `${url}/my/myProfile`,
        null,
        {
          headers: { Authorization: token.access_token },
          withCredentials: true,
        }
      )
      .then(res => setUser(res.data))
      .catch(err => console.error('사이드바 프로필 불러오기 실패', err));
  }, [token?.access_token, axios]);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="flex">
          {/* 사이드바 */}
          <div
            className="w-60 shadow-md flex flex-col items-center py-6"
            style={{ backgroundColor: '#FDF3F0' }}
          >
            <Link
              to="/myProfile"
              className="flex flex-col items-center mb-4 hover:opacity-80"
            >
              <img
                src={`${url}/image?filename=${user?.profileImg?.trim() || 'defaultProfile.jpg'}`}
                alt="프로필 이미지"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <p className="text-md font-semibold">{user?.nickname || '닉네임'}</p>
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
                    const isLikeActive =
                      label === '좋아요' && location.pathname.startsWith('/myLike');
                    const isClassActive =
                      label === '나의 모임' && location.pathname.startsWith('/myClass');
                    const isWriteActive =
                      label === '내가 쓴 글' &&
                      ['/myWrite', '/myWriteShort'].includes(location.pathname);

                    return (
                      <NavLink
                        to={path}
                        key={path}
                        className={({ isActive }) =>
                          `w-full flex items-center px-6 py-2 text-sm transition-colors ${
                            isActive || isLikeActive || isClassActive || isWriteActive
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

          {/* 메인 컨텐츠 */}
          <div className="flex-1 mx-6 bg-[#F3F7EC] rounded-lg overflow-hidden p-6">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyLayout;
