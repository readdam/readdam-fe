import React from 'react';

const GroupLeader = ({
  leader
}) => {
  return <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">모임리더 소개</h2>
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <img src={leader.image} alt={leader.nickname} className="w-24 h-24 rounded-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {leader.nickname}
          </h3>
          <p className="text-gray-600">{leader.description}</p>
        </div>
      </div>
    </div>;
};
export default GroupLeader;