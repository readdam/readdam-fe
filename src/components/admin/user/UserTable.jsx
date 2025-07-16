import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAxios } from "@hooks/useAxios";
import { url } from "@config/config";
import AdminUserModal from "./AdminUserModal";

const UserTable = ({ members }) => {
  const axios = useAxios();
  const navigate = useNavigate();

  // 회원상세 모달 상태
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 조회된 회원 목록에서 행 클릭시
  const handleDetail = async (username) => {
    try {
      const response = await axios.get(`${url}/admin/userList/${username}`);
      console.log("noticeId: ", username);
      setSelectedUser(response.data.users);
      setIsModalOpen(true);
    } catch (error) {
      console.log("회원 상세 불러오기 실패: ", error);
      alert("회원 상세 내용을 불러오지 못했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              아이디
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              닉네임
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이메일
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            members.map((member, index) => (
              <tr
                key={member.username}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleDetail(member.username)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.nickname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.email}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.joinDate}</td> */}
              </tr>
            ))
          )}
          {/* 선택된 회원 상세페이지 이동 */}
          {isModalOpen && selectedUser && (
            <AdminUserModal
              user={selectedUser}
              onClose={() => setIsModalOpen(false)}
              url={url}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
