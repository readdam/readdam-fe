import React, { useState } from 'react';
import { XIcon, BookmarkIcon } from 'lucide-react';

const AddToLibraryModal = ({ onClose }) => {
  const [libraries] = useState([
    { id: 1, name: '인생책', count: 12 },
    { id: 2, name: '읽은책', count: 45 },
    { id: 3, name: '읽고 싶은 책', count: 23 },
    { id: 4, name: '추천하고 싶은 책', count: 8 },
  ]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);

  const handleAdd = () => {
    if (!selectedLibraryId) return;
    // 여기에 실제 추가 로직 작성
    console.log(`서재 ID ${selectedLibraryId}에 추가`);
    onClose(); // 추가 후 모달 닫기
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">서재에 추가</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {libraries.map((library) => (
            <button
              key={library.id}
              onClick={() => setSelectedLibraryId(library.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                selectedLibraryId === library.id
                  ? 'border-[#006989] bg-[#F0FBFC]'
                  : 'border-gray-200 hover:border-[#006989] hover:shadow-md'
              }`}
            >
              <div className="flex items-center">
                <BookmarkIcon className="w-5 h-5 text-[#E88D67] mr-3" />
                <span className="text-gray-800">{library.name}</span>
              </div>
              <span className="text-sm text-gray-500">{library.count}권</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          disabled={!selectedLibraryId}
          className={`w-full p-4 rounded-lg font-semibold transition-all duration-200 ${
            selectedLibraryId
              ? 'bg-[#006989] text-white hover:bg-[#00536e]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          추가하기
        </button>
      </div>
    </div>
  );
};

export default AddToLibraryModal;
