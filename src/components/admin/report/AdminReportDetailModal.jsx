// src/components/admin/AdminReportDetailModal.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ExternalLink } from 'lucide-react'
import { useAxios } from '../../../hooks/useAxios'
import PropTypes from 'prop-types'

const ROUTES = {
  write_short: () => '/writeShortList',
  write: id => `/writeDetail/${id}`,
  write_comment: id => `/writeDetail/${id}`,
  book_review: isbn => `/bookDetail/${isbn}`,
  class_qna: id => `/classDetail/${id}`,
  class_review: id => `/classDetail/${id}`,
  other_place_review: id => `/otherPlaceDetail/${id}`,       // 기존 매핑 유지
  place_review: id => `/placeDetail/${id}`,  // 기존 매핑 유지
}

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export default function AdminReportDetailModal({ detail, onClose, onUpdated }) {
  const navigate = useNavigate()
  const axios = useAxios()

  const {
    reportId,
    category,
    contentPk,           // 리뷰 ID가 들어있습니다
    reporterUsername,
    reportedUsername,
    reason,
    title,
    content,
    status,
    reportedAt,
    processedAt,
  } = detail

  // contentPk 그대로 사용
  const linkUrl = ROUTES[category]?.(contentPk) ?? '#'

  const action = async (type) => {
    await axios.post('/admin/report/bulk-' + type, null, {
      params: { category, categoryId: contentPk }
    })
    onUpdated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 헤더 */}
        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">신고 상세 (ID: {reportId})</h2>
        </div>

        {/* 본문 */}
        <div className="px-8 py-6 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* 기본 정보 */}
          <dl className="grid grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">신고자</dt>
              <dd className="mt-1 text-gray-900">{reporterUsername}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">피신고자</dt>
              <dd className="mt-1 text-gray-900">{reportedUsername}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">카테고리</dt>
              <dd className="mt-1 text-gray-900">{category}</dd>
            </div>
            <div className="flex items-center space-x-2">
              <dt className="text-sm font-medium text-gray-500">상태</dt>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[status]}`}>
                {status}
              </span>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">신고일</dt>
              <dd className="mt-1 text-gray-900">
                {reportedAt?.slice(0, 19).replace('T', ' ')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">처리일</dt>
              <dd className="mt-1 text-gray-900">
                {processedAt ? processedAt.slice(0, 19).replace('T', ' ') : '-'}
              </dd>
            </div>
          </dl>

          {/* 신고 이유 */}
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-2">신고 이유</dt>
            <dd className="p-4 bg-gray-50 rounded whitespace-pre-wrap text-gray-800">
              {reason}
            </dd>
          </div>

          {/* 콘텐츠 */}
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-2">콘텐츠</dt>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-100">
                <h3 className="font-semibold text-gray-800">{title}</h3>
              </div>
              <div className="p-4 bg-white">
                <p className="mb-4 whitespace-pre-wrap text-gray-700">{content}</p>
                <button
                  onClick={() => {
                    onClose()           // 모달 닫고
                    navigate(linkUrl)   // 원래 주소로 이동
                  }}
                  className="inline-flex items-center font-medium text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  바로가기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={() => action('reject')}
            className="px-5 py-2 bg-[#E88D67] text-white rounded hover:bg-[#d47b5a] transition"
          >
            반려
          </button>
          <button
            onClick={() => action('hide')}
            className="px-5 py-2 bg-[#006989] text-white rounded hover:bg-[#00556b] transition"
          >
            숨김
          </button>

        </div>
      </div>
    </div>
  )
}

AdminReportDetailModal.propTypes = {
  detail: PropTypes.shape({
    reportId: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    contentPk: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reporterUsername: PropTypes.string,
    reportedUsername: PropTypes.string,
    reason: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.string,
    reportedAt: PropTypes.string,
    processedAt: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired,
}
