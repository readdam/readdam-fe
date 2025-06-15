import React, { useState } from 'react'
import { HeartIcon, ClockIcon, XIcon, PenIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import singoIcon from '@assets/singo.png';
const WriteShortList = () => {
  const navigate = useNavigate()
  const [showAnswerPopup, setShowAnswerPopup] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const [selectedColor, setSelectedColor] = useState('mint')
  const colorOptions = [
    {
      id: 'mint',
      bg: 'bg-[#E8F3F1]',
    },
    {
      id: 'yellow',
      bg: 'bg-[#FFF8E7]',
    },
    {
      id: 'pink',
      bg: 'bg-[#FFE8F3]',
    },
  ]
  const question = {
    text: '오늘 읽은 책에서 가장 인상 깊었던 구절은 무엇인가요?',
    timestamp: '2일 18시간 32분',
  }
  const [previewAnswers, setPreviewAnswers] = useState([
    {
      id: 1,
      author: '책벌레123',
      content:
        '삶이 그대를 속일지라도 슬퍼하거나 노하지 말라. 슬픈 날을 참고 견디면 기쁜 날이 오리니',
      likes: 12,
      color: 'mint',
    },
    {
      id: 2,
      author: '독서광89',
      content: '우리는 우리가 꿈꾸는 세상을 만들어 갈 수 있다',
      likes: 8,
      color: 'yellow',
    },
    {
      id: 3,
      author: '문학소녀',
      content: '지나간 시간은 다시 돌아오지 않는다. 현재에 최선을 다하라',
      likes: 15,
      color: 'mint',
    },
    {
      id: 4,
      author: '책읽는밤',
      content: '별을 따려면 하늘 높이 올라가야 한다',
      likes: 10,
      color: 'pink',
    },
  ])
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

  const handleReport = (id) => {
    alert('신고가 접수되었습니다.')
  }


  const handleSubmitAnswer = () => {
    if (answerText.trim()) {
      const newAnswer = {
        id: previewAnswers.length + 1,
        author: '사용자',
        content: answerText,
        likes: 0,
        color: selectedColor,
      }
      setPreviewAnswers([newAnswer, ...previewAnswers])
      setAnswerText('')
      setShowAnswerPopup(false)
    }
  }
  // Answer Writing Popup
  const AnswerPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">답변 작성하기</h3>
          <button
            onClick={() => setShowAnswerPopup(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-5 h-5" /></button>
        </div>
        {/* Color Selection */}
        <div className="flex gap-3 mb-4">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-8 h-8 rounded-full ${color.bg} ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-[#006989]' : ''}`}
            />
          ))}
        </div>
        {/* Answer Preview */}
        <div
          className={`${getPostItColor(selectedColor)} p-6 rounded-sm mb-4`}
          style={{
            minHeight: '200px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
            backgroundImage:
              'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
          }}
        >
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="생각을 자유롭게 표현해 보세요"
            className="w-full h-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none"
            maxLength={200}
          />
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowAnswerPopup(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            onClick={handleSubmitAnswer}
            className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78]"
          >
            작성완료
          </button>
        </div>
      </div>
    </div>
  )

  
  return (
    <section className="w-full py-16 bg-white">
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
          <button onClick={() => setShowAnswerPopup(true)} 
          className= "px-6 py-2.5 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
            <PenIcon className="w-5 h-5 mr-2" />답변작성
          </button>
            </div>
        {/* Question Area */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-[#E88D67]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-[#006989]">
              {question.text}
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>{question.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Post-it Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewAnswers.map((answer) => (
            <div
              key={answer.id}
              className={`${getPostItColor(answer.color)} aspect-square p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow relative transform hover:-rotate-1 hover:translate-y-[-2px]`}
              style={{
                boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-medium text-gray-800">
                  {answer.author}
                </span>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-gray-600">
                    <HeartIcon className="w-4 h-4" />
                    <span>{answer.likes}</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-sm line-clamp-5">
                {answer.content}
              </p>
              <button
                onClick={() => handleReport(answer.id)}
                className="absolute bottom-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <img src={singoIcon} alt="신고" className="w-4 h-4" />
              </button>              
            </div>
          ))}
        </div>
        {/* More Button */}
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50">
            더보기
          </button>
        </div>
        {/* Answer Writing Popup */}
        {showAnswerPopup && <AnswerPopup />}
      </div>
    </section>
  )
}
export default WriteShortList
