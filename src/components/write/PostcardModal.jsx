// src/components/write/PostcardModal.jsx
import React, { useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';

const PostcardModal = ({ answerText, setAnswerText, selectedColor, setSelectedColor, onSubmit, onClose }) => {
  const textareaRef = useRef();

  // 모달 열릴 때 textarea 자동 포커싱
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const colorOptions = [
    { id: 'mint', bg: 'bg-[#E8F3F1]' },
    { id: 'yellow', bg: 'bg-[#FFF8E7]' },
    { id: 'pink', bg: 'bg-[#FFE8F3]' },
  ];

  const getPostItColor = (color) => {
    switch (color) {
      case 'mint': return 'bg-[#E8F3F1]';
      case 'yellow': return 'bg-[#FFF8E7]';
      case 'pink': return 'bg-[#FFE8F3]';
      default: return 'bg-[#E8F3F1]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">답변 작성하기</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 색상 선택 */}
        <div className="flex gap-3 mb-4">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-8 h-8 rounded-full ${color.bg} ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-[#006989]' : ''}`}
            />
          ))}
        </div>

        {/* 입력 필드 */}
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
            ref={textareaRef}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="생각을 자유롭게 표현해 보세요"
            className="w-full h-48 bg-transparent border-none resize-none focus:ring-0 focus:outline-none overflow-hidden"
            maxLength={200}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78]">작성완료</button>
        </div>
      </div>
    </div>
  );
};

export default PostcardModal;
