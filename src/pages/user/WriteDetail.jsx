import React, { useState } from 'react'
import {
  ThumbsUpIcon,
  ShareIcon,
  PencilIcon,
  CheckCircleIcon,
  BookIcon,
  MessageSquareIcon,
  HeartIcon,
  XIcon,
  CheckSquareIcon,
} from 'lucide-react'
import singoIcon from '@assets/singo.png';
const WriteDetail = () => {
  const [isLoggedIn] = useState(true)
  const [isAuthor] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(24)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showReportConfirm, setShowReportConfirm] = useState(false)
  const [reportType, setReportType] = useState('')
  const [reportContent, setReportContent] = useState('')
  const [showAuthorOnly, setShowAuthorOnly] = useState(false)
  const [reportTarget, setReportTarget] = useState('post')
  const [reportTargetId, setReportTargetId] = useState(null)
  const post = {
    id: 1,
    title: '미움받을 용기를 읽고 나서: 아들러 심리학의 통찰',
    category: '독후감',
    author: {
      name: 'reader123',
      profile: 'https://api.dicebear.com/7.x/personas/svg?seed=reader123',
      introduction:
        '독서와 글쓰기를 사랑하는 평범한 직장인입니다. 주로 심리학, 철학 관련 도서를 읽고 리뷰를 작성합니다.',
    },
    createdAt: '2023.11.10',
    content: `아들러의 "미움받을 용기"를 읽으면서 가장 인상 깊었던 부분은 '과제의 분리'에 대한 내용이었습니다. 타인의 과제와 자신의 과제를 명확히 구분하고, 자신의 과제에만 집중하는 것이 진정한 용기라는 관점이 신선했습니다.
현대 사회에서 우리는 끊임없이 타인의 시선과 평가에 신경 쓰며 살아갑니다. SNS에서 보여지는 타인의 삶과 자신을 비교하며 불안해하고, 다른 사람들의 기대에 부응하기 위해 본인의 진정한 욕구와 목표를 잃어버리기도 합니다.
아들러는 이러한 현상을 '타인의 과제에 개입하는 것'이라고 설명합니다. 타인이 나를 어떻게 평가할지, 나의 선택을 어떻게 생각할지는 전적으로 타인의 과제입니다. 내가 할 수 있는 최선을 다해 살아가고, 그 과정에서 겪게 되는 감정과 결과를 받아들이는 것이 나의 과제입니다.
이러한 관점은 제게 큰 위로가 되었습니다. 항상 주변의 기대와 평가에 민감하게 반응하며 살아왔던 제게, '타인의 과제에서 벗어나라'는 메시지는 마치 묵직한 짐을 내려놓는 것 같은 해방감을 주었습니다.
특히 인상 깊었던 구절은 "당신의 인생에서 중요한 것은 타인의 평가가 아니라 당신이 스스로를 어떻게 평가하느냐이다"라는 부분이었습니다. 이는 단순히 타인의 시선을 무시하라는 의미가 아닙니다. 오히려 타인과의 관계 속에서 자신의 역할과 책임을 명확히 인식하고, 그 안에서 진정한 자유를 발견하라는 의미로 이해했습니다.
책을 읽으며 많은 질문을 던져보았습니다. '나는 얼마나 많은 시간을 타인의 과제에 소비하고 있는가?' '내가 정말로 원하는 것은 무엇인가?' '나는 왜 타인의 평가에 이토록 민감한가?' 이러한 질문들은 제 삶을 돌아보는 소중한 기회가 되었습니다.
아들러 심리학의 핵심은 '용기'입니다. 미움받을 용기, 불완전할 용기, 평범할 용기... 이 모든 것은 결국 '나답게 살 용기'로 귀결됩니다. 타인의 과제에서 벗어나 자신의 과제에 집중하는 것, 그것이 바로 진정한 용기의 시작이 아닐까 생각합니다.
이 책은 단순한 자기계발서가 아닙니다. 인생의 본질적인 문제들에 대해 깊이 있게 고찰할 수 있는 기회를 제공하는 철학서이자, 현대인들에게 꼭 필요한 심리학적 통찰을 담은 안내서입니다.
마지막으로, 이 책을 통해 깨달은 가장 중요한 것은 '미움받을 용기'가 결국 '나를 사랑할 용기'라는 점입니다. 타인의 평가와 기대에서 자유로워질 때, 비로소 우리는 진정한 자아를 발견하고 성장할 수 있습니다.`,
    status: '첨삭가능',
    timeLeft: '2일 3시간',
    thumbnail:
      'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788996991342.jpg',
  }
  const comments = [
    {
      id: 1,
      author: 'critic_kim',
      content:
        '아들러 심리학의 핵심을 잘 파악하셨네요. 다만 과제의 분리 부분에서 좀 더 구체적인 예시를 들어주시면 독자의 이해를 돕는데 좋을 것 같습니다.',
      createdAt: '2023.11.11',
      isAccepted: true,
    },
    {
      id: 2,
      author: 'book_lover',
      content:
        '전반적으로 잘 쓰셨습니다. 다만 첫 단락의 문장 구조가 조금 어색한데, 좀 더 자연스럽게 다듬으면 좋을 것 같아요.',
      createdAt: '2023.11.12',
      isAccepted: false,
    },
  ]
  const handleLike = () => {
    if (isLoggedIn) {
      setLiked(!liked)
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
    }
  }
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('링크가 복사되었습니다.')
  }
    const handleReport = (type, id) => {
    if (type !== 'post' && type !== 'comment') return

    setReportTarget(type)
    setReportTargetId(id || null)
    setShowReportModal(true)
    }
  const handleSubmitReport = () => {
    setShowReportModal(false)
    setShowReportConfirm(true)
    // Reset form
    setReportType('')
    setReportContent('')
  }
  const ReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">신고하기</h3>
          <button onClick={() => setShowReportModal(false)}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-200 rounded-lg"
        >
          <option value="">신고유형을 선택해주세요</option>
          <option value="spam">스팸/도배성 글</option>
          <option value="inappropriate">부적절한 내용</option>
          <option value="copyright">저작권 침해</option>
          <option value="other">기타</option>
        </select>
        <textarea
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
          placeholder="신고 사유(내용)을 작성주세요"
          className="w-full h-32 p-2 border border-gray-200 rounded-lg mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            onClick={handleSubmitReport}
            className="px-4 py-2 bg-[#E88D67] text-white rounded-lg"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  )
  const ReportConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center">
        <p className="mb-4">신고글이 등록되었습니다.</p>
        <button
          onClick={() => setShowReportConfirm(false)}
          className="px-4 py-2 bg-[#006989] text-white rounded-lg"
        >
          확인
        </button>
      </div>
    </div>
  )
  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 상단 섹션: 이미지와 메타 정보 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="flex">
            {/* 좌측 이미지 */}
            <div className="w-96 h-96 flex-shrink-0">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#E88D67] flex items-center justify-center">
                  <BookIcon className="w-24 h-24 text-white" />
                </div>
              )}
            </div>
            {/* 우측 메타 정보 */}
            <div className="flex-1 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-6">
                    {post.title}
                  </h1>
                </div>
                {/* 좋아요/공유/신고 버튼 묶음 */}
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${liked ? 'text-[#E88D67] bg-[#F3F7EC]' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <HeartIcon className={`w-5 h-5 ${liked ? 'fill-[#E88D67]' : ''}`} />
                        <span>{likeCount}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ShareIcon className="w-5 h-5" />
                        <span>공유하기</span>
                    </button>
                    <button
                        onClick={() => handleReport('post')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <img src={singoIcon} alt="신고" className="w-5 h-5" />
                        <span>신고하기</span>
                    </button>
                    </div>
                    {/* 수정하기 버튼 한 줄 아래로 */}
                    {isAuthor && (
                    <div className="flex justify-end mt-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-[#006989] rounded-lg hover:bg-gray-100 transition-colors">
                        <PencilIcon className="w-5 h-5" />
                        <span>수정하기</span>
                        </button>
                    </div>
                    )}
                </div>
              </div>
              {/* 작성자 프로필 */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={post.author.profile}
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      {post.author.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {post.author.introduction}
                    </p>
                  </div>
                </div>
              </div>
              {/* 첨삭 상태 */}
              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                <span
                  className={`font-medium ${post.status === '첨삭가능' ? 'text-[#E88D67]' : 'text-gray-500'}`}
                >
                  {post.status}
                </span>
                {post.timeLeft && (
                  <>
                    <span>•</span>
                    <span>마감까지 {post.timeLeft}</span>
                  </>
                )}
                <span>•</span>
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
        {/* 본문 내용 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="prose max-w-none text-gray-600 whitespace-pre-line">
            {post.content}
          </div>
        </div>
        {/* 첨삭 댓글 영역 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-[#006989]" />
              첨삭 댓글{' '}
              <span className="text-gray-500">({comments.length})</span>
            </h2>
          </div>
          {/* 댓글 작성 폼 */}
          {isLoggedIn && (
            <div className="mb-8">
              <textarea
                placeholder="첨삭 의견을 작성해주세요."
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006989] min-h-[120px] mb-3"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
                    작성하기
                  </button>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={showAuthorOnly}
                      onChange={(e) => setShowAuthorOnly(e.target.checked)}
                      className="rounded border-gray-300 text-[#006989] focus:ring-[#006989]"
                    />
                    글쓴이에게만 보이기
                  </label>
                </div>
              </div>
            </div>
          )}
          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-6 rounded-lg ${comment.isAccepted ? 'bg-[#F3F7EC] border-[#006989]' : 'bg-gray-50'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-[#006989]">
                        {comment.author}
                      </span>
                      <span className="text-sm text-gray-500">
                        {comment.createdAt}
                      </span>
                    </div>
                    {comment.isAccepted && (
                      <span className="flex items-center gap-1 text-sm text-[#006989]">
                        <CheckCircleIcon className="w-4 h-4" />
                        채택된 첨삭
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isAuthor && !comment.isAccepted && (
                      <button className="px-3 py-1 text-sm text-[#006989] border border-[#006989] rounded hover:bg-[#F3F7EC] transition-colors">
                        채택하기
                      </button>
                    )}
                    <button
                      onClick={() => handleReport('comment', comment.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <img src={singoIcon} alt="신고"  className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Modals */}
        {showReportModal && <ReportModal />}
        {showReportConfirm && <ReportConfirmModal />}
      </div>
    </div>
  )
}
export default WriteDetail
