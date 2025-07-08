import React from "react";
import { useNavigate } from "react-router-dom";

const UserTable = ({ members }) => {
  const navigate = useNavigate();

  const handleDetail = (username) => {
    navigate(`/admin/userList/${username}`);
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
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
