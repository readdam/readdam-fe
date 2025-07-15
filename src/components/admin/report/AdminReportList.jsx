// src/components/admin/report/AdminReportList.jsx
import React from 'react';
import AdminReportDetailModal from '@components/admin/report/AdminReportDetailModal';
import PropTypes from 'prop-types';
import {
  CATEGORY_LABELS,
  REASON_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from '@constants/report';

export default function AdminReportList({
  reports = [],
  totalCount = 0,
  showDetail = false,
  selected = null,
  onRowClick,
  onCloseModal,
}) {
  return (
    <div className="bg-white p-6 rounded-lg overflow-auto mb-8">
      {/* 상단 총 건수 */}
      <div className="text-gray-600 mb-4">
        총 <span className="font-semibold text-[#006989]">{totalCount}</span>건
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {[
              '번호',
              '신고일',
              '컨텐츠 유형',
              '내용',
              '신고자',
              '처리일',
              '처리여부',
            ].map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reports.map((r) => (
            <tr
              key={r.reportId}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick(r)}
            >
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {r.reportId}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {r.reportedAt?.slice(0, 10) ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {CATEGORY_LABELS[r.category] ?? r.category}
              </td>
              <td
                className="px-4 py-3 text-sm truncate max-w-xs"
                title={r.reason}
              >
                {REASON_LABELS[r.reason]}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {r.reporterUsername}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {r.processedAt?.slice(0, 10) ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
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
  );
}

AdminReportList.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      reportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      reportedAt: PropTypes.string,
      category: PropTypes.string,
      reason: PropTypes.string,
      reporterUsername: PropTypes.string,
      processedAt: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
  totalCount: PropTypes.number.isRequired,
  showDetail: PropTypes.bool,
  selected: PropTypes.object,
  onRowClick: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
