import React, { useEffect, useState } from "react";
import {
  UserIcon,
  CoinsIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

const AdminUserModal = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [expandedPost, setExpandedPost] = useState(null);
  const userData = {
    id: "",
    name: "",
    nickname: "",
    email: "",
    phone: "",
    joinDate: "",
    birth: "",
    totalPoint: 0,
    profileImg: "",
    status: 0,
    groupCnt: 0,
    postCnt: 0,
  };

  const activityStats = [
    {
      label: "모임 참여",
      value: 0,
      color: "#E88D67",
    },
    {
      label: "모임 개설",
      value: 0,
      color: "#006989",
    },
    {
      label: "작성한 글",
      value: 0,
      color: "#005C78",
    },
  ];

  const groupData = [
    {
      id: 1,
      name: "고전 강독",
      role: "참여자",
      status: "참여 중",
      period: "2024-01-15 ~ 진행중",
    },
    {
      id: 2,
      name: "독서 토론",
      role: "참여자",
      status: "종료",
      period: "2023-05-01 ~ 2023-09-30",
    },
    {
      id: 3,
      name: "신간 이야기",
      role: "모임장",
      status: "참여 중",
      period: "2024-02-01 ~ 진행중",
    },
  ];
  const writeData = [
    {
      id: 1,
      title: "독서의 즐거움에 대한 소고",
      type: "독후감",
      date: "2024-03-10",
      likes: 15,
      comments: 8,
      content:
        "독서는 우리에게 새로운 세계를 열어주는 문이다. 책을 통해 우리는 다양한 경험을 할 수 있고...",
    },
    {
      id: 2,
      title: "현대 문학의 경향성",
      type: "글 나눔",
      date: "2024-03-05",
      likes: 22,
      comments: 12,
      content:
        "최근 현대 문학은 개인의 내면을 깊이 있게 탐구하는 경향이 강해지고 있다...",
    },
  ];

  const pointData = [
    {
      id: 1,
      type: "획득",
      amount: 100,
      reason: "모임 참여",
      date: "2024-03-15",
    },
    {
      id: 2,
      type: "사용",
      amount: -50,
      reason: "프리미엄 기능 이용",
      date: "2024-03-10",
    },
    {
      id: 3,
      type: "충전",
      amount: 500,
      reason: "포인트 구매",
      date: "2024-03-01",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-gray-600">회원관리 / 회원 상세</p>
      </div>
      {/* Top Summary Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {userData.name}
              </h1>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
                <div>
                  <span className="font-medium">ID:</span> {userData.id}
                </div>
                <div>
                  <span className="font-medium">닉네임:</span>{" "}
                  {userData.nickname}
                </div>
                <div>
                  <span className="font-medium">생년월일:</span>{" "}
                  {userData.birth}
                </div>
                <div>
                  <span className="font-medium">이메일:</span> {userData.email}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#E88D67] text-white rounded-lg hover:bg-[#005C78] transition-colors shadow-md">
              계정 비활성화
            </button>
          </div> */}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {activityStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100"
          >
            <div
              className="text-4xl font-bold mb-2"
              style={{
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* 탭 설정 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              {
                id: "groups",
                label: "모임",
              },
              {
                id: "writes",
                label: "글쓰기",
              },
              {
                id: "reports",
                label: "신고 내역",
              },
              {
                id: "points",
                label: "포인트",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-[#006989] border-[#006989]"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {/* 모임 탭 */}
          {activeTab === "groups" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      모임명
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      역할
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      상태
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      기간
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupData.map((group) => (
                    <tr key={group.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{group.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            group.role === "모임장"
                              ? "bg-[#E88D67] text-white"
                              : "bg-[#F3F7EC] text-[#006989]"
                          }`}
                        >
                          {group.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            group.status === "참여 중"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {group.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {group.period}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Posts Tab */}
          {activeTab === "writes" && (
            <div className="space-y-4">
              {writeData.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-[#F3F7EC] text-[#006989] rounded-full text-xs">
                          {post.type}
                        </span>
                        <span>{post.date}</span>
                        <span>좋아요 {post.likes}</span>
                        <span>댓글 {post.comments}</span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedPost(
                          expandedPost === post.id ? null : post.id
                        )
                      }
                      className="flex items-center gap-1 text-[#006989] hover:text-[#005C78] transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      미리보기
                      {expandedPost === post.id ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {expandedPost === post.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{post.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Points Tab */}
          {activeTab === "points" && (
            <div>
              <div className="mb-6 p-4 bg-[#F3F7EC] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CoinsIcon className="w-5 h-5 text-[#E88D67]" />
                  <span className="font-medium text-gray-700">보유 포인트</span>
                </div>
                <div className="text-2xl font-bold text-[#006989]">
                  {userData.points.toLocaleString()}P
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        구분
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        포인트
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        사유
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        일시
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointData.map((point) => (
                      <tr key={point.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              point.type === "획득"
                                ? "bg-blue-100 text-blue-800"
                                : point.type === "사용"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {point.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              point.amount > 0
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          >
                            {point.amount > 0 ? "+" : ""}
                            {point.amount.toLocaleString()}P
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {point.reason}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {point.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminUserModal;
