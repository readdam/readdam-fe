import React from 'react';

const GroupMembers = ({
  members
}) => {
  return <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        이 모임에 참여 중인 회원
      </h2>
      <div className="flex flex-wrap gap-6">
        {members.map(member => <div key={member.id} className="flex flex-col items-center space-y-2">
            <img src={member.image} alt={member.nickname} className="w-16 h-16 rounded-full object-cover" />
            <span className="text-sm text-gray-600">{member.nickname}</span>
          </div>)}
      </div>
    </div>;
};
export default GroupMembers;