// src/pages/admin/AdminAlertCreate.jsx
import React, { useState } from 'react'
import {
  SearchIcon,
  LinkIcon,
  XIcon,
  UserIcon,
  CalendarIcon,
} from 'lucide-react'
import MemberSearchModal from '../../components/admin/MemberSearchModal'
import { useAxios } from '../../hooks/useAxios'

export default function AdminAlertCreate() {
  const axios = useAxios()

  const [showMemberSearch, setShowMemberSearch] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([]) // 닉네임 리스트
  const [sendToAll, setSendToAll] = useState(false)
  const [notificationType, setNotificationType] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const handleSubmit = async () => {
    const form = new FormData()
    if (!sendToAll) form.append('usernames', JSON.stringify(selectedMembers))
    form.append('sendToAll', String(sendToAll))
    form.append('type', notificationType)
    form.append('title', title)
    form.append('content', content)
    form.append('linkUrl', link)
    form.append(
      'scheduledTime',
      scheduledDate && scheduledTime
        ? `${scheduledDate}T${scheduledTime}:00`
        : ''
    )

    try {
      await axios.post('/admin/alert', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('알림이 성공적으로 등록되었습니다.')
      // 초기화
      setSelectedMembers([])
      setSendToAll(false)
      setNotificationType('')
      setTitle('')
      setContent('')
      setLink('')
      setScheduledDate('')
      setScheduledTime('')
    } catch (e) {
      console.error(e)
      alert('알림 등록 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 브레드크럼 + 제목 */}
      <div className="max-w-3xl mx-auto mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>관리자</span>
          <span className="mx-2">›</span>
          <span>알림 발송</span>
        </div>
        <h2 className="text-2xl font-bold">알림 발송</h2>
      </div>

      {/* 카드 */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
        {/* 수신 회원 검색 */}
        <div>
          <label className="block text-sm font-medium mb-1">수신 회원</label>
          <button
            onClick={() => setShowMemberSearch(true)}
            disabled={sendToAll}
            className="
    w-full text-left px-4 py-2 border rounded-lg flex items-center gap-2
    hover:border-[#006989]
    disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
          >
            <SearchIcon className="w-5 h-5 text-gray-400" />
            {selectedMembers.length
              ? `${selectedMembers.length}명 선택됨`
              : '회원 검색'}
          </button>
          {selectedMembers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedMembers.map(nickname => (
                <span
                  key={nickname}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  <UserIcon className="w-4 h-4 mr-1" />
                  {nickname}
                  <button
                    onClick={() =>
                      setSelectedMembers(ms => ms.filter(x => x !== nickname))
                    }
                    className="ml-1 text-green-700 hover:text-green-900"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 전체 회원에게 발송 */}
        <div className="flex items-center gap-2">
          <input
            id="sendToAll"
            type="checkbox"
            checked={sendToAll}
            onChange={e => {
              const all = e.target.checked
              setSendToAll(all)
              if (all) {
                // 전체 발송 선택 시 기존 선택 내역 초기화
                setSelectedMembers([])
              }
            }}
            className="form-checkbox text-[#006989] focus:ring-[#006989]"
          />
          <label htmlFor="sendToAll" className="text-sm cursor-pointer">
            전체 회원에게 발송
          </label>
        </div>

        {/* 유형 + 제목 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">유형</label>
            <select
              value={notificationType}
              onChange={e => setNotificationType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:border-[#006989]"
            >
              <option value="">선택해주세요</option>
              <option value="signup">신규 가입</option>
              <option value="event">이벤트</option>
              <option value="group">모임</option>
              <option value="writing">글쓰기</option>
              <option value="point">포인트</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:border-[#006989]"
              placeholder="제목을 입력하세요"
            />
          </div>
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:border-[#006989]"
            placeholder="알림 내용을 입력하세요"
          />
        </div>

        {/* 링크 */}
        <div>
          <label className="block text-sm font-medium mb-1">링크</label>
          <div className="relative">
            <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={link}
              onChange={e => setLink(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:border-[#006989]"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* 예약 발송 */}
        <div>
          <label className="block text-sm font-medium mb-1">예약 발송</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:border-[#006989]"
              />
            </div>
            <input
              type="time"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:border-[#006989]"
            />
          </div>
        </div>

        {/* 발송하기 버튼 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-500">
            * 발송 후에는 취소할 수 없습니다.
          </p>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78]"
          >
            발송하기
          </button>
        </div>
      </div>

      {/* 회원 검색 모달 */}
      <MemberSearchModal
        visible={showMemberSearch}
        selected={selectedMembers}
        onClose={() => setShowMemberSearch(false)}
        onConfirm={setSelectedMembers}
      />
    </div>
  )
}
