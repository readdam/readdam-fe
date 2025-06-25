import { useEffect, useState } from 'react'
import { HeartIcon, ClockIcon, PenIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '../../atoms'
import { url } from '../../config/config';
import singoIcon from '@assets/singo.png';
import PostcardModal from '@components/write/PostcardModal'
import TimeRemainingText from '@components/write/TimeRemainingText';

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
     // 최초 진입 시 (user와 무관)
      useEffect(() => {
        fetchEvent()
        fetchAnswers(1) // 여기도 로그인 관계없이
      }, [])

      useEffect(() => {
        if (!user?.username || !token?.access_token) return; // session 복구되면 실행
        fetchAnswers(1)
      }, [user, token])


      // 로그인 여부 또는 답변 변경 시 작성 여부 확인
      useEffect(() => {
        if (user === undefined) return
        if (user === null) {
          setHasWritten(false)
        } else {
          const alreadyWrote = answers.some((a) => a.username === user.username)
          setHasWritten(alreadyWrote)
        }
      }, [user, answers])

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
            const res = await axios.get(`${url}/writeShortList?page=${pageNum}&size=10`, {
              headers: token?.access_token
                ? { Authorization: `Bearer ${token.access_token}` }
                : {},
            });

        const { list: writeShortList, pageInfo } = res.data;

        setAnswers(prev => pageNum === 1 ? writeShortList : [...prev, ...writeShortList]);
        setPageInfo(pageInfo);

        // 로그인 사용자만 hasWritten 계산
          if (user?.username) {
            const alreadyWrote = writeShortList.some(a => a.username === user.username);
            setHasWritten(alreadyWrote);
          } else {
            setHasWritten(false); // 비로그인 사용자도 버튼이 안 보이도록 처리
          }

      } catch (err) {
        console.error('글 목록 불러오기 실패', err);
      }
    }

  // 추가된 데이터 반영 + 버튼 비활성
  const handleSubmitAnswer = async () => {
      if (!token?.access_token || !user) {
        alert('로그인이 필요한 서비스입니다');
        navigate('/login');
        return;
      }

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

    const handleToggleLike = async (writeShortId) => {
    if (!token?.access_token) {
      alert('로그인이 필요한 서비스입니다');
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${url}/my/writeShort-like`, 
        { writeshortId: writeShortId  },
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      const isLiked = res.data;

      // 상태 반영: answers 배열 내 해당 항목 업데이트
        setAnswers(prevAnswers =>
          prevAnswers.map((answer) =>
            answer.writeshortId === writeShortId
              ? {
                  ...answer,
                  isLiked: isLiked,
                  likes: answer.likes + (isLiked ? 1 : -1),
                }
              : answer
          )
        );
      } catch (err) {
        console.error('좋아요 토글 실패', err);
      }
    };

    useEffect(() => {
    }, [answers]);

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
                  onClick={() => {
                    if (!token?.access_token || !user) {
                      alert('로그인이 필요한 서비스입니다');
                      navigate('/login');
                      return;
                    }
                    setShowModal(true);
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
        {/* 질문 영역 */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-[#E88D67]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-[#006989]">
                {event?.title || '이달의 담소 업데이트 중...'}
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>
                  <TimeRemainingText endDate={event?.endTime} autoUpdate={true} />
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
                  <button
                  onClick={() => handleToggleLike(answer.writeshortId)}
                  className="flex items-center gap-1 text-gray-600">
                    <HeartIcon
                      className={`w-4 h-4 ${answer.isLiked ? 'fill-[#E88D67] text-[#E88D67]' : 'text-gray-400'}`}
                    />
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
        {pageInfo && page < pageInfo.totalPages && (
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