import React, { useState } from "react";
import QnAList from "./QnAList";
import ReviewList from "./ReviewList";
import {
  LockIcon,
  ImageIcon,
  StarIcon,
  SendIcon,
  MessageCircleIcon,
} from "lucide-react";

const GroupQnAReviews = ({ classId, classDetail }) => {
  const [activeTab, setActiveTab] = useState("qna");

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-4 px-6 font-medium ${
            activeTab === "qna"
              ? "text-[#006989] border-b-2 border-[#006989]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("qna")}
        >
          모임 Q&A
        </button>
        <button
          className={`py-4 px-6 font-medium ${
            activeTab === "reviews"
              ? "text-[#006989] border-b-2 border-[#006989]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          모임 참여회원 리뷰
        </button>
      </div>
      {activeTab === "qna" ? (
        <QnAList classDetail={classDetail} />
      ) : (
        <ReviewList classDetail={classDetail} />
      )}
    </div>
  );
};
export default GroupQnAReviews;
