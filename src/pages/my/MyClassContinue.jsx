// src/pages/my/MyClassContinue.jsx
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom } from '../../atoms'
import { url } from '@config/config'
import ClassCard from '@components/class/ClassCard2'

const tabs = [
  { label: '참여 중인 모임', path: '/myClassContinue' },
  { label: '참여가 종료된 모임', path: '/myClassEnd' },
  { label: '내가 개설한 모임', path: '/myClassIMade' },
]

export default function MyClassContinue() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAtomValue(tokenAtom)
  const api = useAxios()
  const [classes, setClasses] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!token?.access_token) return
    api
      .get(`${url}/my/classes/ongoing`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(({ data }) => setClasses(Array.isArray(data) ? data : []))
      .catch(() => setClasses([]))
  }, [token, api])

  const safe = Array.isArray(classes) ? classes : []
  const visible = showAll ? safe : safe.slice(0, 20)

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">나의 모임</h1>
        <p className="text-gray-600">참여 중인 모임을 확인하세요</p>
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
          <p className="mb-4 text-gray-600">참여 중인 모임이 없습니다.</p>
          <button
            onClick={() => navigate('/classList')}
            className="px-6 py-2 bg-[#006989] text-white rounded hover:bg-[#005C78] transition"
          >
            모임 참여하기
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visible.map(item => (
              <ClassCard
                key={(item.classDto ?? item).classId}
                group={item}
              />
            ))}
          </div>
          {!showAll && safe.length > 20 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
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
