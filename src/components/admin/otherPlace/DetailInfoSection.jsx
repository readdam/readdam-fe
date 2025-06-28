import { X, Upload } from 'lucide-react';

export default function DetailInfoSection({
  form,
  newKeyword,
  setNewKeyword,
  onChange,
  onAddKeyword,
  onRemoveKeyword,
  imagePreviews,
  setImagePreviews,
  onImageUpload,
}) {
  const isRawImage = (img) =>
    typeof img === 'string' &&
    (img.startsWith('data:image') ||
      img.startsWith('blob:') ||
      img.startsWith('http'));

  const handleRemoveImage = (index) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-6">상세 정보</h2>
      <div className="space-y-6">
        {/* 공간 소개 */}
        <div>
          <label className="block text-sm font-medium mb-2">공간 소개</label>
          <textarea
            rows={4}
            value={form.introduce}
            onChange={(e) => onChange('introduce', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="공간에 대해 소개해주세요"
          />
        </div>

        {/* 키워드 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            태그 (최대 5개)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#F3F7EC] text-[#006989] rounded-full text-sm flex items-center gap-1"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => onRemoveKeyword(index)}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={onAddKeyword}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="태그를 입력하고 Enter를 눌러주세요"
          />
        </div>

        {/* 공간 사진 여러장 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            공간 사진 (최대 5장)
          </label>
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={isRawImage(img) ? img : `/image?filename=${img}`}
                  alt="공간 사진"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#006989]">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">사진 추가</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={onImageUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* 기타 입력 */}
        <SimpleInput
          label="이용 요금"
          value={form.fee}
          onChange={(v) => onChange('fee', v)}
        />
        <SimpleInput
          label="사용 안내"
          value={form.usageGuide}
          onChange={(v) => onChange('usageGuide', v)}
        />
        <SimpleInput
          label="시설 안내"
          value={form.facilities}
          onChange={(v) => onChange('facilities', v)}
        />
        <SimpleInput
          label="유의사항"
          value={form.caution}
          onChange={(v) => onChange('caution', v)}
        />
      </div>
    </section>
  );
}

function SimpleInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
        placeholder={`${label} 입력하세요`}
      />
    </div>
  );
}
