// src/pages/my/Fail.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Fail() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4">결제 실패</h2>
      <p className="mb-6">결제가 취소되었거나 실패했습니다. 다시 시도해주세요.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-[#E88D67] text-white px-4 py-2 rounded hover:bg-[#d47c5a] transition"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
