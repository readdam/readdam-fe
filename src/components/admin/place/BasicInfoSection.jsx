export default function BasicInfoSection({
  placeName,
  setPlaceName,
  placeAddress,
  setPlaceAddress,
  phoneNumber,
  setPhoneNumber,
}) {
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
          <input
            type="text"
            value={placeAddress}
            onChange={(e) => setPlaceAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="주소를 입력하세요"
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
      </div>
    </section>
  );
}
