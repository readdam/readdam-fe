// src/pages/my/MyWriteComment.jsx
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useAxios } from '../../hooks/useAxios'
import { tokenAtom } from '../../atoms'
import { url } from '../../config/config'
import { BookOpenIcon} from 'lucide-react';

const typeMap = {
  bookreview: '독후감',
  essay: '수필',
  personal: '자기소개서',
  assignment: '과제',
  other: '기타',
}

const tabs = [
  { label: '내가 작성한 글', path: '/myWrite' },
  { label: '작성한 첨삭', path: '/myWriteComment' },
  { label: '읽담 한줄', path: '/myWriteShort' },
]

export default function MyWriteComment() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAtomValue(tokenAtom)
  const axios = useAxios()

  const [comments, setComments] = useState([])

  useEffect(() => {
    if (!token?.access_token) return
    axios
      .get('/my/myWriteComment', {
        headers: { Authorization: `Bearer ${token.access_token}` },
        withCredentials: true,
      })
      .then(res => setComments(res.data))
      .catch(() => setComments([]))
  }, [token, axios])

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 bg-[#F3F7EC]">
      {/* 헤더 */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-[#006989]">작성한 첨삭</h1>
        <p className="text-gray-600">내가 남긴 첨삭 내역을 확인하세요</p>
      </div>

      {/* 탭 */}
      <div className="flex space-x-6 border-b mb-8 text-sm">
        {tabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`pb-2 transition-all ${location.pathname === tab.path
                ? 'text-[#005C78] border-b-2 border-[#005C78] font-semibold'
                : 'text-gray-500 hover:text-[#006989]'
              }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 리스트 */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">아직 작성한 첨삭이 없습니다.</p>
          <button
            onClick={() => navigate('/writeList')}
            className="px-6 py-2 bg-[#006989] text-white rounded-md hover:bg-[#005C78] transition"
          >
            글 보러가기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(item => (
            <div
              key={item.writeCommentId}
              className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow flex cursor-pointer"
              onClick={() => navigate(`/writeDetail/${item.writeId}`)}
            >
              {/* 원글 이미지 또는 아이콘 플레이스홀더 */}
              <div className="w-28 h-28 flex-shrink-0 mr-4">
                {item.writeImage ? (
                  <img
                    src={`${url}/image?filename=${item.writeImage.trim()}`}
                    alt="원글 이미지"
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/static/default-thumbnail.png'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#FCD5C9] flex items-center justify-center">
                    <BookOpenIcon className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                {/* 상단 정보 */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    {typeMap[item.type] || '첨삭'}
                  </span>
                  <h2 className="text-lg font-semibold truncate">{item.title}</h2>
                  <span className="ml-auto text-xs text-gray-500">
                    {item.postNickname} · {item.regDate?.split('T')[0]}
                  </span>
                </div>

                {/* 원글 내용 (5줄 넘으면 ... 처리) */}
                {item.writeContent && (
                  <p className="text-sm text-gray-600 italic line-clamp-5 whitespace-pre-line">
                    {item.writeContent}
                  </p>
                )}

                {/* 내 첨삭 내용 */}
                <p className="text-sm text-gray-700 bg-[#FAFAFA] p-3 rounded-md whitespace-pre-line leading-relaxed">
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
