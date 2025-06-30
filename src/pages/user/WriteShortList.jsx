import { useEffect, useState } from 'react'
import { HeartIcon, PenIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '../../atoms'
import { url } from '../../config/config';
import PostcardModal from '@components/write/PostcardModal'
import TimeRemainingText from '@components/write/TimeRemainingText';
import PostItCard from '@components/write/PostItCard';

const WriteShortList = () => {
  const axios = useAxios();
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
  const [totalCount, setTotalCount] = useState(0);

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
            const res = await axios.get(`${url}/writeShortList?page=${pageNum}&size=10`);

        const { list: writeShortList, pageInfo, totalCount } = res.data;

        setAnswers(prev => pageNum === 1 ? writeShortList : [...prev, ...writeShortList]);
        setPageInfo(pageInfo);
        setTotalCount(totalCount || 0);

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

    // useEffect(() => {
    // }, [answers]);

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

        {/* 총 글 수 표시 */}
        {totalCount > 0 && (
            <div className="text-gray-500 text-sm mt-4 mb-8">
              총 {totalCount.toLocaleString()}개의 글
            </div>
          )} 

        {/* Post-it 답변카드들 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {answers.map((answer) => (
            <PostItCard
              key={answer.writeshortId}
              color={answer.color}
              nickname={answer.nickname}
              content={answer.content}
              likes={answer.likes}
              isLiked={answer.isLiked}
              onLikeClick={() => handleToggleLike(answer.writeshortId)}
              onReportClick={() => handleReport(answer.writeshortId)}
            />
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