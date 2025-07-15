// src/components/alert/AlertItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AlertItem({ alert, onClick }) {
    const date = new Date(alert.createdAt).toLocaleDateString('ko-KR');
    const path = alert.linkUrl
        ? alert.linkUrl.startsWith('/') || alert.linkUrl.startsWith('http')
            ? alert.linkUrl
            : '/' + alert.linkUrl
        : null;

    return (
        <div
            onClick={() => onClick(alert)}
            className={`
        cursor-pointer bg-white rounded-lg p-5 mb-4 flex flex-col
        border-l-4 transition-shadow
        ${alert.isChecked
                    ? 'border-gray-300 hover:shadow-sm'
                    : 'border-[#006989] hover:shadow-md'}
      `}
        >
            {/* 헤더: 제목 + 날짜 */}
            <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold text-gray-800">
                    {alert.title || alert.type}
                </h3>
                <span className="text-xs text-gray-500">{date}</span>
            </div>

            {/* 본문: 내용 */}
            <p className="text-sm text-gray-700 mt-2">{alert.content}</p>

            {/* 메타 + 이동하기 */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                <span>
                    유형: {alert.type} | 보낸 사람: {alert.senderNickname}
                </span>
                {path && (
                    <Link
                        to={path}
                        onClick={e => e.stopPropagation()}
                        className="text-[#006989] hover:underline"
                    >
                        이동하기
                    </Link>
                )}
            </div>
        </div>
    );
}
