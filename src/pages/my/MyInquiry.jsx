// src/pages/my/MyInquiry.jsx
import React, { useEffect, useState } from 'react'
import { useAxios } from '../../hooks/useAxios'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../atoms'
import MyInquiryDetail from './MyInquiryDetail'
import MyInquiryWrite from './MyInquiryWrite'
import MyInquiryModify from './MyInquiryModify'

export default function MyInquiry() {
  const axios = useAxios()
  const token = useAtomValue(tokenAtom)

  const [inquiries, setInquiries] = useState([])
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)

  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [isWriteOpen, setIsWriteOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const fetchInquiries = (pageNum = 0) => {
    if (!token?.access_token) return
    axios
      .get(`/my/myInquiryList?page=${pageNum}&size=10`)
      .then(res => {
        const { content, pageInfo } = res.data
        setInquiries(prev =>
          pageNum === 0
            ? content
            : [...prev, ...content]
        )
        setHasNext(pageInfo.hasNext)
      })
      .catch(() => {
        if (pageNum === 0) setInquiries([])
        setHasNext(false)
      })
  }

  useEffect(() => {
    setPage(0)
    fetchInquiries(0)
  }, [token, axios])

  const formatDate = dateString => {
    const d = new Date(dateString)
    return isNaN(d) ? '' : d.toLocaleDateString('ko-KR')
  }

  const convertStatus = status =>
    status === 'ANSWERED' ? '답변완료'
      : status === 'UNANSWERED' ? '미답변'
        : status

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-[#006989]">나의 문의 내역</h1>
        <p className="text-gray-600">문의 목록을 확인하세요</p>
      </div>

      {/* 목록 또는 빈 상태 */}
      {inquiries.length === 0 ? (
        <div className="flex justify-center py-20">
          <p className="text-gray-500">문의 작성글이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2 text-sm font-medium bg-gray-50 border-b border-gray-200">
              <div className="col-span-2 text-gray-500">작성일자</div>
              <div className="col-span-6">제목</div>
              <div className="col-span-2 text-gray-600">문의 사유</div>
              <div className="col-span-2 text-right">답변상태</div>
            </div>
            {inquiries.map(item => (
              <div
                key={item.inquiryId}
                onClick={() => setSelectedInquiry(item)}
                className="grid grid-cols-12 px-4 py-4 text-sm border-b border-gray-200 items-start hover:bg-gray-50 cursor-pointer"
              >
                <div className="col-span-2 text-gray-500">{formatDate(item.regDate)}</div>
                <div className="col-span-6 font-medium text-gray-800 truncate">{item.title}</div>
                <div className="col-span-2 text-gray-600 truncate">{item.reason}</div>
                <div className="col-span-2 text-right">
                  <span
                    className={
                      `inline-block px-2 py-1 text-xs font-medium rounded-full ` +
                      (item.status === 'ANSWERED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600')
                    }
                  >
                    {convertStatus(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 더보기 버튼 */}
          {hasNext && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  const next = page + 1
                  setPage(next)
                  fetchInquiries(next)
                }}
                className="px-6 py-2 border border-[#006989] text-[#006989] rounded-md text-sm hover:bg-[#F3F7EC] transition"
              >
                더보기
              </button>
            </div>
          )}

        </>
      )}

      {/* 문의 작성 버튼 */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsWriteOpen(true)}
          className="flex items-center gap-1 bg-[#006989] text-white px-4 py-2 rounded-md shadow-lg text-sm hover:bg-[#005C78] transition"
        >
          <span className="text-lg">＋</span> 1:1 문의 작성
        </button>
      </div>

      {/* 상세 모달 */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-md p-6 shadow-lg">
            <MyInquiryDetail
              inquiry={selectedInquiry}
              onClose={() => setSelectedInquiry(null)}
              onEdit={inq => {
                setSelectedInquiry(null)
                setEditTarget(inq)
              }}
            />
          </div>
        </div>
      )}

      {/* 작성 모달 */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-md p-6 shadow-lg">
            <MyInquiryWrite
              onClose={() => setIsWriteOpen(false)}
              onCreate={newItem => {
                // 새로 작성 후 첫 페이지부터 다시 로드
                setPage(0)
                fetchInquiries(0)
                setIsWriteOpen(false)
              }}
            />
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editTarget && (
        <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-md p-6 shadow-lg">
            <MyInquiryModify
              inquiry={editTarget}
              onClose={() => setEditTarget(null)}
              onUpdated={updated =>
                setInquiries(prev =>
                  prev.map(item =>
                    item.inquiryId === updated.inquiryId ? updated : item
                  )
                )
              }
              onDeleted={deletedId => {
                setInquiries(prev =>
                  prev.filter(item => item.inquiryId !== deletedId)
                )
                setEditTarget(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
