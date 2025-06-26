import { useEffect, useRef, useState } from 'react';

export default function BasicInfoSection({ form, onChange }) {
  const mapRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [coords, setCoords] = useState(null);

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
    if (sdkReady && form.lat && form.lng && mapRef.current) {
      const mapContainer = mapRef.current;
      const position = new window.kakao.maps.LatLng(form.lat, form.lng);

      const map = new window.kakao.maps.Map(mapContainer, {
        center: position,
        level: 5,
      });
      mapContainer.kakaoMap = map;

      const marker = new window.kakao.maps.Marker({ position, map });
      mapContainer.marker = marker;

      setCoords(position);
    }
  }, [sdkReady, form.lat, form.lng]);

  const handleSearchAddress = () => {
    if (!sdkReady) return alert('지도 로딩 중입니다.');

    new window.daum.Postcode({
      oncomplete: (data) => {
        const full = data.address;
        onChange('basicAddress', full);

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(full, (results, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { x, y } = results[0];
            const lat = parseFloat(y);
            const lng = parseFloat(x);
            onChange('lat', lat);
            onChange('lng', lng);
            setCoords(new window.kakao.maps.LatLng(lat, lng));
          }
        });
      },
    }).open();
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-6">기본 정보</h2>
      <div className="grid gap-6">
        {/* 장소명 */}
        <LabeledInput
          label="장소명"
          value={form.name}
          onChange={(v) => onChange('name', v)}
          placeholder="장소명을 입력하세요"
        />

        {/* 주소 */}
        <div>
          <label className="block text-sm font-medium mb-2">주소</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.basicAddress}
              onChange={(e) => onChange('basicAddress', e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
              placeholder="주소를 검색하세요"
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005c78]"
            >
              주소 검색
            </button>
          </div>
        </div>

        {/* 상세 주소 */}
        <LabeledInput
          label="상세 주소"
          value={form.detailAddress}
          onChange={(v) => onChange('detailAddress', v)}
          placeholder="상세 주소를 입력하세요"
        />

        {/* 전화번호 */}
        <LabeledInput
          label="전화번호"
          value={form.phone}
          onChange={(v) => onChange('phone', v)}
          placeholder="전화번호를 입력하세요"
        />

        {/* 홈페이지 */}
        <LabeledInput
          label="홈페이지"
          value={form.domain}
          onChange={(v) => onChange('domain', v)}
          placeholder="홈페이지를 입력하세요"
        />

        {/* 운영 시간 */}
        <div className="grid grid-cols-2 gap-4">
          <TimeField
            label="평일 운영시간"
            openKey="weekdayStime"
            closeKey="weekdayEtime"
            form={form}
            onChange={onChange}
          />
          <TimeField
            label="주말 운영시간"
            openKey="weekendStime"
            closeKey="weekendEtime"
            form={form}
            onChange={onChange}
          />
        </div>

        {/* 지도 */}
        <div ref={mapRef} style={{ width: '100%', height: '300px' }} />
      </div>
    </section>
  );
}

function LabeledInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
        placeholder={placeholder}
      />
    </div>
  );
}

function TimeField({ label, openKey, closeKey, form, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="time"
          value={form[openKey]}
          onChange={(e) => onChange(openKey, e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
        />
        <span className="flex items-center">-</span>
        <input
          type="time"
          value={form[closeKey]}
          onChange={(e) => onChange(closeKey, e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
        />
      </div>
    </div>
  );
}
