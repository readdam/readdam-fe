// src/components/LibraryModal.jsx
import React, { useEffect, useState } from 'react';
import { XIcon, BookmarkIcon } from 'lucide-react';
import { useAxios } from '../../hooks/useAxios';

const LibraryModal = ({ isOpen, onClose, book }) => {
  const axios = useAxios();
  const [libraries, setLibraries] = useState([]);

  // 모달 열릴 때만 서재 목록 로드
  useEffect(() => {
    if (!isOpen) return;
    axios.get('/api/libraries')
      .then(res => setLibraries(res.data))
      .catch(() => setLibraries([]));
  }, [isOpen, axios]);

  const handleAdd = async libraryId => {
    await axios.post(`/api/libraries/${libraryId}/books`, {
      isbn:      book.isbn,
      title:     book.title,
      authors:   book.author,
      thumbnail: book.imageName,
      publisher: book.publisher,
      datetime:  book.pubDate,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 px-4 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-sm p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold mb-4">서재에 추가</h3>

        <ul className="space-y-2 max-h-60 overflow-auto">
          {libraries.map(lib => (
            <li
              key={lib.libraryId}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAdd(lib.libraryId)}
            >
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5 text-[#E88D67]" />
                <span>{lib.name}</span>
              </div>
              <span className="text-sm text-gray-500">{lib.bookCount}권</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LibraryModal;
