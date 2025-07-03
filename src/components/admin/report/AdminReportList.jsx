// src/components/admin/AdminReportList.jsx
import React from 'react'
import AdminReportDetailModal from '@components/admin/report/AdminReportDetailModal'

const CATEGORY_LABELS = {
  write_short: '읽담한줄',
  write: '글쓰기',
  write_comment: '첨삭',
  book_review: '책 후기',
  class_qna: '모임 질의',
  class_review: '모임 후기',
  other_place_review: '타 장소 후기',
  place_review: '장소 후기',
}

const STATUS_STYLES = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  RESOLVED:  'bg-green-100  text-green-800',
  REJECTED:  'bg-red-100    text-red-800',
}

const STATUS_LABELS = {
  PENDING:  '미처리',
  RESOLVED: '처리',
  REJECTED: '반려',
}

export default function AdminReportList({
  reports = [],
  showDetail = false,
  selected = null,
  onRowClick,
  onCloseModal
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-auto">
      <div className="text-gray-600 mb-2">
        총 <span className="font-semibold text-[#006989]">{reports.length}</span>건
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {['번호','신고일','컨텐츠 유형','내용','신고자','처리일','처리여부'].map(col => (
              <th
                key={col}
                className="px-4 py-3 text-left text-sm text-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reports.map(r => (
            <tr
              key={r.reportId}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick(r)}
            >
              <td className="px-4 py-3 text-sm">{r.reportId}</td>
              <td className="px-4 py-3 text-sm">
                {r.reportedAt?.slice(0,10) ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm">
                {CATEGORY_LABELS[r.category] ?? r.category}
              </td>
              <td className="px-4 py-3 text-sm">{r.reason}</td>
              <td className="px-4 py-3 text-sm">{r.reporterUsername}</td>
              <td className="px-4 py-3 text-sm">
                {r.processedAt?.slice(0,10) ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {STATUS_LABELS[r.status] ?? r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetail && selected && (
        <AdminReportDetailModal report={selected} onClose={onCloseModal} />
      )}
    </div>
  )
}
