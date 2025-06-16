import React, { useState, useEffect } from 'react'
import {
  BookIcon,
  ClockIcon,
  GlobeIcon,
  SaveIcon,
  EyeIcon,
  CheckCircleIcon,
  HashIcon,
  AlertCircleIcon,
  ImageIcon,
  SearchIcon,
  UploadIcon,
} from 'lucide-react'

const WriteModify = ({ writeId }) => {
  const [formData, setFormData] = useState({
    type: '',
    visibility: 'public',
    needReview: false,
    reviewDeadline: '',
    title: '',
    summary: '',
    tags: '',
    content: '',
    image: null
  })

  const [showGuideQuestions, setShowGuideQuestions] = useState(false)
  const [isSpellchecking, setIsSpellchecking] = useState(false)

  // ✅ 1. 기존 글 정보 로드
  useEffect(() => {
    const fetchWriteDetail = async () => {
      const dummyData = {
        type: 'review',
        visibility: 'public',
        needReview: true,
        reviewDeadline: '2025-06-15T10:00',
        title: '수정할 글 제목입니다',
        summary: '',
        tags: '#독후감 #리액트',
        content: '기존에 작성했던 본문입니다.',
        image: null,
      }
      setFormData(dummyData)
    }

    fetchWriteDetail()
  }, [writeId])

  // ✅ 2. 수정 제출
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('글이 수정되었습니다!')
    // PUT 요청 or PATCH 요청 등 수정 API 호출
  }

  // ✅ 3. 임시저장 및 기타 핸들러는 동일 (필요시 수정)

    const handleTempSave = () => {
        // 임시저장 로직 구현
        alert('임시 저장되었습니다. 나의 글쓰기 목록에서 확인할 수 있어요.')
    }
    const handleSpellCheck = () => {
        setIsSpellchecking(true)
        // 맞춤법 검사 로직 구현
        setTimeout(() => {
        setIsSpellchecking(false)
        alert('맞춤법 검사가 완료되었습니다.')
        }, 1500)
    }
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
            setFormData({
            ...formData,
            image: reader.result,
            })
        }
        reader.readAsDataURL(file)
        }
    }
    const handleSearchCover = () => {
        // 북커버 검색 로직 구현
        alert('북커버 검색 기능은 준비 중입니다.')
    }
  // ✅ 4. 렌더링 (타이틀/버튼만 변경)
  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              글 수정하기
            </h1>
            {/* 기본 정보 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 좌측 컬럼 */}
              <div className="space-y-6">
                {/* 글 종류 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    글 종류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">선택해주세요</option>
                    <option value="review">독후감</option>
                    <option value="essay">수필</option>
                    <option value="personal">자기소개서</option>
                    <option value="assignment">과제</option>
                  </select>
                </div>
                {/* 공개 범위 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공개 범위 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visibility: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="public">전체 공개</option>
                    <option value="private">비공개</option>
                  </select>
                </div>
              </div>
              {/* 우측 컬럼 - 이미지 업로드 */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 등록
                </label>
                {/* 프리뷰 + 버튼을 가로 정렬 */}
                <div className="flex gap-4 items-start">
                    {/* 이미지 프리뷰 */}
                    <div className="w-48 h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {formData.image ? (
                        <img
                        src={formData.image}
                        alt="업로드 이미지"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#E88D67]">
                        <BookIcon className="w-20 h-20 text-white" />
                        </div>
                    )}
                    </div>

                    {/* 버튼 그룹 - 세로 정렬 */}
                    <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleSearchCover}
                        className="px-4 py-2 bg-[#F3F7EC] text-[#006989] rounded-lg hover:bg-[#E5EED9] transition-colors flex items-center justify-center gap-2"
                    >
                        <SearchIcon className="w-4 h-4" />
                        북커버 검색
                    </button>
                    <label className="px-4 py-2 bg-[#F3F7EC] text-[#006989] rounded-lg hover:bg-[#E5EED9] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <UploadIcon className="w-4 h-4" />
                        이미지 첨부
                        <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        />
                    </label>
                    </div>
                </div>
                </div>
            </div>
            {/* 첨삭 설정 */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="needReview"
                  className="mr-2"
                  checked={formData.needReview}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      needReview: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="needReview"
                  className="text-sm font-medium text-gray-700"
                >
                  첨삭 받기를 원합니다
                </label>
              </div>
              {formData.needReview && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    첨삭 마감 시간 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    value={formData.reviewDeadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reviewDeadline: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}
            </div>
          </div>
          {/* 글 작성 영역 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* 제목 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                글 제목 <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">(최대 100자)</span>
              </label>
              <input
                type="text"
                maxLength={100}
                placeholder="예: 나의 첫 심리독서회 후기"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>
            {/* 태그 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그{' '}
                <span className="text-sm text-gray-500 ml-2">(최대 5개)</span>
              </label>
              <input
                type="text"
                placeholder="#자기계발 #자소서 #추천도서"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value,
                  })
                }
              />
            </div>
            {/* 본문 작성 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                본문 작성
              </label>
              {showGuideQuestions && (
                <div className="bg-[#F3F7EC] p-4 rounded-lg mb-4 text-sm text-gray-600">
                  <p className="mb-2">
                    ✍️ 다음 질문에 답하며 글을 작성해보세요:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>이 책을 읽게 된 이유/계기는 무엇인가요?</li>
                    <li>가장 인상 깊었던 문장과 그 이유는 무엇인가요?</li>
                    <li>전체적인 감상과 느낀 점을 정리해보세요.</li>
                  </ul>
                </div>
              )}
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] min-h-[400px]"
                placeholder="본문을 작성해주세요."
                value={formData.content}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: e.target.value,
                  })
                }
                required
              />
            </div>
            {/* 버튼만 수정 */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSpellCheck}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                맞춤법 검사
              </button>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleTempSave}
                  className="px-6 py-2 text-[#006989] border border-[#006989] rounded-lg hover:bg-[#F3F7EC] transition-colors flex items-center gap-2"
                >
                  <SaveIcon className="w-5 h-5" />
                  임시저장
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
                >
                  수정 완료
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteModify
