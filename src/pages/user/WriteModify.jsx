import React, { useState, useEffect } from 'react';
import {
  BookIcon,
  CheckCircleIcon,
  SaveIcon,
  SearchIcon,
  UploadIcon,
} from 'lucide-react';
import { useAxios } from '../../hooks/useAxios';
import { url } from '../../config/config';
import { useNavigate, useParams } from 'react-router-dom';
import WriteTagSection from "@components/write/WriteTagSection";

const WriteModify = () => {
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: '',
    visibility: 'public',
    needReview: false,
    reviewDeadline: '',
    title: '',
    content: '',
    image: null,
    imagePreview: null,
  });

  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [showGuideQuestions, setShowGuideQuestions] = useState(false);
  const [isSpellchecking, setIsSpellchecking] = useState(false);
  const [tags, setTags] = useState([]);
  const [isReviewDeadlinePassed, setIsReviewDeadlinePassed] = useState(false);
  const [commentCnt, setCommentCnt] = useState(0);

  // 기존 글 정보 로드
  useEffect(() => {
    const fetchWriteDetail = async () => {
      try {
        const res = await axios.get(`${url}/writeDetail/${id}`);
        const post = res.data.write;

        const tagsArr = [
          post.tag1,
          post.tag2,
          post.tag3,
          post.tag4,
          post.tag5,
        ].filter(Boolean);

        setTags(tagsArr);

        const deadlinePassed =
          post.endDate && new Date(post.endDate) < new Date();

        setIsReviewDeadlinePassed(deadlinePassed);

        setFormData({
          type: post.type || '',
          visibility: post.hide ? 'private' : 'public',
          needReview: !!post.endDate,
          reviewDeadline: post.endDate ? post.endDate.slice(0, 16) : '',
          title: post.title,
          summary: '',
          content: post.content,
          image: null,
          imagePreview: null,
        });

        setCommentCnt(post.commentCnt || 0);

        if (post.img) {
          setOriginalImageUrl(`${url}/image?filename=${post.img}`);
        }
      } catch (err) {
        console.error('❌ 글 상세 불러오기 실패', err);
      }
    };

    if (id) {
      fetchWriteDetail();
    }
  }, [id]);

  // 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append('writeId', id);
      payload.append('type', formData.type);
      payload.append('visibility', formData.visibility);
      payload.append('needReview', formData.needReview ? 'true' : 'false');
      payload.append('endDate', formData.reviewDeadline || '');
      payload.append('title', formData.title);
      payload.append('content', formData.content);

      // ✅ tags 배열 사용
      tags.slice(0, 5).forEach((tag, index) => {
        payload.append(`tag${index + 1}`, tag);
      });
      for (let i = tags.length + 1; i <= 5; i++) {
        payload.append(`tag${i}`, "");
      }

      if (formData.image) {
        payload.append('ifile', formData.image);
      }

      await axios.post(`${url}/my/writeModify/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('글이 수정되었습니다!');
      navigate(`/writeDetail/${id}`);
    } catch (error) {
      console.error('❌ 글 수정 실패', error);
      alert('글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleTempSave = () => {
    alert('임시 저장되었습니다. 나의 글쓰기 목록에서 확인할 수 있어요.');
  };

  const handleSpellCheck = () => {
    setIsSpellchecking(true);
    setTimeout(() => {
      setIsSpellchecking(false);
      alert('맞춤법 검사가 완료되었습니다.');
    }, 1500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
      setOriginalImageUrl(null);
    }
  };

  const handleSearchCover = () => {
    alert('북커버 검색 기능은 준비 중입니다.');
  };

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              글 수정하기
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    글 종류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    value={formData.type ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">선택해주세요</option>
                    <option value="bookreview">독후감</option>
                    <option value="essay">수필</option>
                    <option value="personal">자기소개서</option>
                    <option value="assignment">과제</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공개 범위 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    value={formData.visibility ?? ''}
                    onChange={(e) =>{
                      if (
                        e.target.value === 'private' &&
                        commentCnt > 0
                      ) {
                        alert(
                          '댓글이 달린 글은 비공개로 전환할 수 없습니다.'
                        );
                        return;
                      }


                      setFormData({
                        ...formData,
                        visibility: e.target.value,
                        needReview:
                          e.target.value === 'private'
                            ? false
                            : formData.needReview,
                      });
                    }}
                    required
                  >
                    <option value="public">전체 공개</option>
                    <option value="private">비공개</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 등록
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-48 h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="업로드 미리보기"
                        className="w-full h-full object-cover"
                      />
                    ) : originalImageUrl ? (
                      <img
                        src={originalImageUrl}
                        alt="기존 이미지"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#E88D67]">
                        <BookIcon className="w-20 h-20 text-white" />
                      </div>
                    )}
                  </div>

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

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="needReview"
                  className="mr-2"
                  checked={formData.needReview}
                  onChange={(e) => {
                  if (
                    !e.target.checked && // 첨삭 해제 시도
                    commentCnt > 0
                  ) {
                    alert(
                      '댓글이 달린 글은 첨삭 여부를 해제할 수 없습니다.'
                    );
                    return;
                  }
                    setFormData({
                      ...formData,
                      needReview: e.target.checked,
                    })
                  }}
                    disabled={formData.visibility === 'private'}
                  
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
                    disabled={isReviewDeadlinePassed} // 마감 시 비활성화
                  />
                  {/* 날짜 마감 시 안내문구 */}
                  {isReviewDeadlinePassed && (
                    <p className="text-sm text-red-500 mt-2">
                      첨삭 마감일이 이미 지났습니다. 날짜를 수정할 수 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                글 제목 <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">
                  (최대 100자)
                </span>
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

            <WriteTagSection tags={tags} setTags={setTags} />

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
  );
};

export default WriteModify;
