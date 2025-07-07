// src/pages/my/MyLikeWrite.jsx
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom, userAtom } from '../../atoms'
import { url } from '../../config/config'
import WriteCard from '@components/write/WriteCard'
import { HeartIcon } from 'lucide-react'

const tabs = [
  { label: '모임', path: '/myLikeClass' },
  { label: '장소', path: '/myLikePlace' },
  { label: '글쓰기', path: '/myLikeWrite' },
  { label: '책', path: '/myLikeBook' },
]

export default function MyLikeWrite() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAtomValue(tokenAtom)
  const user = useAtomValue(userAtom)
  const axios = useAxios()

  const [posts, setPosts] = useState([])
  const [likedMap, setLikedMap] = useState({})

  const fetchLikedWrites = () => {
    if (!token?.access_token) return
    axios
      .get(`${url}/my/likeWrite`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : []
        setPosts(list)
        const map = {}
        list.forEach(p => {
          map[p.writeId] = true
        })
        setLikedMap(map)
      })
      .catch(() => setPosts([]))
  }

  useEffect(() => {
    fetchLikedWrites()
  }, [token, user.username])

  const handleToggleLike = async writeId => {
    if (!token?.access_token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    try {
      const { data: liked } = await axios.post(
        `${url}/my/write-like`,
        { writeId },
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
          withCredentials: true,
        }
      )
      if (!liked) {
        alert('좋아요가 취소되었습니다.')
        fetchLikedWrites()
      }
    } catch {
      alert('좋아요 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#006989]">좋아요</h1>
        <p className="text-gray-600">좋아요한 글을 확인하세요</p>
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
          <p className="text-gray-500 mb-4">좋아요한 글이 없습니다</p>
          <button
            onClick={() => navigate('/writeList')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            글 보러 가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div key={post.writeId} className="relative">
              {/* 좋아요 버튼 */}
              <button
                onClick={() => handleToggleLike(post.writeId)}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
              >
                <HeartIcon
                  fill={likedMap[post.writeId] ? '#E88D67' : 'transparent'}
                  stroke={likedMap[post.writeId] ? '#E88D67' : '#888'}
                  className="w-5 h-5"
                />
              </button>

              {/* 글 카드 */}
              <WriteCard
                post={post}
                onClick={() => navigate(`/writeDetail/${post.writeId}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
