// src/components/admin/inquiry/AdminInquiryListTable.jsx
import React from 'react'
import PropTypes from 'prop-types'

const STATUS_LABELS = {
    UNANSWERED: '답변 대기',
    ANSWERED: '답변 완료',
}

const STATUS_STYLES = {
    UNANSWERED: 'bg-yellow-100 text-yellow-800',
    ANSWERED: 'bg-green-100 text-green-800',
}

export default function AdminInquiryListTable({
    items = [],
    totalCount,
    onSelectInquiry,
}) {
    return (
        <div className="overflow-auto mb-4">
            {/* 총 건수 */}
            <div className="text-gray-600 mb-4">
                총 <span className="font-semibold text-[#006989]">{totalCount}</span>건
            </div>

            <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                    <tr>
                        {['번호', '사유', '제목', '작성자', '등록일', '상태'].map(col => (
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
                    {items.map(inq => (
                        <tr
                            key={inq.inquiryId}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => onSelectInquiry(inq)}
                        >
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {inq.inquiryId}
                            </td>
                            <td
                                className="px-4 py-3 text-sm truncate max-w-xs"
                                title={inq.reason}
                            >
                                {inq.reason}
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {inq.title}
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {inq.username}
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {inq.regDate
                                    ? new Date(inq.regDate).toLocaleDateString()
                                    : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${STATUS_STYLES[inq.status] ?? 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {STATUS_LABELS[inq.status] || inq.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

AdminInquiryListTable.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            inquiryId: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
            reason: PropTypes.string,
            title: PropTypes.string,
            username: PropTypes.string,
            regDate: PropTypes.string,
            status: PropTypes.string,
        })
    ).isRequired,
    totalCount: PropTypes.number.isRequired,
    onSelectInquiry: PropTypes.func.isRequired,
}
