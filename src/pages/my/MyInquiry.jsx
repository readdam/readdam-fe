import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import MyInquiryDetail from './MyInquiryDetail';
import MyInquiryWrite from './MyInquiryWrite';
import MyInquiryModify from './MyInquiryModify';
import { url } from '../../config/config';

const MyInquiry = () => {
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isWriteOpen, setIsWriteOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const token = useAtomValue(tokenAtom);

    useEffect(() => {
        if (!token?.access_token) return;
        axios.get(`${url}/my/myInquiryList`, {
            headers: { Authorization: token.access_token.startsWith('Bearer ')
                ? token.access_token : `Bearer ${token.access_token}` },
            withCredentials: true,
        })
        .then(res => {
            const data = Array.isArray(res.data) ? res.data : [];
            setInquiries(data);
        })
        .catch(err => {
            console.error('문의 목록 조회 실패:', err);
            setInquiries([]);
        });
    }, [token]);

    const formatDate = dateString => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('ko-KR');
    };

    const convertStatus = status => {
        if (status === 'ANSWERED') return '답변완료';
        if (status === 'UNANSWERED') return '미답변';
        return status;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-xl font-semibold mb-6">나의 문의 내역</h1>
            <div className="w-full border rounded-lg overflow-hidden">
                <div className="bg-gray-50 text-sm font-medium grid grid-cols-12 px-4 py-2 border-b">
                    <div className="col-span-2">작성일자</div>
                    <div className="col-span-6">제목</div>
                    <div className="col-span-2">문의 사유</div>
                    <div className="col-span-2 text-right">답변상태</div>
                </div>
                {inquiries.slice(0, 10).map(item => (
                    <div
                        key={item.inquiryId}
                        onClick={() => setSelectedInquiry(item)}
                        className="grid grid-cols-12 px-4 py-4 border-b text-sm items-start hover:bg-gray-50 cursor-pointer"
                    >
                        <div className="col-span-2 text-gray-500">{formatDate(item.regDate)}</div>
                        <div className="col-span-6 font-medium truncate">{item.title}</div>
                        <div className="col-span-2 text-gray-600 text-sm truncate">{item.reason}</div>
                        <div className="col-span-2 text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${item.status === 'ANSWERED' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                {convertStatus(item.status)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {inquiries.length > 10 && (
                <div className="mt-6 text-center">
                    <button className="text-sm text-blue-600 hover:underline" onClick={() => setInquiries(prev => prev.concat(prev.slice(inquiries.length, inquiries.length + 10)))}>
                        더보기
                    </button>
                </div>
            )}

            <div className="fixed bottom-8 right-8">
                <button onClick={() => setIsWriteOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg text-sm hover:bg-blue-700 flex items-center gap-1">
                    <span className="text-lg">＋</span> 1:1 문의 작성
                </button>
            </div>

            {selectedInquiry && (
                <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl rounded-md p-6 shadow-lg">
                        <MyInquiryDetail
                            inquiry={selectedInquiry}
                            onClose={() => setSelectedInquiry(null)}
                            onEdit={inq => {
                                setSelectedInquiry(null);
                                setEditTarget(inq);
                            }}
                        />
                    </div>
                </div>
            )}

            {isWriteOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl rounded-md p-6 shadow-lg">
                        <MyInquiryWrite
                            onClose={() => setIsWriteOpen(false)}
                            onCreate={newItem => {
                                setInquiries(prev => [newItem, ...prev]);
                                setIsWriteOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {editTarget && (
                <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl rounded-md p-6 shadow-lg">
                        <MyInquiryModify
                            inquiry={editTarget}
                            onClose={() => setEditTarget(null)}
                            onUpdated={updated => {
                                setInquiries(prev => prev.map(item => item.inquiryId === updated.inquiryId ? updated : item));
                            }}
                            onDeleted={deletedId => {
                                setInquiries(prev => prev.filter(item => item.inquiryId !== deletedId));
                                setEditTarget(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyInquiry;
