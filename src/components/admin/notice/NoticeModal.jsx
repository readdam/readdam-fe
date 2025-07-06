import React from "react";
import { useState } from "react";
import axios from "axios";

const NoticeModal = ({
  notice,
  onClose,
  onUpdate,
  token,
  url,
  onDelete,
  onFormatDate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: notice.title,
    content: notice.content,
    topFix: notice.topFix,
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("topFix", form.topFix);

    try {
      const res = await axios.put(
        `${url}/admin/notice/${notice.noticeId}`,
        formData,
        {
          headers: { Authorization: token.access_token },
        }
      );

      alert("수정 완료됐습니다.");
      setIsEditing(false);
      onUpdate(res.data);
    } catch (error) {
      console.error("공지 수정 실패", error);
      alert("수정 중 오류 발생");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
      {/* 모달 본문 */}
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✖
        </button>

        {isEditing ? (
          <>
            <h3 className="text-xl font-bold mb-4">공지 수정</h3>
            <input
              className="w-full border px-3 py-2 rounded mb-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full border px-3 py-2 rounded h-32"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <div className="flex items-center mt-2 space-x-2">
              <input
                type="checkbox"
                checked={form.topFix}
                onChange={(e) => setForm({ ...form, topFix: e.target.checked })}
              />
              <label>상단 고정</label>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                수정 완료
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-2">{notice.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {onFormatDate(notice.regDate)}
            </p>
            <div className="text-gray-800 whitespace-pre-line">
              {notice.content}
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={() => onDelete(notice.noticeId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default NoticeModal;
