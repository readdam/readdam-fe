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
  // 더미 이벤트 데이터
  const events = [
    {
      id: 1,
      month: "2025-01",
      title: "신년 독서 챌린지",
      createdAt: "2024-12-28",
      likes: 245,
      winner: "김독서",
    },
    {
      id: 2,
      month: "2024-12",
      title: "겨울 독서 마라톤",
      createdAt: "2024-11-25",
      likes: 189,
      winner: "이책벌레",
    },
  ];
  // 더미 참여 내역 데이터
  const participations = [
    {
      id: 1,
      username: "김독서",
      content: "올해는 매주 한 권씩 읽어서 총 52권을 목표로...",
      createdAt: "2025-01-14 14:30",
      likes: 12,
      isReported: false,
    },
    {
      id: 2,
      username: "이책벌레",
      content: "독서를 통해 새로운 세상을 경험하고 있습니다...",
      createdAt: "2025-01-13 09:15",
      likes: 8,
      isReported: false,
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
  const handleEventSubmit = (e) => {
    e.preventDefault();
    console.log("이벤트 등록:", eventForm);
    setEventForm({
      month: "",
      title: "",
      description: "",
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
  const renderEventTopicPage = () => (
    <div className="space-y-8">
      {/* 이벤트 주제 등록 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">월별 주제 등록</h3>
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 선택
            </label>
            <select
              value={eventForm.month}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  month: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
              required
            >
              <option value="">월을 선택하세요</option>
              <option value="2025-01">2025년 1월</option>
              <option value="2025-02">2025년 2월</option>
              <option value="2025-03">2025년 3월</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주제 제목
            </label>
            <input
              type="text"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  title: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
              placeholder="이벤트 주제를 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 내용
            </label>
            <textarea
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  description: e.target.value,
                })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
              placeholder="이벤트 설명을 입력하세요"
              required
            />
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
      {/* 지난 이벤트 목록 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">지난 이벤트 목록</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                월
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                주제 제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                좋아요 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                선정자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.likes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {event.winner}
                  </span>
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
  const renderEventParticipationPage = () => (
    <div className="space-y-6">
      {/* 필터 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">참여 내역 조회</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 선택
            </label>
            <select
              value={eventFilter.month}
              onChange={(e) =>
                setEventFilter({
                  ...eventFilter,
                  month: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
            >
              <option value="">전체</option>
              <option value="2025-01">2025년 1월</option>
              <option value="2024-12">2024년 12월</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              value={eventFilter.startDate}
              onChange={(e) =>
                setEventFilter({
                  ...eventFilter,
                  startDate: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              value={eventFilter.endDate}
              onChange={(e) =>
                setEventFilter({
                  ...eventFilter,
                  endDate: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
            />
          </div>
        </div>
        <button className="mt-4 px-6 py-2 bg-[#2C5F5F] text-white rounded-lg hover:bg-[#1E4A4A]">
          조회
        </button>
      </div>
      {/* 참여 내역 목록 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">이벤트 참여 내역</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                사용자명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                참여글 내용
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                작성일시
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                좋아요 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                신고여부
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participations.map((participation) => (
              <tr key={participation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {participation.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {participation.content}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {participation.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {participation.likes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {participation.isReported ? (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      신고됨
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
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
            <span>공지사항/이벤트</span>
            <span>&gt;</span>
            <span>{activePage}</span>
          </div>
          {/* 페이지 제목 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{activePage}</h2>
          </div>
          {/* 페이지별 콘텐츠 */}
          {activePage === "공지사항" && renderNoticePage()}
          {activePage === "이벤트 주제 등록" && renderEventTopicPage()}
          {activePage === "이벤트 참여 내역" && renderEventParticipationPage()}
        </main>
      </div>
    </div>
  );
};
export default AdminNotice;
