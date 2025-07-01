// src/pages/write/WriteShortList.jsx
import { useEffect, useState } from 'react'
import { HeartIcon, PenIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '../../atoms'
import { url } from '../../config/config'
import singoIcon from '@assets/singo.png'

import PostcardModal from '@components/write/PostcardModal'
import ReportModal from '@components/ReportModal'
import TimeRemainingText from '@components/write/TimeRemainingText'

const WriteShortList = () => {
  const axios = useAxios()
  const navigate = useNavigate()
  const [token] = useAtom(tokenAtom)
  const [user]  = useAtom(userAtom)

  // 글/이벤트 관련
  const [event, setEvent]         = useState(null)
  const [answers, setAnswers]     = useState([])
  const [pageInfo, setPageInfo]   = useState(null)
  const [page, setPage]           = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasWritten, setHasWritten] = useState(null)

  // 답변 작성 모달
  const [showModal, setShowModal]       = useState(false)
  const [answerText, setAnswerText]     = useState('')
  const [selectedColor, setSelectedColor] = useState('mint')

  // 신고 모달 상태
  const [showReportModal, setShowReportModal]     = useState(false)
  const [showReportConfirm, setShowReportConfirm] = useState(false)
  const [reportTarget, setReportTarget]           = useState({ id: null, username: null })
  const [reportType, setReportType]               = useState('')
  const [reportContent, setReportContent]         = useState('')

  // 색상 매핑
  const getPostItColor = (color) => {
    switch (color) {
      case 'mint':  return 'bg-[#E8F3F1]'
      case 'yellow':return 'bg-[#FFF8E7]'
      case 'pink':  return 'bg-[#FFE8F3]'
      default:      return 'bg-[#E8F3F1]'
    }
  }

  // 신고 버튼 클릭 → 폼 모달 열기
  const handleReportClick = (answer) => {
    setReportTarget({ id: answer.writeshortId, username: answer.username })
    setReportType('')
    setReportContent('')
    setShowReportModal(true)
  }

  // 신고 제출 성공 콜백
  const handleReportSuccess = () => {
    setShowReportModal(false)
    setShowReportConfirm(true)
  }

  // 확인 모달 닫힐 때 알림
  const handleConfirmClose = () => {
    setShowReportConfirm(false)
    window.alert('신고가 완료되었습니다.')
  }

  // 초기 데이터
  useEffect(() => {
    fetchEvent()
    fetchAnswers(1)
  }, [])

  // 로그인 복구 후 재조회
  useEffect(() => {
    if (user?.username && token?.access_token) {
      fetchAnswers(1)
    }
  }, [user, token])

  // 작성 여부 체크
  useEffect(() => {
    if (user == null) {
      setHasWritten(false)
    } else {
      setHasWritten(answers.some(a => a.username === user.username))
    }
  }, [user, answers])

  // 이벤트 정보
  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${url}/event`)
      setEvent(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // 답변 목록
  const fetchAnswers = async (pageNum) => {
    try {
      const res = await axios.get(`${url}/writeShortList?page=${pageNum}&size=10`)
      const { list, pageInfo, totalCount } = res.data
      setAnswers(prev => pageNum === 1 ? list : [...prev, ...list])
      setPageInfo(pageInfo)
      setTotalCount(totalCount || 0)
    } catch (err) {
      console.error(err)
    }
  }

  // 답변 작성
  const handleSubmitAnswer = async () => {
    if (!user || !token?.access_token) {
      alert('로그인이 필요한 서비스입니다')
      return navigate('/login')
    }
    if (!answerText.trim()) return
    try {
      const res = await axios.post(`${url}/my/writeShort`, { content: answerText, color: selectedColor })
      setAnswers([res.data, ...answers])
      setHasWritten(true)
      setShowModal(false)
      setAnswerText('')
    } catch (err) {
      console.error(err)
      alert('작성 실패')
    }
  }

  // 좋아요 토글
  const handleToggleLike = async (id) => {
    if (!token?.access_token) {
      alert('로그인이 필요한 서비스입니다')
      return navigate('/login')
    }
    try {
      const isLiked = await axios.post(`${url}/my/writeShort-like`, { writeshortId: id })
        .then(res => res.data)
      setAnswers(prev =>
        prev.map(a =>
          a.writeshortId === id
            ? { ...a, isLiked, likes: a.likes + (isLiked ? 1 : -1) }
            : a
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <section className="w-full min-h-screen bg-[#F9F9F7] py-8">
      <div className="container mx-auto px-4">
        {/* 탭 & 작성 버튼 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-6">
            <button onClick={() => navigate('/writeList')} className="text-xl font-bold text-gray-400">전체 글</button>
            <button className="text-xl font-bold text-[#006989]">읽담한줄</button>
          </div>
          {hasWritten !== null && (
            <button
              onClick={() => {
                if (!user || !token?.access_token) {
                  alert('로그인이 필요한 서비스입니다')
                  return navigate('/login')
                }
                setShowModal(true)
              }}
              disabled={hasWritten}
              className={`flex items-center px-6 py-2.5 rounded-lg transition-colors 
                ${hasWritten ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#006989] text-white hover:bg-[#005C78]'}`}
            >
              <PenIcon className="w-5 h-5 mr-2" />
              {hasWritten ? '이미 작성함' : '답변작성'}
            </button>
          )}
        </div>

        {/* 이벤트 정보 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-[#E88D67]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-[#006989]">{event?.title || '이달의 담소...'}</h2>
            <TimeRemainingText endDate={event?.endTime} autoUpdate />
          </div>
        </div>

        {/* 총 글 수 */}
        {totalCount > 0 && (
          <div className="text-gray-500 text-sm mt-4 mb-8">
            총 {totalCount.toLocaleString()}개의 글
          </div>
        )}

        {/* 답변 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {answers.map(answer => (
            <div
              key={answer.writeshortId}
              className={`${getPostItColor(answer.color)} p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow relative transform hover:-rotate-1 hover:translate-y-[-2px]`}
              style={{ aspectRatio: '1/1', backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)' }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm text-[#006989]">{answer.nickname}</span>
                <button onClick={() => handleToggleLike(answer.writeshortId)} className="flex items-center gap-1">
                  <HeartIcon className={`w-4 h-4 ${answer.isLiked ? 'fill-[#E88D67] text-[#E88D67]' : 'text-gray-400'}`} />
                  <span>{answer.likes}</span>
                </button>
              </div>
              <div className="flex items-center justify-center h-[70%] pt-16">
                <p className="text-center text-lg font-bold text-gray-500 leading-snug break-words" style={{ fontFamily: 'NanumGaram' }}>
                  {answer.content}
                </p>
              </div>
              {/* 신고 버튼 */}
              <button
                onClick={() => handleReportClick(answer)}
                className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <img src={singoIcon} alt="신고" className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* 더보기 */}
        {pageInfo && page < pageInfo.totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                const next = page + 1
                fetchAnswers(next)
                setPage(next)
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              더보기
            </button>
          </div>
        )}

        {/* 답변 작성 모달 */}
        {showModal && (
          <PostcardModal
            answerText={answerText}
            setAnswerText={setAnswerText}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onSubmit={handleSubmitAnswer}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* 신고 폼 모달 */}
        {showReportModal && (
          <ReportModal
            setShowReportModal={setShowReportModal}
            reportType={reportType}
            setReportType={setReportType}
            reportContent={reportContent}
            setReportContent={setReportContent}
            targetCategory="write_short"
            targetCategoryId={reportTarget.id}
            reportedUsername={reportTarget.username}
            handleRefresh={handleReportSuccess}
          />
        )}
      </div>
    </section>
  )
}

export default WriteShortList
