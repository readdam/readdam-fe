import React, { Fragment, useState, useEffect } from "react";
import {
  Heart,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
} from "lucide-react";
import { url } from "../../config/config";
import { useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../atoms";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GroupHeader = ({ group }) => {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);

  const [liked, setLiked] = useState(group.isLikedByMe);
  const [likeCount, setLikeCount] = useState(group.likes);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const tagList = [group.tag1, group.tag2, group.tag3].filter(Boolean);
  const dateList = [
    group.round1Date,
    group.round2Date,
    group.round3Date,
    group.round4Date,
  ]
    .filter(Boolean)
    .map((date) => date.split("T")[0]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(
          `${url}/classDetail/${group.classId}/like-status`,
          {
            headers: {
              Authorization: token.access_token,
            },
          }
        );
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      } catch (err) {
        console.error("좋아요 상태 조회 실패: ", err);
      }
    };

    if (user && user.username) fetchLikeStatus();
  }, [group.classId, user]);

  const HandleLikeToggle = async () => {
    if (!user.username) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    try {
      // 좋아요 토글 API 호출
      const response = await axios.post(
        `${url}/classDetail/${group.classId}/like`,
        {},
        {
          headers: {
            Authorization: token.access_token,
          },
        }
      );

      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (err) {
      console.error("좋아요 실패:", err);
      alert("좋아요 처리중 오류가 발생했습니다.");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다!");
  };

  const openJoinModal = () => {
    if (!user?.username) {
      alert("참여하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const closeJoinModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={`${url}/image?filename=${group.mainImg}`}
            alt={group.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{group.title}</h1>
          </div>
          <p className="text-gray-600 mb-6">{group.classIntro}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tagList.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-600">
              <UsersIcon className="w-5 h-5 mr-2" />
              <span>
                현재 {group.currentParticipants ?? 0}명 /
                최소 {group.minPerson}명 ~ 최대 {group.maxPerson}명
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span>{group.round1PlaceName}</span>
            </div>
            {/* <div className="flex items-center text-gray-600">
              <ClockIcon className="w-5 h-5 mr-2" />
              <span>{group.schedule}</span>
            </div> */}
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <div className="flex gap-2">
                {dateList.map((date, index) => (
                  <Fragment key={index}>
                    <span>{date}</span>
                    {index < dateList.length - 1 && <span>|</span>}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openJoinModal}
              className="flex justify-between px-6 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
            >
              참여하기
            </button>
            <button
              onClick={HandleLikeToggle}
              disabled={!user?.username}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {liked ? (
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              ) : (
                <Heart className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <span className="flex items-center text-gray-600">{likeCount}</span>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ShareIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-xl w-[400px]">
                <h2 className="text-xl font-bold mb-4">모임 신청</h2>
                {/* 여기에 신청 폼 내용 추가 */}
                <button
                  onClick={closeJoinModal}
                  className="mt-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GroupHeader;
