import React, { useState, useEffect, useRef } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpenIcon, ShareIcon, PencilIcon, MessageSquareIcon, CheckCircleIcon, UserIcon, HeartIcon, EditIcon, TrashIcon } from 'lucide-react';
import singoIcon from '@assets/singo.png';
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { url } from '../../config/config';
import TimeRemainingText from '@components/write/TimeRemainingText';
import { useReportModal } from '@hooks/useReportModal';
import { REPORT_CATEGORY } from '@constants/reportCategory';

const WriteDetail = () => {
  const axios = useAxios();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null); // ✅ 디버깅용 에러 상태 추가
  const [comments, setComments] = useState([]); // 댓글 목록
  const [commentContent, setCommentContent] = useState(''); // 단일 댓글
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [token] = useAtom(tokenAtom);
  const isLoggedIn = !!token?.access_token;
  const [isAuthor, setIsAuthor] = useState(true); // 작성자 여부
  const [liked, setLiked] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isSecret, setIsSecret] = useState(false);
  const tags = post ? [post.tag1, post.tag2, post.tag3, post.tag4, post.tag5].filter(Boolean) : [];
  const [user] = useAtom(userAtom); // ← comment 작성자 확인용도
  const { id } = useParams();
  const navigate = useNavigate();
  const called = useRef(false); // StrictMode 때문에 useEffect 두 번 실행되지 않도록 방지
  const isAdmin = user?.isAdmin === true;
  const isUrl = (path) => path?.startsWith('http://') || path?.startsWith('https://');

  // 글 상세 정보를 가져오는 함수
  const fetchWriteDetail = async (id) => {
    try {

      const response = await axios.get(`${url}/writeDetail/${id}`);

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
    if (id && !called.current) {
      fetchWriteDetail(id);
      increaseViewCount(id); // 진입 시마다 +1
      called.current = true;
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
      if (editingCommentId) {
        // 수정
        await axios.put(`${url}/my/comments`, {
          writeCommentId: editingCommentId,
          content: commentContent,
          isSecret: isSecret,
        });
      } else {
        // 신규작성
        await axios.post(`${url}/my/comments`, {
          content: commentContent,
          isSecret: isSecret,
          writeId: post.writeId,
        });
      }
      // 공통 후 처리
      setEditingCommentId(null);
      setCommentContent('');
      setIsSecret(false);
      fetchWriteDetail(id); // 댓글 목록 다시 불러오기

    } catch (err) {
      console.error('댓글 등록/수정 실패', err);
      alert('댓글 저장 시 오류가 발생했습니다.');
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

  // 내 글 여부 체크
  const isMyPost = post?.username === user?.username;

  // 댓글 작성 체크
  const hasCommentByMe = comments.some(
    (c) => c.username === user?.username
  );

  // 신고 처리 훅 호출
  const {
    openReportModal,
    ReportModalComponent,
  } = useReportModal({
    defaultCategory: REPORT_CATEGORY.WRITE,
    onSuccess: () => {
    },
  });

  const handleAdopt = async (commentId) => {
    if (!window.confirm('이 댓글을 채택하시겠습니까?')) return;

    try {
      await axios.post(`${url}/my/writeComment-adopt`, { writeCommentId: commentId });
      fetchWriteDetail(id);
    } catch (err) {
      const msg = err.response?.data;
      if (msg === '포인트가 부족합니다.') {
        alert('포인트가 부족합니다. 포인트를 충전해주세요.');
      } else {
        console.error('채택 실패', err);
        alert('채택 처리 중 오류가 발생했습니다.');
      }
    }
  };

  // 정렬
  const sortedComments = comments
    .filter((comment) => !comment.isHide)
    .sort((a, b) => {
      if (a.adopted === b.adopted) return 0;
      return a.adopted ? -1 : 1;
    });

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.put(`${url}/my/writeComment-hide`, {
        writeCommentId: commentId,
      });
      fetchWriteDetail(id);
    } catch (err) {
      console.error("댓글 삭제 실패", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
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
            <div className="w-96 h-96 flex-shrink-0 flex items-center justify-center bg-[#FCD5C9] rounded-lg">
              {post.img ? (
                isUrl(post.img) ? (
                  // 북커버 (URL) → 2:3 축소
                  <img
                    src={post.img}
                    alt=""
                    className="w-40 h-60 object-cover rounded-md"
                  />
                ) : (
                  // 업로드 이미지 → 네모 꽉 차게
                  <img
                    src={`${url}/image?filename=${post.img}`}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                )
              ) : (
                <div className="w-full h-full bg-[#FCD5C9] flex items-center justify-center">
                  <BookOpenIcon className="w-24 h-24 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm font-medium rounded-full">{typeMap[post.writeType]}</span>
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
                    {isAuthor && isLoggedIn ? (
                      <button
                        onClick={() => navigate(`/writeModify/${post.writeId}`)}
                        className="flex items-center gap-2 px-4 py-2 text-[#006989] rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5" />
                        <span>수정하기</span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          openReportModal({
                            id: post.writeId,
                            username: post.username,
                          })
                        }
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <img src={singoIcon} alt="신고" className="w-5 h-5" />
                        <span>신고하기</span>
                      </button>
                    )}
                  </div>
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

        {/* 첨삭 제외가 아닐 때만 댓글 영역 표시 */}
        {getReviewStatus(post.endDate) !== '첨삭 제외' && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
              <MessageSquareIcon className="w-5 h-5 text-[#006989]" />
              <span>
                첨삭 댓글 <span className="text-gray-500">({comments.length})</span>
              </span>
            </h2>

            {/* 첨삭 가능할 때만 작성 폼 노출 */}
            {isLoggedIn &&
              getReviewStatus(post.endDate) === '첨삭 가능' &&
              post.username !== user?.username &&
              (!comments.some(c => c.username === user?.username) || editingCommentId) && (
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
                    {editingCommentId ? (
                      <>
                        <button
                          onClick={handleSubmitComment}
                          className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
                        >
                          수정하기
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setCommentContent('');
                            setIsSecret(false);
                          }}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleSubmitComment}
                        className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
                      >
                        작성하기
                      </button>
                    )}
                  </div>
                </div>
              )}

            {/* 내 글 안내 문구 */}
            {isLoggedIn &&
              getReviewStatus(post.endDate) === '첨삭 가능' &&
              post.username === user?.username && (
                <p className="text-sm text-gray-500 mt-4 mb-4">
                  본인이 작성한 글에는 댓글을 작성할 수 없습니다.
                </p>
              )}

            {/* 이미 댓글 작성했을 때 안내문구 */}
            {isLoggedIn &&
              getReviewStatus(post.endDate) === '첨삭 가능' &&
              post.username !== user?.username &&
              comments.some(c => c.username === user?.username) && (
                <p className="text-sm text-gray-500 mt-4 mb-4">
                  이미 이 글에 댓글을 작성하셨습니다.
                </p>
              )}

            {/* 첨삭 댓글 목록 */}
            <div className="space-y-6">
              {sortedComments.map((comment) => {
                const isOwner = user?.username === post.username; // 글 작성자 여부
                const isCommentAuthor = user?.username === comment.username; // 댓글 작성자 여부

                return (
                  <div
                    key={comment.writeCommentId}
                    className={`p-6 rounded-lg border ${comment.adopted ? 'bg-[#F3F7EC] border-[#006989]' : 'bg-gray-50 border-transparent'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      {/* 작성자 정보 */}
                      {/* 프로필 이미지 */}
                      {comment.profileImg ? (
                        <img
                          src={`${url}/image?filename=${comment.profileImg}`}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#F3D5C9] rounded-full flex items-center justify-center">
                          <UserIcon className="w-8 h-8 text-[#E88D67]" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-2 flex-wrap">
                          {/* 닉네임 + 날짜 */}
                          <div className="flex items-center gap-2">
                            <span className="ml-3 font-medium text-[#006989]">{comment.nickname}</span>
                            <span className="text-sm text-gray-500">{comment.regDate?.split('T')[0]}</span>
                          </div>
                          {comment.adopted && (
                            <span className="flex items-center gap-1 text-sm text-[#006989]">
                              <CheckCircleIcon className="w-4 h-4" />
                              <span className="relative -top-[2px]">채택된 첨삭</span><span>  </span>
                            </span>
                          )}
                        </div>
                      </div>



                      {/* 채택/신고 버튼 */}
                      <div className="flex items-center gap-2">
                        {isAuthor && !isCommentAuthor && !comment.adopted && (
                          <button
                            className="px-3 py-1 text-sm text-[#006989] border border-[#006989] rounded hover:bg-[#F3F7EC] transition-colors"
                            onClick={() => handleAdopt(comment.writeCommentId)}
                          >
                            채택하기
                          </button>
                        )}

                        {!isCommentAuthor && (
                          <button
                            onClick={() => openReportModal({
                              id: comment.writeCommentId,
                              username: comment.username,
                            },
                              REPORT_CATEGORY.WRITE_COMMENT
                            )
                            }
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <img src={singoIcon} alt="신고" className="w-4 h-4" />
                          </button>
                        )}

                        {isCommentAuthor && (
                          <>
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.writeCommentId);
                                setCommentContent(comment.content);
                                setIsSecret(comment.isSecret ?? false);
                              }}
                              className="text-gray-500 hover:text-[#006989]"
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.writeCommentId)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 댓글 내용 */}
                    {(comment.isSecret && !(isOwner || isCommentAuthor || isAdmin)) ? (
                      <p className="text-gray-400 italic">비밀 첨삭 댓글입니다.</p>
                    ) : (
                      <p className="text-gray-600">{comment.content}</p>
                    )}


                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 모달 */}
        {ReportModalComponent}
      </div>
    </div>
  );
};

export default WriteDetail;
