import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { useAxios } from '../../hooks/useAxios';
import { url } from '../../config/config';
import WriteTagSection from "@components/write/WriteTagSection";
import BookCoverSearchModal from "@components/write/BookCoverSearchModal";
import {
  BookIcon,
  SaveIcon,
  CheckCircleIcon,
  SearchIcon,
  UploadIcon,
} from 'lucide-react'
const isUrl = (path) => path?.startsWith('http://') || path?.startsWith('https://');
const WriteCreate = () => {
  const axios = useAxios();
  const [formData, setFormData] = useState({
    type: '',
    visibility: 'public',
    needReview: false,
    reviewDeadline: '',
    title: '',
    content: '',
    image: null
  });
  const [showGuideQuestions, setShowGuideQuestions] = useState(true)
  const [isSpellchecking, setIsSpellchecking] = useState(false)
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const [ifile, setIfile] = useState(null);
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const submit = (e) => {
    e.preventDefault();
    //일반필드
    const submitData = new FormData();
    submitData.append("type", formData.type);
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    submitData.append("username", user.username); 
    submitData.append("visibility", formData.visibility);
    if (formData.needReview && formData.reviewDeadline) {
      const formattedDeadline = formData.reviewDeadline.length === 16
        ? formData.reviewDeadline + ':00'
        : formData.reviewDeadline;
      submitData.append("endDate", formattedDeadline);
    }
 
    // TAG 배열 → FormData 로 전송
    tags.forEach((tag, i) => {
      submitData.append(`tag${i + 1}`, tag);
    });
    for (let i = tags.length + 1; i <= 5; i++) {
      submitData.append(`tag${i}`, "");
    }

    //이미지
    if (ifile) {
      submitData.append("ifile", ifile);
    } else if (formData.image) {
      submitData.append("thumbnailUrl", formData.image);
    }

    axios.post(`${url}/my/write`, submitData)
      .then((res) => {
        console.log(res);


        navigate(`/writeDetail/${res.data.writeId}`); 
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const TempSave = () => {
    // 임시저장 로직 구현 필요
    alert('임시 저장되었습니다. 나의 글쓰기 목록에서 확인할 수 있어요.')
  }
  const SpellCheck = () => {
    setIsSpellchecking(true)
    // 맞춤법 검사 로직 구현 필요
    setTimeout(() => {
      setIsSpellchecking(false)
      alert('맞춤법 검사가 완료되었습니다.')
    }, 1500)
  }
    const readURL = (input) => {
      const file = input.target.files[0]; 
      const reader = new FileReader();

      reader.onload = function(e) {
        setFormData({
          ...formData,
          image: e.target.result, 
        });
      };

      reader.readAsDataURL(file);
      setIfile(file); 
    };
  
  const [showBookModal, setShowBookModal] = useState(false);
  const handleSearchCover = () => {
   setShowBookModal(true);
  }
  const handleSelectCover = (thumbnailUrl) => {
  setFormData({
    ...formData,
    image: thumbnailUrl,
  });
  setIfile(null); // 기존 업로드 파일 제거
  setShowBookModal(false);
};
  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <form onSubmit={submit}>
          {/* 상단 제목 영역 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              새 글 작성하기
            </h1>
            {/* 기본 정보 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 좌측 컬럼 */}
              <div className="space-y-6">
                {/* 글 종류 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    글 종류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    value={formData.type}
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
                {/* 공개 범위 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공개 범위 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visibility: e.target.value,
                        needReview: e.target.value === 'private' ? false : formData.needReview // 비공개 선택 시 첨삭 해제
                      })
                    }
                    required
                  >
                    <option value="public">전체 공개</option>
                    <option value="private">비공개</option>
                  </select>
                </div>
              </div>
              {/* 우측 컬럼 - 이미지 업로드 */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 등록
                </label>
                {/* 프리뷰 + 버튼을 가로 정렬 */}
                <div className="flex gap-4 items-start">
                    {/* 이미지 프리뷰 */}
                    <div className="w-48 h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {formData.image ? (
                      formData.image.startsWith('http://') || formData.image.startsWith('https://') ? (
                        <div className="w-28 h-42 bg-[#FCD5C9] flex items-center justify-center rounded-lg overflow-hidden">
                          <img
                            src={formData.image}
                            alt="북커버 미리보기"
                            className="w-28 h-42 object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <img
                          src={formData.image}
                          alt="업로드 이미지"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FCD5C9]">
                        <BookIcon className="w-20 h-20 text-white" />
                      </div>
                    )}
                  </div>

                    {/* 버튼 그룹 - 세로 정렬 */}
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
                        name="ifile" 
                        accept="image/*"
                        className="hidden"
                        onChange={readURL}
                        />
                    </label>
                    </div>
                </div>
                </div>
            </div>
            {/* 첨삭 설정 */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="needReview"
                  className="mr-2"
                  checked={formData.needReview}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      needReview: e.target.checked,
                    })
                  }
                  disabled={formData.visibility === 'private'} //비공개 선택 시 체크박스 비활성
                />
                <label
                  htmlFor="needReview"
                    className={`text-sm font-medium ${
                    formData.visibility === 'private'
                      ? 'text-gray-400 cursor-not-allowed' //비공개 선택 시 텍스트 흐리게
                      : 'text-gray-700'
                  }`}
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
                  />
                </div>
              )}
            </div>
          </div>
          {/* 글 작성 영역 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* 제목 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                글 제목 <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">(최대 100자)</span>
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
            {/* 태그 */}
            <WriteTagSection tags={tags} setTags={setTags} />
            {/* 본문 작성 */}
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
          </div>
          {/* 하단 버튼 그룹 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={SpellCheck}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                맞춤법 검사
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={TempSave}
                className="px-6 py-2 text-[#006989] border border-[#006989] rounded-lg hover:bg-[#F3F7EC] transition-colors flex items-center gap-2"
              >
                <SaveIcon className="w-5 h-5" />
                임시저장
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
              >
                등록하기
              </button>
            </div>
          </div>
        </form>
        {showBookModal && (
          <BookCoverSearchModal
            onClose={() => setShowBookModal(false)}
            onSelect={handleSelectCover}
          />
        )}
      </div>
    </div>
  )
}
export default WriteCreate
