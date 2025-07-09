// src/pages/my/MyClassIMade.jsx
import React, { useEffect, useState } from 'react'
import { url } from '@config/config'
import { useAxios } from '../../hooks/useAxios'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../atoms'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ClassCard from '@components/class/ClassCard2'

const tabs = [
  { label: '참여 중인 모임', path: '/myClassContinue' },
  { label: '참여가 종료된 모임', path: '/myClassEnd' },
  { label: '내가 개설한 모임', path: '/myClassIMade' },
]

export default function MyClassIMade() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAtomValue(tokenAtom)
  const api = useAxios()

  // 페이징 상태
  const [classes, setClasses] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(20)
  const [totalPages, setTotalPages] = useState(0)

  // 페이지가 바뀔 때마다 데이터 불러오기
  useEffect(() => {
    if (!token?.access_token) return
    ;(async () => {
      try {
        const res = await api.get(
          `${url}/my/classes/created?page=${page}&size=${size}`,
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
            withCredentials: true,
          }
        )
        const { content, pageInfo } = res.data
        setClasses(prev =>
          page === 0 ? content : [...prev, ...content]
        )
        setTotalPages(pageInfo.totalPages)
      } catch (err) {
        console.error('내가 개설한 모임 조회 실패', err)
        setClasses([])
      }
    })()
  }, [token, api, page, size])

  const loadMore = () => {
    if (page + 1 < totalPages) {
      setPage(prev => prev + 1)
    }
  }

  const safe = Array.isArray(classes) ? classes : []

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">나의 모임</h1>
        <p className="text-gray-600">내가 개설한 모임을 확인하세요</p>
      </div>

      {/* 탭 */}
      <div className="flex space-x-6 border-b mb-8 text-sm">
        {tabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`pb-2 transition-all ${
              location.pathname === tab.path
                ? 'text-[#005C78] border-b-2 border-[#005C78] font-semibold'
                : 'text-gray-500 hover:text-[#006989]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 콘텐츠 */}
      {safe.length === 0 ? (
        <div className="text-center py-20">
          <p className="mb-4 text-gray-600">아직 개설한 모임이 없습니다.</p>
          <button
            onClick={() => navigate('/classList')}
            className="px-6 py-2 bg-[#006989] text-white rounded hover:bg-[#005C78] transition"
          >
            모임 만들기
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {safe.map(item => (
              <ClassCard
                key={(item.classDto ?? item).classId}
                group={item}
              />
            ))}
          </div>

          {/* 더보기 */}
          {page + 1 < totalPages && (
            <div className="text-center mt-10">
              <button
                onClick={loadMore}
                className="px-6 py-2 border border-[#006989] text-[#006989] rounded-md text-sm hover:bg-[#F3F7EC] transition"
              >
                더보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
