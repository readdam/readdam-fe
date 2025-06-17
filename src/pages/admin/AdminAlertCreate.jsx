import React, { useState } from 'react'
import {
  SearchIcon,
  CalendarIcon,
  ImageIcon,
  XIcon,
  LinkIcon,
  UserIcon,
  XCircleIcon,
} from 'lucide-react'
const AdminAlertCreate = () => {
  const [showMemberSearch, setShowMemberSearch] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [notificationType, setNotificationType] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  // Sample member data
  const members = [
    {
      id: 1,
      nickname: '책벌레123',
      email: 'book123@email.com',
    },
    {
      id: 2,
      nickname: '독서광',
      email: 'reader@email.com',
    },
    {
      id: 3,
      nickname: '문학소녀',
      email: 'literature@email.com',
    },
    {
      id: 4,
      nickname: '글쓰기매니아',
      email: 'writer@email.com',
    },
    {
      id: 5,
      nickname: '도서관지기',
      email: 'library@email.com',
    },
  ]
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleMemberSelect = (nickname) => {


    if (selectedMembers.includes(nickname)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== nickname))
    } else {
      setSelectedMembers([...selectedMembers, nickname])
    }
  }
  const removeMember = (nickname) => {
    setSelectedMembers(selectedMembers.filter((m) => m !== nickname))
  }
  return (
    <div className="flex h-screen bg-gray-100">
           
        {/* Main Content Area */}
        <main className="p-8 overflow-auto h-[calc(100vh-64px)]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  알림 수신 회원
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowMemberSearch(true)}
                    className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] flex items-center"
                  >
                    <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-500">알림을 받을 회원 검색</span>
                  </button>
                  {selectedMembers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedMembers.map((member) => (
                        <span
                          key={member}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
                        >
                          <UserIcon className="w-4 h-4 mr-1" />
                          {member}
                          <button
                            onClick={() => removeMember(member)}
                            className="ml-1 hover:text-blue-800"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  알림 유형
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                >
                  <option value="">알림 유형 선택</option>
                  <option value="signup">신규 가입</option>
                  <option value="event">이벤트</option>
                  <option value="group">모임</option>
                  <option value="writing">글쓰기&첨삭</option>
                  <option value="point">포인트</option>
                  <option value="other">기타</option>
                </select>
              </div>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  알림 제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  placeholder="알림 제목을 입력하세요"
                />
              </div>
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  알림 내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  placeholder="알림 내용을 입력하세요"
                />
              </div>
              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    placeholder="링크를 입력하세요"
                  />
                  <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 첨부
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-auto"
                        />
                        <button
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                          }}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#006989] hover:text-[#005C78] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#006989]">
                            <span>이미지 업로드</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Scheduled Sending */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예약 발송
                </label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    />
                    <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  />
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-red-500">
                  * 알림 발송 후에는 취소가 불가합니다.
                </p>
                <button className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
                  보내기
                </button>
              </div>
            </div>
          </div>
        </main>

      {/* Member Search Modal */}
      {showMemberSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">회원 검색</h3>
              <button
                onClick={() => setShowMemberSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="회원 검색 (닉네임 또는 이메일)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
              />
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-16 px-4 py-2"></th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      닉네임
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      이메일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.nickname)}
                          onChange={() => handleMemberSelect(member.nickname)}
                          className="rounded border-gray-300 text-[#006989] focus:ring-[#006989]"
                        />
                      </td>
                      <td className="px-4 py-2">{member.nickname}</td>
                      <td className="px-4 py-2 text-gray-500">
                        {member.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowMemberSearch(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={() => setShowMemberSearch(false)}
                className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminAlertCreate;
