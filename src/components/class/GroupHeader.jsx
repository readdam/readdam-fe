import React, { Fragment, useEffect, useState } from "react";
import {
  Heart,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
} from "lucide-react";
import { useAxios } from "@hooks/useAxios";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom, tokenAtom } from "../../atoms";
import { useNavigate } from "react-router-dom";
import { url } from "../../config/config";

const GroupHeader = ({ group }) => {
  const axios = useAxios();
  const user = useAtomValue(userAtom);
  const setUserAtom = useSetAtom(userAtom);
  const token = useAtomValue(tokenAtom);
  const navigate = useNavigate();

  // 좋아요 상태
  const [liked, setLiked] = useState(group.isLikedByMe);
  const [likeCount, setLikeCount] = useState(group.likes);

  // 모달 열림 여부
  const [showModal, setShowModal] = useState(false);

  // 참여 상태
  const [joined, setJoined] = useState(false);
  const [canCancel, setCanCancel] = useState(false);

  // 헤더에 표시할 현재 참여 인원
  const [participants, setParticipants] = useState(
    group.currentParticipants ?? 0
  );

  // 모달 표시용 데이터
  const [totalPoint, setTotalPoint]   = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);
  const [cancelDeadline, setCancelDeadline] = useState("");

  // 태그, 날짜 목록
  const tagList = [group.tag1, group.tag2, group.tag3].filter(Boolean);
  const dateList = [
    group.round1Date,
    group.round2Date,
    group.round3Date,
    group.round4Date,
  ]
    .filter(Boolean)
    .map((dt) => dt.split("T")[0]);

  // 1) 컴포넌트 마운트 시, 내 참여 상태 + 현재 참여자 수 가져오기
  useEffect(() => {
    if (!user?.username) return;
    axios
      .get(`${url}/classDetail/${group.classId}/participation-info`, {
        headers: { Authorization: token.access_token },
      })
      .then((res) => {
        setJoined(res.data.joined);
        setCanCancel(res.data.canCancel);
        setParticipants(res.data.currentParticipants);
      })
      .catch(console.error);
  }, [group.classId, user, axios, token.access_token]);

  // 모달 열기 전, 포인트·마감일만 따로 다시 가져오기
  const openJoinModal = () => {
    if (!user?.username) {
      alert("참여하려면 로그인이 필요합니다.");
      return navigate("/login");
    }
    axios
      .get(`${url}/classDetail/${group.classId}/participation-info`, {
        headers: { Authorization: token.access_token },
      })
      .then((res) => {
        setTotalPoint(res.data.totalPoint); 
        setUsedPoints(res.data.usedPoints);
        setCancelDeadline(res.data.cancelableUntil);
        setShowModal(true);
      })
      .catch(() => {
        alert("참여 정보 조회 중 오류가 발생했습니다.");
      });
  };

  // 참여 신청
  const handleJoin = () => {
    axios
      .post(
        `${url}/classDetail/${group.classId}/join`,
        {},
        { headers: { Authorization: token.access_token } }
      )
      .then(() => {
        alert("참여 신청이 완료되었습니다.");
        setShowModal(false);
        setJoined(true);
        setCanCancel(true);
        setParticipants((prev) => prev + 1);
        // userAtom의 totalPoint 갱신
        setUserAtom((prev) => ({
          ...prev,
          totalPoint: prev.totalPoint - usedPoints,
        }));
      })
      .catch((err) => {
        const status = err.response?.status;
        const data = err.response?.data;
        if (data?.message) {
          alert(data.message);
          return;
        }
        if (
          status === 500 &&
          typeof data === "string" &&
          data.includes("포인트가 부족합니다")
        ) {
          alert(data);
          return;
        }
        alert("참여 신청 중 오류가 발생했습니다.");
      });
  };

  // 참여 취소
  const handleCancelJoin = () => {
    axios
      .delete(`${url}/classDetail/${group.classId}/join`, {
        headers: { Authorization: token.access_token },
      })
      .then(() => {
        alert("참여가 취소되었습니다.");
        setJoined(false);
        setCanCancel(false);
        setParticipants((prev) => prev - 1);
      })
      .catch(() => alert("참여 취소 중 오류가 발생했습니다."));
  };

  // 좋아요 토글
  const toggleLike = () => {
    if (!user?.username) {
      alert("로그인이 필요한 서비스입니다.");
      return navigate("/login");
    }
    axios
      .post(
        `${url}/classDetail/${group.classId}/like`,
        {},
        { headers: { Authorization: token.access_token } }
      )
      .then((res) => {
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      })
      .catch(() => alert("좋아요 처리 중 오류가 발생했습니다."));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 이미지 */}
        <img
          src={`${url}/image?filename=${group.mainImg}`}
          alt={group.title}
          className="md:w-1/2 w-full h-[400px] object-cover rounded-lg"
        />
        <div className="md:w-1/2">
          {/* 제목/소개 */}
          <h1 className="text-2xl font-bold mb-4">{group.title}</h1>
          <p className="text-gray-600 mb-6">{group.classIntro}</p>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tagList.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 정보 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-600">
              <UsersIcon className="w-5 h-5 mr-2" />
              현재 {participants}명 / 최소 {group.minPerson}명 ~ 최대 {group.maxPerson}명
            </div>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="w-5 h-5 mr-2" />
              {group.round1PlaceName} (
              <span className="text-sm text-gray-400">
                {group.round1PlaceLoc}
              </span>
              )
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-5 h-5 mr-2" />
              {dateList.map((d, i) => (
                <Fragment key={i}>
                  <span>{d}</span>
                  {i < dateList.length - 1 && <span className="mx-1">|</span>}
                </Fragment>
              ))}
            </div>
          </div>

          {/* 참여/취소/참여중 & 좋아요/공유 */}
          <div className="flex gap-2">
            {!joined ? (
              <button
                onClick={openJoinModal}
                className="px-6 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78]"
              >
                참여하기
              </button>
            ) : canCancel ? (
              <button
                onClick={handleCancelJoin}
                className="px-6 py-3 bg-[#E88D67] text-white rounded-lg hover:opacity-90"
              >
                참여 취소
              </button>
            ) : (
              <span className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg">
                참여중
              </span>
            )}

            <button
              onClick={toggleLike}
              disabled={!user?.username}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart
                className={`w-6 h-6 ${
                  liked ? "text-red-500 fill-red-500" : "text-gray-600"
                }`}
              />
            </button>
            <span className="flex items-center text-gray-600">
              {likeCount}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다!");
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ShareIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 모달 */}
{showModal && (() => {
  // 모달 안에서 바로 계산
  const currentPoint   = Number(totalPoint) || 0;
  const neededPoint    = Number(usedPoints)    || 0;
  const remainingPoint = currentPoint - neededPoint;
  const isDisabled     = remainingPoint < 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-[#006989]">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">모임 신청</h2>

        <p>내 포인트: <strong>{currentPoint} P</strong></p>
        <p>사용 포인트: <strong>{neededPoint} P</strong></p>
        <p className="mb-4">잔여 포인트: <strong>{remainingPoint} P</strong></p>

        <button
          onClick={handleJoin}
          disabled={isDisabled}
          className={`w-full py-2 rounded mb-2 ${
            isDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#006989] text-white hover:bg-[#005C78]"
          }`}
        >
          {isDisabled ? "포인트 부족" : "신청하기"}
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="w-full py-2 bg-gray-300 text-gray-700 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
})()}

    </div>
  );
};

export default GroupHeader;
