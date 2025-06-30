// src/components/admin/AdminReportDetailModal.jsx
import React, { useState } from 'react'
import { X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import axios from 'axios'

const ROUTES = {
  write_short: () => '/writeShortList',
  write: id => `/writeDetail/${id}`,
  write_comment: id => `/writeDetail/${id}`,
  book_review: isbn => `/bookDetail/${isbn}`,
  class_qna: id => `/classDetail/${id}`,
  class_review: id => `/classDetail/${id}`,
  other_place_review: id => `/placeDetail/${id}`,
  place_review: id => `/otherPlaceDetail/${id}`,
}

export default function AdminReportDetailModal({ detail, onClose, onUpdated }) {
  const [expanded, setExpanded] = useState(false)

  // detail이 ReportDto 형태이므로 바로 필드를 꺼냅니다
  const {
    reportId,
    reason,
    category,
    content,
    title,
    contentPk
  } = detail

  // 반려 / 숨김 액션
  const action = async (type) => {
    // API 경로가 /admin/report/... 으로 앞단에서 바뀌었다면 여기에 맞게 조정
    await axios.put(`/admin/report/${reportId}/${type}`)
    onUpdated()
  }

  // 링크 URL 계산
  const linkUrl = (() => {
    const fn = ROUTES[category]
    return fn ? fn(contentPk) : '#'
  })()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">신고 상세</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {/* 신고 이유 */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">신고 이유</span>
            <p className="mt-1 text-gray-800">{reason}</p>
          </div>
          {/* 콘텐츠 미리보기 */}
          <div className="mb-6">
            <button
              type="button"
              className="w-full flex justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="font-medium text-gray-700">콘텐츠 미리보기</span>
              {expanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
            </button>
            {expanded && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-800">{title}</h5>
                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    바로가기
                  </a>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              onClick={() => action('reject')}
            >
              반려
            </button>
            <button
              type="button"
              className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              onClick={() => action('hide')}
            >
              숨김
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
