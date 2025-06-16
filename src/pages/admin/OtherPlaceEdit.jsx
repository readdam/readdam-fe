import React, { useEffect, useState } from 'react';
import { ArrowLeft, Upload, X, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { usePrompt } from '@hooks/usePrompt'; // 경로는 맞게 수정

export default function OtherPlaceEdit() {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedWeekdaySlots, setSelectedWeekdaySlots] = useState([]);
  const [selectedWeekendSlots, setSelectedWeekendSlots] = useState([]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${String(i).padStart(2, '0')}:00`);
    }
    return slots;
  };
  const [weekdaySlots] = useState(generateTimeSlots());
  const [weekendSlots] = useState(generateTimeSlots());
  const [images, setImages] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const navigate = useNavigate();

  //   const handleImageUpload = (e) => {
  //     const files = e.target.files;
  //     if (files) {
  //       Array.from(files).forEach((file) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           setImages((prev) => [...prev, reader.result]);
  //         };
  //         reader.readAsDataURL(file);
  //       });
  //     }
  //   };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && newKeyword.trim() !== '') {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const toggleSlot = (time, type) => {
    const state =
      type === 'weekday' ? selectedWeekdaySlots : selectedWeekendSlots;
    const setState =
      type === 'weekday' ? setSelectedWeekdaySlots : setSelectedWeekendSlots;
    setState(
      state.includes(time) ? state.filter((t) => t !== time) : [...state, time]
    );
  };

  const toggleAllSlots = (type) => () => {
    const slots = type === 'weekday' ? weekdaySlots : weekendSlots;
    const state =
      type === 'weekday' ? selectedWeekdaySlots : selectedWeekendSlots;
    const setState =
      type === 'weekday' ? setSelectedWeekdaySlots : setSelectedWeekendSlots;
    setState(state.length === slots.length ? [] : slots);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // ✅ 브라우저 새로고침/닫기 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty]);

  // ✅ 라우터 이동 방지
  usePrompt(
    '이 페이지를 벗어나시겠습니까? 작성하신 내용은 저장되지 않습니다.',
    isFormDirty
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft
            className="w-6 h-6"
            onClick={() => navigate('/otherPlaceList')}
          />
        </button>
        <h1 className="text-2xl font-bold">외부 장소 수정</h1>
      </div>

      <form className="space-y-8" onChange={() => setIsFormDirty(true)}>
        {/* 기본 정보 */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">기본 정보</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">장소명</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="장소명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">주소</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="주소를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">전화번호</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="전화번호를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">홈페이지</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="홈페이지를 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  평일 운영시간
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                  />
                  <span className="flex items-center">-</span>
                  <input
                    type="time"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  주말 운영시간
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                  />
                  <span className="flex items-center">-</span>
                  <input
                    type="time"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 상세 정보 */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">상세 정보</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                공간 소개
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="공간에 대해 소개해주세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">키워드</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#F3F7EC] text-[#006989] rounded-full text-sm flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleAddKeyword}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="키워드를 입력하고 Enter를 눌러주세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                공간 사진
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#006989]">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      사진 업로드
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                이용 요금
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="이용 요금을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                사용 안내
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="사용 안내를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                시설 안내
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="시설 안내를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">유의사항</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="유의사항을 입력하세요"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-all duration-200"
          >
            저장하기
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
