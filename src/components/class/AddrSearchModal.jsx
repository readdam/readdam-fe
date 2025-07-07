import React, { useState } from 'react';
import { searchKakaoPlaces } from '@api/kakaoMapUtil';
import { useKakaoLoader } from '@hooks/useKakaoLoader';

const AddrSearchModal = ({ onSelect, onClose }) => {
  const loaded = useKakaoLoader();
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);

  const handleSearch = () => {
     e.preventDefault();
    if (!loaded || !window.kakao) {
        alert('Kakao 지도 API가 아직 로딩되지 않았습니다.');
        return;
    }
    searchKakaoPlaces(keyword, (results) => {
      setPlaces(results);
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-3">장소 검색</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장소명 입력"
            className="flex-1 border px-2 py-1 rounded"
          />
          <button type='button' onClick={handleSearch} className="bg-blue-500 text-white px-3 py-1 rounded">
            검색
          </button>
        </div>

        <ul className="max-h-60 overflow-y-auto border rounded">
          {places.map((place, idx) => (
            <li
              key={idx}
              onClick={() => {
                onSelect(place); // 부모에게 결과 전달(주소 선택만)
                onClose();  //모달만 닫음
              }}
              className="p-2 cursor-pointer hover:bg-gray-100 border-b"
              role='button'
              tabIndex={0}
            >
              <div className="font-semibold">{place.place_name}</div>
              <div className="text-sm text-gray-600">{place.address_name}</div>
            </li>
          ))}
        </ul>

        <button
            type='button'
          onClick={onClose}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 py-2 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AddrSearchModal;
