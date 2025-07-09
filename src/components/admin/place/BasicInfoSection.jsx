import { useEffect, useRef, useState } from 'react';

export default function BasicInfoSection({
  placeName,
  setPlaceName,
  placeAddress,
  setPlaceAddress,
  phoneNumber,
  setPhoneNumber,
  setLat,
  setLng,
  lat,
  lng,
  detailAddress,
  setDetailAddress,
}) {
  const mapRef = useRef(null);
  // const [detailAddress, setDetailAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [postcodeReady, setPostcodeReady] = useState(false);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      await loadScript(
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      );
      if (window.daum && window.daum.Postcode) {
        setPostcodeReady(true);
        console.log('🟢 Daum Postcode script loaded');
      }

      await loadScript(
        `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
          import.meta.env.VITE_KAKAO_API_KEY
        }&libraries=services&autoload=false`
      );

      if(window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setSdkReady(true);
          console.log('🟢 Kakao Maps SDK fully loaded');
        });
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (sdkReady && lat != null && lng != null && mapRef.current) {
      const mapContainer = mapRef.current;
      const newCoords = new window.kakao.maps.LatLng(lat, lng);

      const mapOption = {
        center: newCoords,
        level: 5,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      mapContainer.kakaoMap = map;

      const marker = new window.kakao.maps.Marker({
        position: newCoords,
        map,
      });
      mapContainer.marker = marker;

      setCoords(newCoords); // 내부 상태 동기화
    }
  }, [sdkReady, lat, lng]);

  const handleSearchAddress = () => {
    if (!postcodeReady) {
      alert('주소 검색 API 로딩 중입니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const full = data.address;
        setPlaceAddress(full);

        if (!sdkReady) {
          console.warn('지도 API 로딩 전이라 좌표 변환이 생략됩니다.');
          return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(full, (results, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { x, y } = results[0];
            const lat = parseFloat(y);
            const lng = parseFloat(x);
            const newCoords = new window.kakao.maps.LatLng(lat, lng);

            setLat(lat);
            setLng(lng);
            setCoords(newCoords);

            const container = mapRef.current;
            let map = container.kakaoMap;

            if (!map) {
              map = new window.kakao.maps.Map(container, {
                center: newCoords,
                level: 5,
              });
              container.kakaoMap = map;
            }

            if (container.marker) {
              container.marker.setMap(null);
            }

            const marker = new window.kakao.maps.Marker({
              position: newCoords,
              map,
            });
            container.marker = marker;
          }
        });
      },
    }).open();
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-6">기본 정보</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">장소명</label>
          <input
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="장소명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">주소</label>
          <div className="flex gap-2">
            <input
              type="text"
              disabled
              value={placeAddress}
              // onChange={(e) => setPlaceAddress(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
              placeholder="주소를 검색하세요"
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              disabled={!postcodeReady}
              className={`px-4 py-2 rounded-lg text-white ${
                postcodeReady
                ? 'bg-[#006989] hover:bg-[#005c78]'
                : 'bg-gray-400 cursor-not-allowd'
              }`}
            >
              주소 검색
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">상세 주소</label>
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="상세 주소를 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">전화번호</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="전화번호를 입력하세요"
          />
        </div>

        <div
          ref={mapRef}
          id="map"
          style={{
            width: '100%',
            height: '300px',
            // display: coords ? 'block' : 'none',
            display: 'block',
          }}
        ></div>
      </div>
    </section>
  );
}
