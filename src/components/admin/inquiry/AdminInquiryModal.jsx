// src/components/admin/inquiry/AdminInquiryModal.jsx
import React from 'react'
import { X, CheckCircle2, Clock } from 'lucide-react'
import PropTypes from 'prop-types'

export default function AdminInquiryModal({
    inquiry,
    onClose,
    answerText,
    setAnswerText,
    onSaveAnswer,
}) {
    if (!inquiry) return null

    const {
        inquiryId,
        username,
        regDate,
        answerDate,
        status,
        reason,
        title,
        content,
    } = inquiry

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="px-8 py-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        문의 상세 (ID: {inquiryId})
                    </h2>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-8 max-h-[80vh] overflow-y-auto">
                    {/* Basic Info */}
                    <dl className="grid grid-cols-2 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">작성자</dt>
                            <dd className="mt-1 text-gray-900">{username}</dd>
                        </div>
                        <div className="flex items-center space-x-2">
                            <dt className="text-sm font-medium text-gray-500">상태</dt>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status === 'UNANSWERED'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                {status === 'UNANSWERED' ? '답변 대기' : '답변 완료'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <dt className="text-sm font-medium text-gray-500">등록일시</dt>
                            <span className="flex items-center text-gray-900">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                {new Date(regDate).toLocaleString()}
                            </span>
                        </div>
                        {answerDate && (
                            <div className="flex items-center space-x-2">
                                <dt className="text-sm font-medium text-gray-500">답변일시</dt>
                                <span className="flex items-center text-gray-900">
                                    <CheckCircle2 className="w-4 h-4 mr-1 text-gray-500" />
                                    {new Date(answerDate).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </dl>

                    {/* Reason */}
                    <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">사유</dt>
                        <dd className="p-4 bg-gray-50 rounded whitespace-pre-wrap text-gray-800">
                            {reason}
                        </dd>
                    </div>

                    {/* Title */}
                    <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">제목</dt>
                        <dd className="p-4 bg-gray-50 rounded text-gray-800">
                            {title}
                        </dd>
                    </div>

                    {/* Content */}
                    <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">문의내용</dt>
                        <dd className="p-4 bg-gray-50 rounded whitespace-pre-wrap text-gray-800">
                            {content}
                        </dd>
                    </div>

                    {/* Answer Input */}
                    <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">답변</dt>
                        <textarea
                            value={answerText}
                            onChange={e => setAnswerText(e.target.value)}
                            rows="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                            placeholder="답변을 입력하세요"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 flex justify-end space-x-4">
                    <button
                        onClick={onSaveAnswer}
                        className="px-5 py-2 bg-[#006989] text-white rounded hover:bg-[#005C78] transition"
                    >
                        답변 저장
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    )
}

AdminInquiryModal.propTypes = {
    inquiry: PropTypes.shape({
        inquiryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        username: PropTypes.string,
        regDate: PropTypes.string,
        answerDate: PropTypes.string,
        status: PropTypes.string,
        reason: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    answerText: PropTypes.string.isRequired,
    setAnswerText: PropTypes.func.isRequired,
    onSaveAnswer: PropTypes.func.isRequired,
}
