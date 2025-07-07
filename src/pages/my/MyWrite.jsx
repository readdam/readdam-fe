// src/pages/my/MyWrite.jsx
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom } from '../../atoms'
import WriteCard from '@components/write/WriteCard'

const tabs = [
  { label: '내가 작성한 글', path: '/myWrite' },
  { label: '작성한 첨삭', path: '/myWriteComment' },
  { label: '읽담 한줄', path: '/myWriteShort' },
]

export default function MyWrite() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAtomValue(tokenAtom)
  const axios = useAxios()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (!token?.access_token) return
    axios
      .get(`/my/myWrite`)
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]))
  }, [token, axios])

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-[#006989]">나의 글쓰기</h1>
        <p className="text-gray-600">내가 작성한 글을 확인하세요</p>
      </div>

      {/* 탭 */}
      <div className="flex space-x-6 border-b mb-8 text-sm">
        {tabs.map(tab => (
          <Link
            key={tab.label}
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
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">아직 작성한 글이 없습니다.</p>
          <button
            onClick={() => navigate('/writeList')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            글 쓰러가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div
              key={post.writeId}
              onClick={() => navigate(`/writeDetail/${post.writeId}`)}
            >
              <WriteCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
