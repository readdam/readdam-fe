import { X, Upload } from 'lucide-react';

// PlaceDetailForm.jsx
export default function PlaceDetailForm({
  introduceText,
  setIntroduceText,
  keywords,
  setKeywords,
  newKeyword,
  setNewKeyword,
  imagePreviews, // ✅ 배열
  setImagePreviews,
  handleImageUpload, // ✅ input change에서 호출됨
}) {
  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && newKeyword.trim() !== '') {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
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
            value={introduceText}
            onChange={(e) => setIntroduceText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="공간에 대해 소개해주세요"
          />
        </div>
        {/* 키워드 */}
        <div>
          <label className="block text-sm font-medium mb-2">키워드</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#F3F7EC] text-[#006989] rounded-full text-sm flex items-center gap-1"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(index)}
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
            onKeyPress={handleAddKeyword}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#006989]"
            placeholder="키워드를 입력하고 Enter를 눌러주세요"
          />
        </div>
        {/* 사진 업로드 */}
        {/* 공간 사진 업로드 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            공간 사진 (최대 10장)
          </label>
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`preview-${index}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImagePreviews(
                      imagePreviews.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {imagePreviews.length < 10 && (
              <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#006989]">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">사진 추가</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
