import { useEffect, useRef, useState } from 'react';

export default function PlaceMapCard({
  name,
  address,
  detailAddress,
  lat,
  lng,
}) {
  const mapRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    const loadScripts = async () => {
      await loadScript(
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      );
      await loadScript(
        `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
          import.meta.env.VITE_KAKAO_API_KEY
        }&libraries=services&autoload=false`
      );
      window.kakao.maps.load(() => setSdkReady(true));
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (sdkReady && lat && lng && mapRef.current) {
      const position = new window.kakao.maps.LatLng(lat, lng);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: position,
        level: 3,
      });

      new window.kakao.maps.Marker({
        position,
        map,
      });
    }
  }, [sdkReady, lat, lng]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div ref={mapRef} style={{ width: '100%', height: '300px' }} />
      <div className="p-4">
        <div className="font-semibold text-lg text-gray-800 mb-1">{name}</div>
        <div className="text-sm text-gray-600">
          {address}
          {detailAddress && ` ${detailAddress}`}
        </div>
      </div>
    </div>
  );
}
