// src/pages/my/MyWriteShort.jsx
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom } from '../../atoms'
import { HeartIcon } from 'lucide-react'

// 색상 매핑
const getPostItColor = (color) => {
  switch (color) {
    case 'mint':   return 'bg-[#E8F3F1]'
    case 'yellow': return 'bg-[#FFF8E7]'
    case 'pink':   return 'bg-[#FFE8F3]'
    default:       return 'bg-[#E8F3F1]'
  }
}

const tabs = [
  { label: '내가 작성한 글', path: '/myWrite' },
  { label: '작성한 첨삭',   path: '/myWriteComment' },
  { label: '읽담 한줄',     path: '/myWriteShort' },
]

export default function MyWriteShort() {
  const location = useLocation()
  const navigate = useNavigate()
  const token    = useAtomValue(tokenAtom)
  const axios    = useAxios()
  const [shorts, setShorts] = useState([])

  useEffect(() => {
    if (!token?.access_token) return
    axios
      .get('/my/myWriteShort', {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => setShorts(res.data))
      .catch(() => setShorts([]))
  }, [token, axios])

  const toggleLike = async (id, e) => {
    e.stopPropagation()
    try {
      const res = await axios.post(
        `/my/myLikeShort/${id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
          withCredentials: true,
        }
      )
      const { likeCount, isLiked } = res.data
      setShorts(prev =>
        prev.map(s =>
          s.writeshortId === id
            ? { ...s, likeCount, isLiked }
            : s
        )
      )
    } catch {
      alert('좋아요 토글 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-[#006989]">읽담 한줄</h1>
        <p className="text-gray-600">작성한 읽담 한줄을 확인하세요</p>
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
      {shorts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">아직 작성한 읽담 한줄이 없습니다.</p>
          <button
            onClick={() => navigate('/writeShortList')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            글 작성하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {shorts.map(item => (
            <div
              key={item.writeshortId}
              onClick={() => navigate(`/writeDetail/${item.writeId}`)}
              className={`
                ${getPostItColor(item.color)}
                aspect-square
                p-4 rounded-lg
                shadow-md hover:shadow-lg
                transition-shadow
                relative
              `}
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-base font-semibold text-[#006989]">
                  {item.eventTitle}
                </span>
                <button
                  onClick={(e) => toggleLike(item.writeshortId, e)}
                  className="flex items-center gap-1 text-gray-600"
                >
                  <HeartIcon
                    className={`w-6 h-6 transition-colors ${
                      item.isLiked
                        ? 'fill-[#E88D67] text-[#E88D67]'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="text-base">{item.likeCount}</span>
                </button>
              </div>
              <div className="flex items-center justify-center h-[calc(100%-2.5rem)]">
                <p
                  className="text-center text-lg text-gray-700 leading-relaxed whitespace-pre-line overflow-hidden"
                  style={{ fontFamily: 'NanumGaram' }}
                >
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
