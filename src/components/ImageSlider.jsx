import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { url } from '@config/config';

export default function ImageSlider({ place }) {
  const images = place.images?.slice(0, 10) || [];
  const [currentIndex, setCurrentIndex] = useState(1); // 실제 index + 1
  const [transition, setTransition] = useState(true);
  const sliderRef = useRef(null);

  // 슬라이드에 복제 이미지 포함
  const extendedImages =
    images.length > 0 ? [images[images.length - 1], ...images, images[0]] : [];

  const goToIndex = (index) => {
    setCurrentIndex(index);
    setTransition(true);
  };

  const prevSlide = () => goToIndex(currentIndex - 1);
  const nextSlide = () => goToIndex(currentIndex + 1);

  // transition 끝났을 때 index 보정 (loop)
  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      // 맨 앞 복제 이미지 → 마지막으로 점프
      setTransition(false);
      setCurrentIndex(images.length);
    } else if (currentIndex === images.length + 1) {
      // 맨 뒤 복제 이미지 → 첫번째로 점프
      setTransition(false);
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    if (!transition) {
      // transition false → 즉시 index 보정 후 다시 transition 활성화
      requestAnimationFrame(() => {
        setTransition(true);
      });
    }
  }, [transition]);

  return (
    <div className="relative w-full h-80 overflow-hidden bg-gray-200">
      {images.length > 0 ? (
        <>
          <div
            ref={sliderRef}
            className="flex h-full"
            style={{
              width: `${extendedImages.length * 100}%`,
              transform: `translateX(-${
                currentIndex * (100 / extendedImages.length)
              }%)`,
              transition: transition ? 'transform 0.5s ease-in-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((img, idx) => (
              <img
                key={idx}
                src={`${url}/image?filename=${img}`}
                alt={`slide-${idx}`}
                className="w-full flex-shrink-0 object-cover h-full"
                style={{ width: `${100 / extendedImages.length}%` }}
              />
            ))}
          </div>

          {/* 좌우 버튼 */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-500 opacity-60 rounded-full p-2 text-white hover:bg-opacity-50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-500 opacity-60 rounded-full p-2 text-white hover:bg-opacity-50"
          >
            <ChevronRight size={24} />
          </button>

          {/* indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx + 1)} // +1 보정
                className={`w-2 h-2 rounded-full ${
                  currentIndex === idx + 1 ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-400">이미지가 없습니다</p>
        </div>
      )}
    </div>
  );
}
