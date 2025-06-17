import React, { useState } from 'react'
import {
  Search,
  Filter,
  Calendar,
  Eye,
  AlertTriangle,
  User,
  Users,
  BookOpen,
  MessageSquare,
  X,
  Check,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import AdminReportDetailModal from '@components/admin/AdminReportDetailModal'
const AdminReportList = () => {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const reports = [
    {
      id: 'R2024001',
      type: '글',
      title: '부적절한 홍보성 게시글입니다',
      reason: '스팸/홍보성',
      date: '2024-03-15',
      status: '미처리',
    },
    {
      id: 'R2024002',
      type: '댓글',
      title: '욕설이 포함된 댓글입니다',
      reason: '욕설/비방',
      date: '2024-03-14',
      status: '처리완료',
    },
    {
      id: 'R2024003',
      type: '글',
      title: '허위 모임 정보입니다',
      reason: '허위정보',
      date: '2024-03-13',
      status: '반려',
    },
    {
      id: 'R2024004',
      type: '댓글',
      title: '불건전한 프로필 사진 신고',
      reason: '부적절한 프로필',
      date: '2024-03-12',
      status: '처리완료',
    },
    {
      id: 'R2024005',
      type: '글',
      title: '저작권 침해 게시물입니다',
      reason: '저작권침해',
      date: '2024-03-11',
      status: '미처리',
    },
    {
      id: 'R2024006',
      type: '댓글',
      title: '상업적 목적의 모임 운영',
      reason: '상업적 악용',
      date: '2024-03-10',
      status: '미처리',
    },
    {
      id: 'R2024007',
      type: '댓글',
      title: '타인 비방 댓글',
      reason: '비방/욕설',
      date: '2024-03-09',
      status: '처리완료',
    },
    {
      id: 'R2024008',
      type: '댓글',
      title: '사기 의심 회원',
      reason: '비방/욕설',
      date: '2024-03-08',
      status: '처리완료',
    },
    {
      id: 'R2024009',
      type: '글',
      title: '음란성 게시물 신고',
      reason: '음란성/성인',
      date: '2024-03-07',
      status: '미처리',
    },
    {
      id: 'R2024010',
      type: '글',
      title: '정치적 목적의 모임',
      reason: '정치적 악용',
      date: '2024-03-06',
      status: '반려'
    },
  ]
  return (
    <div className="flex h-screen bg-gray-100">      
        {/* Main Content Area */}
        <main
          className="p-8 overflow-auto"
          style={{
            height: 'calc(100vh - 64px)',
          }}
        >
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative col-span-2">
                <input
                  type="text"
                  placeholder="제목 / 신고자 / 피신고자"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {/* Content Type Filter */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]">
                <option value="">전체 콘텐츠</option>
                <option value="post">글</option>
                <option value="comment">댓글</option>
              </select>
              {/* Status Filter */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]">
                <option value="">전체 상태</option>
                <option value="pending">미처리</option>
                <option value="completed">완료</option>
                <option value="rejected">반려</option>
              </select>
              {/* Date Range */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]">
                <option value="7">최근 일주일</option>
                <option value="30">최근 1개월</option>
                <option value="90">최근 3개월</option>
                <option value="180">최근 6개월</option>
              </select>
            </div>
          </div>
          {/* Report Count */}
          <div className="mb-4 text-gray-600">
            총 <span className="font-semibold text-[#006989]">52</span>건 신고
            접수됨
          </div>
          {/* Reports Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    콘텐츠 유형
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    제목
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    신고 사유
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    신고일
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedReport(report)
                      setShowDetailModal(true)
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.type === '글' ? 'bg-blue-100 text-blue-800' : report.type === '댓글' ? 'bg-green-100 text-green-800' : report.type === '모임' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {report.reason}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {report.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === '미처리' ? 'bg-yellow-100 text-yellow-800' : report.status === '처리완료' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {report.status === '미처리' ? (
                        <button
                          className="text-[#006989] hover:text-[#005C78] font-medium"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedReport(report)
                            setShowDetailModal(true)
                          }}
                        >
                          처리하기
                        </button>
                      ) : (
                        <span className="text-gray-500">
                          {report.action} by {report.admin}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

      {/* Report Detail Modal */}
      {showDetailModal && selectedReport && (
        <AdminReportDetailModal
          report={selectedReport}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  )
}
export default AdminReportList;
