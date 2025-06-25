// src/pages/my/MyWriteShort.jsx
import React, { useEffect, useState } from 'react'
import { HeartIcon } from 'lucide-react'
import axios from 'axios'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../atoms'
import { url } from '../../config/config'

// 색상 매핑
const getPostItColor = (color) => {
  switch (color) {
    case 'mint': return 'bg-[#E8F3F1]'
    case 'yellow': return 'bg-[#FFF8E7]'
    case 'pink': return 'bg-[#FFE8F3]'
    default: return 'bg-[#E8F3F1]'
  }
}

export default function MyWriteShort() {
  const token = useAtomValue(tokenAtom)
  const [shorts, setShorts] = useState([])

  // 내 글 목록 불러오기 (isLiked, likeCount 포함해서 받는다고 가정)
  useEffect(() => {
    if (!token?.access_token) return;
    axios
      .get(`${url}/my/myWriteShort`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => {
        console.log('✅ /my/myWriteShort 응답:', res.data);
        setShorts(res.data);
      })
      .catch(err => console.error('조회 실패:', err));
  }, [token]);
  

  // 좋아요 토글 핸들러
  const toggleLike = async (id) => {
    try {
      const res = await axios.post(
        `${url}/my/myLikeShort/${id}`,
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
    } catch (err) {
      console.error('좋아요 토글 실패:', err)
    }
  }

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">나의 글쓰기</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {shorts.map(item => (
          <div
            key={item.writeshortId}
            className={`
              ${getPostItColor(item.color)} 
              p-4 rounded-sm shadow-md hover:shadow-lg 
              transition-shadow relative 
              transform hover:-rotate-1 hover:translate-y-[-2px]
            `}
            style={{
              aspectRatio: '1 / 1',
              backgroundImage:
                'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-[#006989]">
                {item.eventTitle}
              </span>
              <button
                onClick={() => toggleLike(item.writeshortId)}
                className="flex items-center gap-1 text-gray-600"
              >
                <HeartIcon
                  className={`w-4 h-4 ${item.isLiked
                      ? 'fill-[#E88D67] text-[#E88D67]'
                      : 'text-gray-400'
                    }`}
                />
                <span>{item.likeCount}</span>
              </button>
            </div>
            <div className="flex items-center justify-center h-[80%]">
              <p
                className="text-center text-sm text-gray-700 leading-snug break-words overflow-hidden"
                style={{ fontFamily: 'NanumGaram' }}
              >
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
