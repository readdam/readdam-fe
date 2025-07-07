
import React, { useState } from 'react'
import {
  SearchIcon,
  CalendarIcon,
  ImageIcon,
  LinkIcon,
  XIcon,
  UserIcon,
} from 'lucide-react'
import MemberSearchModal from '../../components/admin/MemberSearchModal'
import { useAxios } from '../../hooks/useAxios'

export default function AdminAlertCreate() {
  const axios = useAxios()

  const [showMemberSearch, setShowMemberSearch] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([]) // nickname 리스트
  const [sendToAll, setSendToAll] = useState(false)
  const [notificationType, setNotificationType] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    const form = new FormData()
    if (!sendToAll) {
      form.append('usernames', JSON.stringify(selectedMembers))
    }
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
    if (imageFile) form.append('image', imageFile)

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
      setImageFile(null)
      setImagePreview(null)
    } catch (e) {
      console.error(e)
      alert('알림 등록 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="flex h-full bg-gray-50">
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 전체 발송 토글 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sendToAll}
              onChange={e => setSendToAll(e.target.checked)}
              className="form-checkbox text-[#006989] focus:ring-[#006989]"
            />
            <label className="text-sm">전체 회원에게 발송</label>
          </div>

          {/* 수신자 */}
          <div className={sendToAll ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-sm font-medium mb-1">수신 회원</label>
            <button
              onClick={() => setShowMemberSearch(true)}
              disabled={sendToAll}
              className="w-full text-left px-4 py-2 border rounded-lg hover:border-[#006989] flex items-center gap-2"
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
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    <UserIcon className="w-4 h-4 mr-1" />
                    {nickname}
                    <button
                      onClick={() =>
                        setSelectedMembers(m =>
                          m.filter(x => x !== nickname)
                        )
                      }
                      className="ml-1 text-blue-800 hover:text-blue-900"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 유형 / 제목 / 내용 */}
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

          {/* 링크 / 이미지 */}
          <div className="grid grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-medium mb-1">
                이미지 첨부
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      className="h-24 object-contain"
                      alt="preview"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    >
                      <XIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer text-gray-500">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-sm">클릭하여 업로드</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
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

          {/* 버튼 */}
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
      </main>

      <MemberSearchModal
        visible={showMemberSearch}
        selected={selectedMembers}
        onClose={() => setShowMemberSearch(false)}
        onConfirm={setSelectedMembers}
      />
    </div>
  )
}
