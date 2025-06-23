import { useEffect, useState } from 'react'
import { HeartIcon, ClockIcon, PenIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '../../atoms'
import { url } from '../../config/config';
import singoIcon from '@assets/singo.png';
import PostcardModal from '@components/write/PostcardModal'

const WriteShortList = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const [selectedColor, setSelectedColor] = useState('mint')
  const [token] = useAtom(tokenAtom)
  const [user] = useAtom(userAtom)
  const [answers, setAnswers] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [page, setPage] = useState(1)
  const [hasWritten, setHasWritten] = useState(null)  // 로그인한 사용자가 글 썼는지
  const [event, setEvent] = useState(null)


  // 색상 매핑
  const getPostItColor = (color) => {
    switch (color) {
      case 'mint':
        return 'bg-[#E8F3F1]'
      case 'yellow':
        return 'bg-[#FFF8E7]'
      case 'pink':
        return 'bg-[#FFE8F3]'
      default:
        return 'bg-[#E8F3F1]'
    }
  }

  const handleReport = (writeshortId) => {
    alert('신고가 접수되었습니다.')
  }

       // 최초 로딩 시: 이벤트 정보 및 답변 목록 불러오기
      useEffect(() => {
        if (!user || !user.username) return // 아직 로딩 안 됨

        fetchEvent()
        fetchAnswers(1)
      }, [user])
      // 이벤트 정보 불러오기
      const fetchEvent = async () => {
        try {
          const res = await axios.get(`${url}/event`)
          setEvent(res.data)
        } catch (err) {
          console.error('이벤트 데이터 불러오기 실패', err)
        }
      }
    // 답변 목록 불러오기
    const fetchAnswers = async (pageNum) => {
      try {
        const res = await axios.get(`${url}/writeShortList?page=${pageNum}&size=10`);
        const { list: writeShortList, pageInfo } = res.data;

        setAnswers(prev => pageNum === 1 ? writeShortList : [...prev, ...writeShortList]);
        setPageInfo(pageInfo);

        const alreadyWrote = writeShortList.some(a => a.username === user.username);
        setHasWritten(alreadyWrote);

      } catch (err) {
        console.error('글 목록 불러오기 실패', err);
      }
    }

  // 추가된 데이터 반영 + 버튼 비활성
  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return

    try {
      const res = await axios.post(`${url}/my/writeShort`, {
        content: answerText,
        color: selectedColor,
      }, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })

      setAnswers([res.data, ...answers])
      setHasWritten(true)
      setAnswerText('')
      setShowModal(false)
    } catch (err) {
      console.error('답변 작성 실패', err)
      alert('작성 실패')
    }
  }

  return (
    <section className="w-full min-h-screen bg-[#F9F9F7] py-8">
      <div className="container mx-auto px-4">
        {/* 탭 메뉴 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/writeList')}
              className="text-xl font-bold text-gray-400"
            >
              전체 글
            </button>
            <button className="text-xl font-bold text-[#006989]">
              읽담한줄
            </button>
          </div>
            {hasWritten !== null && (
              <button
                onClick={() => setShowModal(true)}
                disabled={hasWritten}
                className={`flex items-center px-6 py-2.5 rounded-lg transition-colors 
                  ${hasWritten ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#006989] text-white hover:bg-[#005C78]'}`}
              >
                <PenIcon className="w-5 h-5 mr-2" />
                {hasWritten ? '이미 작성함' : '답변작성'}
              </button>
            )}
            </div>
        {/* 질문 영역 */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-[#E88D67]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-[#006989]">
                {event?.title || '이달의 담소 업데이트 중...'}
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>
                  {event?.startTime
                    ? new Date(event.startTime).toLocaleString('ko-KR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : ''}
                </span>
              </div>
            </div>
          </div>

        {/* Post-it 답변카드들 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {answers.map((answer) => (
          <div
            key={answer.writeshortId}
            className={`${getPostItColor(answer.color)} p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow relative transform hover:-rotate-1 hover:translate-y-[-2px]`}
            style={{
              aspectRatio: '1 / 1',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
              backgroundImage:
                'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
            }}
          >
          {/* 상단: 작성자 & 좋아요 */}
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-sm text-[#006989]">
              {answer.nickname}
            </span>
             <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-gray-600">
                    <HeartIcon className="w-4 h-4" />
                    <span>{answer.likes}</span>
                  </button>
                </div>
          </div>
            {/* 가운데 정렬된 답변 */}
            <div className="flex items-center justify-center h-[70%] pt-16">
              <p className="text-center text-lg font-bold text-gray-500 leading-snug break-words overflow-hidden" 
              style={{fontFamily:'NanumGaram'}}>
                {answer.content}
              </p>
            </div>
            {/* 신고 버튼 */}
            <button
              onClick={() => handleReport(answer.writeshortId)}
              className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"
            >
                <img src={singoIcon} alt="신고" className="w-5 h-5" />
              </button>              
            </div>
          ))}
        </div>
        {/* 더보기 버튼 */}
        {pageInfo && page < pageInfo.totalPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                const nextPage = page + 1
                fetchAnswers(nextPage)
                setPage(nextPage)
              }}
              className="px-4 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50"
            >
              더보기
            </button>
          </div>
        )}

        {/* 모달 컴포넌트 */}
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
      </div>
    </section>
  )
}
export default WriteShortList