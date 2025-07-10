import { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageModal = ({ images = [], onClose }) => {
  const [index, setIndex] = useState(0);
  const backdropRef = useRef(null);

  const prev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const next = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!images.length) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-[#2d2d2d]/90 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:opacity-70 z-50"
      >
        <X size={28} />
      </button>

      {/* 좌우 화살표 */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white opacity-70 hover:opacity-100 z-50"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white opacity-70 hover:opacity-100 z-50"
      >
        <ChevronRight size={32} />
      </button>

      {/* 슬라이드 이미지 */}
      <div className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center overflow-hidden relative">
        <img
          src={images[index]}
          alt={`modal-${index}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* 하단 개수 표시 */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
