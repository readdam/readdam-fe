import React, { useState, memo } from 'react'
import {
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
  Eye,
  Trash2,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
const AdminReportDetailModal = ({
  report,
  onClose,
}) => {
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const [memo, setMemo] = useState('')
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">신고 상세</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Modal Content */}
        <div
          className="px-6 py-4 overflow-y-auto"
          style={{
            maxHeight: 'calc(90vh - 120px)',
          }}
        >
          {/* Report Info */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-gray-500">신고 ID:</span>
                <span className="ml-2 font-medium">{report.id}</span>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === '미처리' ? 'bg-yellow-100 text-yellow-800' : report.status === '처리완료' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {report.status}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">신고 유형:</span>
              <span className="ml-2 font-medium">{report.type}</span>
            </div>
             <div>
              <span className="text-sm text-gray-500">신고자 닉네임:</span>
              <span className="ml-2 font-medium">{report.reporter}</span>
            </div>
             <div>
              <span className="text-sm text-gray-500">피신고자 닉네임:</span>
              <span className="ml-2 font-medium">{report.reported}</span>
            </div>
          </div>
          {/* 신고 상세 사유 input */}
          <div>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="신고 상세내용을 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                rows={3}
              />
            </div>
           {/* Content Preview */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 rounded-lg"
              onClick={() => setIsContentExpanded(!isContentExpanded)}
            >
              <span className="font-medium">콘텐츠 미리보기</span>
              {isContentExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {isContentExpanded && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium">{report.title}</h5>
                  <a
                    href="#"
                    className="text-[#006989] hover:text-[#005C78] flex items-center text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    바로가기
                  </a>
                </div>
                <p className="text-gray-600 text-sm">{report.content}</p>
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center">
                <Eye className="w-4 h-4 mr-2" />
                블라인드
              </button>
              <button className="flex-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center">
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminReportDetailModal;
