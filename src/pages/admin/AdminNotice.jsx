import React, { useState } from "react";
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  MessageSquareIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
const AdminNotice = () => {
  const [activePage, setActivePage] = useState("공지사항");
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(true);
  // 공지사항 관련 상태
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    isPinned: false,
  });
  // 이벤트 관련 상태
  const [eventForm, setEventForm] = useState({
    month: "",
    title: "",
    description: "",
  });
  const [eventFilter, setEventFilter] = useState({
    month: "",
    startDate: "",
    endDate: "",
  });
  // 더미 공지사항 데이터
  const notices = [
    {
      id: 1,
      title: "시스템 점검 안내",
      createdAt: "2025-01-15",
      isPinned: true,
    },
    {
      id: 2,
      title: "개인정보 처리방침 변경 안내",
      createdAt: "2025-01-10",
      isPinned: false,
    },
    {
      id: 3,
      title: "새로운 첨삭 서비스 오픈",
      createdAt: "2025-01-03",
      isPinned: false,
    },
  ];
  const handleNoticeSubmit = (e) => {
    e.preventDefault();
    console.log("공지사항 등록:", noticeForm);
    setNoticeForm({
      title: "",
      content: "",
      isPinned: false,
    });
  };
  const renderNoticePage = () => (
    <div className="space-y-8">
      {/* 공지사항 등록 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">공지사항 등록</h3>
        <form onSubmit={handleNoticeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={noticeForm.title}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  title: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
              placeholder="공지사항 제목을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={noticeForm.content}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  content: e.target.value,
                })
              }
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
              placeholder="공지사항 내용을 입력하세요"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={noticeForm.isPinned}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  isPinned: e.target.checked,
                })
              }
              className="w-4 h-4 text-[#2C5F5F] border-gray-300 rounded focus:ring-[#2C5F5F]"
            />
            <label htmlFor="isPinned" className="text-sm text-gray-700">
              상단 고정
            </label>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2C5F5F] text-white rounded-lg hover:bg-[#1E4A4A] flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            등록
          </button>
        </form>
      </div>
      {/* 공지사항 목록 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">공지사항 목록</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                글번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                고정여부
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notices.map((notice) => (
              <tr key={notice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notice.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notice.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {notice.isPinned && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      고정
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex max-w-[1440px] mx-auto">
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>공지사항</span>
          </div>
          {/* 페이지 제목 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{activePage}</h2>
          </div>
          {/* 페이지별 콘텐츠 */}
          {activePage === "공지사항" && renderNoticePage()}
        </main>
      </div>
    </div>
  );
};
export default AdminNotice;
