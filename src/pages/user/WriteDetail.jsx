import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BookIcon, ShareIcon, PencilIcon, MessageSquareIcon, CheckCircleIcon, UserIcon, HeartIcon } from 'lucide-react';
import singoIcon from '@assets/singo.png';
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { url } from '../../config/config';
import TimeRemainingText from '@components/write/TimeRemainingText';


// 모달 컴포넌트들을 별도로 분리
import ReportModal from '@components/ReportModal';
import ReportConfirmModal from '@components/ReportConfirmModal';

const WriteDetail = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null); // ✅ 디버깅용 에러 상태 추가
  const [comments, setComments] = useState([]); // 댓글 목록
  const [commentContent, setCommentContent] = useState(''); // 단일 댓글
  const [token] = useAtom(tokenAtom);
  const isLoggedIn = !!token?.access_token;
  const [isAuthor, setIsAuthor] = useState(true); // 작성자 여부
  const [liked, setLiked] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const tags = post ? [post.tag1, post.tag2, post.tag3, post.tag4, post.tag5].filter(Boolean) : [];
  const [user] = useAtom(userAtom); // ← comment 작성자 확인용도
  const { id } = useParams();
  const navigate = useNavigate();
  

  // 글 상세 정보를 가져오는 함수
    const fetchWriteDetail = async (id) => {
      try {
        const headers = token?.access_token
          ? { Authorization: `Bearer ${token.access_token}` }
          : {};

        const response = await axios.get(`${url}/writeDetail/${id}`, {
          headers,
        });

        console.log("✅ liked from server:", response.data.liked);

        setPost(response.data.write);
        setLikeCount(response.data.write.likeCnt);
        setComments(response.data.comments);

        // 로그인한 경우만 liked 상태 반영
        if (token?.access_token) {
          setLiked(response.data.liked);
        } else {
          setLiked(null); // 또는 false, 표시만 회색으로
        }

      } catch (error) {
        console.error("❌ Error fetching write detail:", error);
      }
    };

    const increaseViewCount = async (id) => {
      try {
        await axios.post(`${url}/write-ViewCount`, { writeId: parseInt(id) });
      } catch (err) {
        console.error("❌ 조회수 증가 실패", err);
      }
    };

      // 페이지가 처음 렌더링될 때 데이터 가져오기
      useEffect(() => {
        if (id) {
          fetchWriteDetail(id);
          increaseViewCount(id); // 진입 시마다 +1
        }
      }, [id, token]);

      // 작성자 여부 판단 
      useEffect(() => {
        if (post && user) {
          setIsAuthor(post.username === user.username);
        }
      }, [post, user]);

      const getReviewStatus = (endDate) => {
      if (!endDate) return '첨삭 제외';
      const now = new Date();
      const deadline = new Date(endDate);
      return deadline > now ? '첨삭 가능' : '첨삭 종료';
    };


    const handleSubmitComment = async () => {
      if (!token || !token.access_token) {
        alert("로그인이 필요한 서비스입니다."); // 안내 메시지
        navigate('/login'); // 로그인 페이지로 이동
        return;
      }
      if (!commentContent.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }

      try {
        await axios.post(`${url}/my/comments`, {
          content: commentContent,
          isSecret: isSecret,
          writeId: post.writeId,
        }, {
          headers: {
            Authorization: `Bearer ${token?.access_token}`, // 로그인 상태로 보호된 경우
          },
        });

        // 등록 후 상태 초기화
        setCommentContent('');
        setIsSecret(false);
        fetchWriteDetail(id); // 댓글 목록 다시 불러오기

      } catch (err) {
        console.error('댓글 등록 실패', err);
        alert('댓글 등록 중 오류가 발생했습니다.');
      }
    };
    const typeMap = {
      bookreview: '독후감',
      essay: '수필',
      personal: '자기소개서',
      assignment: '과제',
      other: '기타',
    };
  // 좋아요 처리
    const handleLike = async () => {
      try {
        const response = await axios.post(`${url}/my/write-like`, {
          writeId: post.writeId,
        }, {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        });

        const liked = response.data; // ← boolean 응답 그대로 사용
        setLiked(liked);
        setLikeCount((prev) => liked ? prev + 1 : Math.max(0, prev - 1));

      } catch (error) {
        console.error('좋아요 처리 실패', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
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
    const handleSubmitReport = async () => {
      try {
        await axios.post(`${url}/my/writeShortReport`, {
          type: reportType, // 'post' or 'comment'
          targetId: reportType === 'post' ? post.writeId : reportTargetId,
          content: reportContent,
        }, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        });

        setShowReportModal(false);
        setShowReportConfirm(true);
        setReportType('');
        setReportContent('');
      } catch (err) {
        console.error("신고 실패", err);
        alert("신고 처리 중 오류가 발생했습니다.");
      }
    };

    const handleAdopt = async (commentId) => {
      if (!window.confirm("이 댓글을 채택하시겠습니까?")) return;
      try {
        await axios.post(`${url}/my/writeComment-adopt`, {
          writeCommentId: commentId,
        }, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        });
        fetchWriteDetail(id); // 채택 후 다시 불러오기
      } catch (err) {
        console.error("채택 실패", err);
        alert("채택 처리 중 오류가 발생했습니다.");
      }
    };

  // ✅ 디버깅용
  if (!post && !error) return <div>Loading...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 상단 섹션: 이미지와 메타 정보 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="flex">
            <div className="w-96 h-96 flex-shrink-0">
              {post.img ? (
                <img src={`${url}/image?filename=${post.img}`}
                alt=""
                className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#E88D67] flex items-center justify-center">
                  <BookIcon className="w-24 h-24 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full">{typeMap[post.type]}</span>
                  {[post.tag1, post.tag2, post.tag3, post.tag4, post.tag5]
                    .filter(Boolean)
                    .map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#FDF3F0] text-[#E88D67] text-sm font-medium rounded-full mr-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-6">{post.title}</h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        alert("로그인이 필요한 서비스입니다.");
                        navigate('/login');
                        return;
                      }
                      handleLike(); // 실제 좋아요 처리 함수
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
                      ${liked ? 'text-[#E88D67] bg-[#F3F7EC]' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
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
              <div className="mt-8 p-6 bg-[#FDF3F0] rounded-lg">
                <div className="flex items-center gap-4">
                  {post.profileImg ? (
                    <img
                      src={`${url}/image?filename=${post.profileImg}`}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#F3D5C9] rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-[#E88D67]" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">{post.nickname}</h3>
                    <p className="text-sm text-gray-600">{post.introduce || '자기소개가 없습니다.'}</p>
                  </div>
                </div>
              </div>

              {/* 첨삭 상태 */}
              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                <span className={`font-bold ${getReviewStatus(post.endDate) === '첨삭 가능' ? 'text-[#006989]' : 'text-gray-500'}`}>
                  {getReviewStatus(post.endDate)}
                </span>
                {getReviewStatus(post.endDate) === '첨삭 가능' && (
                  <>
                    <span>•</span>
                    <TimeRemainingText endDate={post.endDate} autoUpdate={true} />
                  </>
                )}
                <span>•</span>
                <span>{post.regDate?.split('T')[0]}</span>
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
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
            <MessageSquareIcon className="w-5 h-5 text-[#006989]" />
            <span>
              첨삭 댓글 <span className="text-gray-500">({comments.length})</span>
            </span>
          </h2>

          {/* 댓글 작성 폼 */}
          {isLoggedIn && (
            <div className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="첨삭 의견을 작성해주세요."
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006989] min-h-[120px] mb-3"
            />

 
              <div className="flex items-center gap-4 mb-4 justify-end">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isSecret"
                    checked={isSecret}
                    onChange={(e) => setIsSecret(e.target.checked)}
                    className="w-4 h-4 accent-[#006989]"
                  />
                  <label htmlFor="isSecret" className="text-sm text-gray-600">
                    글쓴이에게만 보이기
                  </label>
                </div>
                <button
                  onClick={handleSubmitComment}
                  className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
                >
                  작성하기
                </button>
              </div>
            </div>
          )}

          {/* 첨삭 댓글 목록 */}
          <div className="space-y-6">
            {comments
              .filter((comment) => !comment.isHide) // 숨김 처리된 댓글 제외
              .map((comment) => {
                const isOwner = user?.username === post.username; // 글 작성자 여부
                const isCommentAuthor = user?.username === comment.username; // 댓글 작성자 여부

                return (
                  <div
                    key={comment.writeCommentId}
                    className={`p-6 rounded-lg border ${comment.adopted ? 'bg-[#F3F7EC] border-[#006989]' : 'bg-gray-50 border-transparent'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      {/* 작성자 정보 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-[#006989]">{comment.nickname}</span>
                          <span className="text-sm text-gray-500">{comment.regDate?.split('T')[0]}</span>
                        </div>
                        {comment.adopted && (
                          <span className="flex items-center gap-1 text-sm text-[#006989]">
                            <CheckCircleIcon className="w-4 h-4" />
                            채택된 첨삭
                          </span>
                        )}
                      </div>

                      {/* 채택/신고 버튼 */}
                      <div className="flex items-center gap-2">
                        {isOwner && !comment.adopted && (
                          <button
                            className="px-3 py-1 text-sm text-[#006989] border border-[#006989] rounded hover:bg-[#F3F7EC] transition-colors"
                            onClick={() => handleAdopt(comment.writeCommentId)}
                          >
                            채택하기
                          </button>
                        )}
                        <button
                          onClick={() => handleReport('comment', comment.writeCommentId)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <img src={singoIcon} alt="신고" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 댓글 내용 */}
                    {(comment.isSecret && !(isOwner || isCommentAuthor)) ? (
                      <p className="text-gray-400 italic">비밀 첨삭 댓글입니다.</p>
                    ) : (
                      <p className="text-gray-600">{comment.content}</p>
                    )}
                  </div>
                );
              })}
          </div>

        {/* 모달 */}
        {showReportModal && <ReportModal />}
        {showReportConfirm && <ReportConfirmModal />}
      </div>
    </div>
    </div>
  );
};

export default WriteDetail;
