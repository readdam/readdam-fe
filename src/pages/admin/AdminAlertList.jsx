import React, { useState } from 'react'
import {
  BellIcon,
  SearchIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  FilterIcon,
} from 'lucide-react'
const AdminAlertList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [notificationType, setNotificationType] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [showDetail, setShowDetail] = useState(null)
  const notifications = [
    {
      id: 1,
      type: '신규 가입',
      title: '읽담에 오신 것을 환영합니다!',
      recipients: '신규회원(25명)',
      sentDate: '2024-03-15 14:30',
      status: true,
    },
    {
      id: 2,
      type: '이벤트',
      title: '봄맞이 독서 이벤트 안내',
      recipients: '전체회원',
      sentDate: '2024-03-14 11:20',
      status: false,
    },
    {
      id: 3,
      type: '모임',
      title: '새로운 독서모임이 개설되었습니다',
      recipients: '관심회원(15명)',
      sentDate: '2024-03-13 09:45',
      status: true,
    },
    {
      id: 4,
      type: '포인트',
      title: '3월 포인트 더블 적립 이벤트',
      recipients: '전체회원',
      sentDate: '2024-03-12 16:15',
      status: false,
    },
    {
      id: 5,
      type: '글쓰기&첨삭',
      title: '첨삭 신청하신 글이 완료되었습니다',
      recipients: '김철수',
      sentDate: '2024-03-11 13:50',
      status: true,
    },
    {
      id: 6,
      type: '기타',
      title: '서비스 점검 안내',
      recipients: '전체회원',
      sentDate: '2024-03-10 08:00',
      status: true,
    },
    {
      id: 7,
      type: '이벤트',
      title: '독서 감상문 콘테스트 안내',
      recipients: '활동회원(50명)',
      sentDate: '2024-03-09 15:30',
      status: false,
    },
    {
      id: 8,
      type: '모임',
      title: '모임 일정이 변경되었습니다',
      recipients: '모임회원(12명)',
      sentDate: '2024-03-08 10:20',
      status: true,
    },
  ]
  return (
    <div className="flex h-screen bg-gray-100">
        {/* Main Content Area */}
        <main className="p-8 overflow-auto h-[calc(100vh-64px)]">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex gap-4">
              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="알림내용, 키워드로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative">
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] appearance-none bg-white"
                >
                  <option value="all">전체 유형</option>
                  <option value="signup">신규 가입</option>
                  <option value="event">이벤트</option>
                  <option value="group">모임</option>
                  <option value="writing">글쓰기&첨삭</option>
                  <option value="point">포인트</option>
                  <option value="other">기타</option>
                </select>
                <FilterIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] appearance-none bg-white"
                >
                  <option value="all">전체 기간</option>
                  <option value="7days">최근 7일</option>
                  <option value="1month">최근 1개월</option>
                  <option value="3months">최근 3개월</option>
                </select>
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
          {/* Notifications Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    No.
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    알림 유형
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    알림 제목
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    수신회원
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    발송일
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                    확인여부
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setShowDetail(notification.id)}
                  >
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {notification.id}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {notification.title}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {notification.recipients}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {notification.sentDate}
                    </td>
                    <td className="px-4 py-4">
                      {notification.status ? (
                        <span className="inline-flex items-center text-green-700">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          확인
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-700">
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          미확인
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center items-center px-4 py-3 bg-gray-50">
              <nav className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-[#006989] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </main>
      {/* Notification Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-4">알림 상세</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">알림 유형</label>
                <p className="text-gray-900">
                  {notifications.find((n) => n.id === showDetail)?.type}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">알림 제목</label>
                <p className="text-gray-900">
                  {notifications.find((n) => n.id === showDetail)?.title}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">수신회원</label>
                <p className="text-gray-900">
                  {notifications.find((n) => n.id === showDetail)?.recipients}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">발송일</label>
                <p className="text-gray-900">
                  {notifications.find((n) => n.id === showDetail)?.sentDate}
                </p>
              </div>
              <button
                onClick={() => setShowDetail(null)}
                className="w-full px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminAlertList;
