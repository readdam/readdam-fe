import React from "react";
import { HeartIcon } from "lucide-react";
import singoIcon from "@assets/singo.png";

  /**
   * PostItCard Component
   * @param {{
   *   color: string,
   *   nickname: string,
   *   content: string,
   *   likes: number,
   *   isLiked: boolean,
   *   onLikeClick: () => void,
   *   onReportClick: () => void,
   * }} props
   */
  const PostItCard = ({
    color,
    nickname,
    content,
    likes,
    isLiked,
    onLikeClick,
    onReportClick,
  }) => {
    // 색상 클래스 매핑
    const getPostItColor = (color) => {
      switch (color) {
        case "mint":
          return "bg-[#E8F3F1]";
        case "yellow":
          return "bg-[#FFF8E7]";
        case "pink":
          return "bg-[#FFE8F3]";
        default:
          return "bg-[#E8F3F1]";
      }
    };

  return (
    <div
      className={`${getPostItColor(
        color
      )} p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow relative transform hover:-rotate-1 hover:translate-y-[-2px]`}
      style={{
        aspectRatio: "1 / 1",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
      }}
    >
      {/* 상단: 작성자 & 좋아요 */}
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-sm text-[#006989]">
          {nickname}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onLikeClick}
            className="flex items-center gap-1 text-gray-600"
          >
            <HeartIcon
              className={`w-4 h-4 ${
                isLiked
                  ? "fill-[#E88D67] text-[#E88D67]"
                  : "text-gray-400"
              }`}
            />
            <span>{likes}</span>
          </button>
        </div>
      </div>
      {/* 답변 내용 */}
      <div className="flex items-center justify-center h-[70%] pt-16">
        <p
          className="text-center text-lg font-bold text-gray-500 leading-snug break-words overflow-hidden"
          style={{ fontFamily: "NanumGaram" }}
        >
          {content}
        </p>
      </div>
      {/* 신고 버튼 */}
      <button
        onClick={onReportClick}
        className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <img src={singoIcon} alt="신고" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PostItCard;
