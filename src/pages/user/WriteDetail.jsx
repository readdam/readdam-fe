import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUpIcon, ShareIcon, PencilIcon, MessageSquareIcon, CheckCircleIcon } from 'lucide-react';
import singoIcon from '@assets/singo.png';

// 모달 컴포넌트들을 별도로 분리
import ReportModal from './ReportModal';
import ReportConfirmModal from './ReportConfirmModal';

const WriteDetail = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 여부
  const [isAuthor, setIsAuthor] = useState(true); // 작성자 여부
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [showAuthorOnly, setShowAuthorOnly] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // 글 상세 정보를 가져오는 함수
  const fetchWriteDetail = async (id) => {
    try {
      const response = await axios.get(`/writedetail/${id}`);
      const data = response.data;
      setPost(data.write);
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching write detail:', error);
    }
  };

  // 페이지가 처음 렌더링될 때 데이터 가져오기
  useEffect(() => {
    if (id) {
      fetchWriteDetail(id);
    }
  }, [id]);

  // 좋아요 처리
  const handleLike = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  // 공유 처리
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
  };

  // 신고 처리
  const handleReport = (type, targetId) => {
    if (type !== 'post' && type !== 'comment') return;
    setShowReportModal(true);
  };

  // 신고 제출
  const handleSubmitReport = () => {
    setShowReportModal(false);
    setShowReportConfirm(true);
    setReportType('');
    setReportContent('');
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 상단 섹션: 이미지와 메타 정보 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="flex">
            <div className="w-96 h-96 flex-shrink-0">
              {post.thumbnail ? (
                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#E88D67] flex items-center justify-center">
                  <BookIcon className="w-24 h-24 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full">{post.category}</span>
                  <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-6">{post.title}</h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${liked ? 'text-[#E88D67] bg-[#F3F7EC]' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <HeartIcon className={`w-5 h-5 ${liked ? 'fill-[#E88D67]' : ''}`} />
                      <span>{likeCount}</span>
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                      <span>공유하기</span>
                    </button>
                    <button onClick={() => handleReport('post', post.writeId)} className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <img src={singoIcon} alt="신고" className="w-5 h-5" />
                      <span>신고하기</span>
                    </button>
                  </div>
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
                  <img src={post.author.profile} alt={post.author.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">{post.author.name}</h3>
                    <p className="text-sm text-gray-600">{post.author.introduction}</p>
                  </div>
                </div>
              </div>

              {/* 첨삭 상태 */}
              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                <span className={`font-medium ${post.status === '첨삭가능' ? 'text-[#E88D67]' : 'text-gray-500'}`}>{post.status}</span>
                {post.timeLeft && <span>마감까지 {post.timeLeft}</span>}
                <span>•</span>
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="prose max-w-none text-gray-600 whitespace-pre-line">{post.content}</div>
        </div>

        {/* 댓글 영역 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            <MessageSquareIcon className="w-5 h-5 text-[#006989]" />
            첨삭 댓글 <span className="text-gray-500">({comments.length})</span>
          </h2>

          {/* 댓글 작성 폼 */}
          {isLoggedIn && (
            <div className="mb-8">
              <textarea placeholder="첨삭 의견을 작성해주세요." className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006989] min-h-[120px] mb-3" />
              <button className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">작성하기</button>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className={`p-6 rounded-lg ${comment.isAccepted ? 'bg-[#F3F7EC] border-[#006989]' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-[#006989]">{comment.author}</span>
                      <span className="text-sm text-gray-500">{comment.createdAt}</span>
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
                      <button className="px-3 py-1 text-sm text-[#006989] border border-[#006989] rounded hover:bg-[#F3F7EC] transition-colors">채택하기</button>
                    )}
                    <button onClick={() => handleReport('comment', comment.id)} className="text-gray-500 hover:text-gray-700">
                      <img src={singoIcon} alt="신고" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 모달 */}
        {showReportModal && <ReportModal />}
        {showReportConfirm && <ReportConfirmModal />}
      </div>
    </div>
  );
};

export default WriteDetail;
