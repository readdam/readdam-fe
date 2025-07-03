// src/components/admin/inquiry/AdminInquiryListTable.jsx
import React from 'react'
import PropTypes from 'prop-types'

const STATUS_LABELS = {
    UNANSWERED: '답변 대기',
    ANSWERED: '답변 완료',
}

const STATUS_STYLES = {
    UNANSWERED: 'bg-yellow-100 text-yellow-800',
    ANSWERED: 'bg-green-100  text-green-800',
}

export default function AdminInquiryListTable({
    items = [],
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
    onSelectInquiry,
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow overflow-auto mb-8">
            {/* 상단 총 건수 */}
            <div className="text-gray-600 mb-4">
                총 <span className="font-semibold text-[#006989]">{totalCount}</span>건
            </div>

            {/* 문의 테이블 */}
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {['번호', '사유', '제목', '작성자', '등록일', '상태'].map(col => (
                            <th
                                key={col}
                                className="px-4 py-3 text-left text-sm font-medium text-gray-700"
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
                            <td className="px-4 py-3 text-sm">{inq.inquiryId}</td>
                            <td
                                className="px-4 py-3 text-sm truncate max-w-xs"
                                title={inq.reason}
                            >
                                {inq.reason}
                            </td>
                            <td className="px-4 py-3 text-sm">{inq.title}</td>
                            <td className="px-4 py-3 text-sm">{inq.username}</td>
                            <td className="px-4 py-3 text-sm">
                                {inq.regDate
                                    ? new Date(inq.regDate).toLocaleDateString()
                                    : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
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

            {/* 페이지네이션 */}
            <div className="mt-4 flex justify-center items-center space-x-2">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 border rounded ${page === currentPage
                                ? 'bg-[#006989] text-white'
                                : 'hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    다음
                </button>
            </div>
        </div>
    )
}

AdminInquiryListTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        inquiryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        reason: PropTypes.string,
        title: PropTypes.string,
        username: PropTypes.string,
        regDate: PropTypes.string,
        status: PropTypes.string,
    })).isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSelectInquiry: PropTypes.func.isRequired,
}
