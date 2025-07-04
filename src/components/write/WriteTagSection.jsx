// src/components/write/WriteTagSection.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

const WriteTagSection = ({ tags, setTags }) => {
  const [newTag, setNewTag] = useState("");

  // 태그 추가 (Enter)
  const handleAddTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const trimmed = newTag.trim();
      if (!trimmed) return;

      if (tags.length >= 5) {
        alert("태그는 최대 5개까지만 입력할 수 있습니다.");
        return;
      }
      if (tags.includes(trimmed)) {
        alert("이미 입력한 태그입니다.");
        return;
      }

      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  // 태그 삭제
  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        태그 <span className="text-sm text-gray-500 ml-2">(최대 5개)</span>
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-[#FDF3F0] text-[#E88D67] rounded-full text-sm flex items-center gap-1"
          >
            #{tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(idx)}
              className="hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="태그 입력 후 Enter"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleAddTag}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
      />
    </div>
  );
};

export default WriteTagSection;
