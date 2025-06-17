import React from 'react';
const GroupDescription = ({
  group
}) => {
  return <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">모임 소개</h2>
      <p className="text-gray-600 whitespace-pre-line mb-8">
        {group.description}
      </p>
      <h3 className="text-lg font-bold text-gray-800 mb-6">회차별 진행 내용</h3>
      <div className="space-y-6">
        {group.sessions.map((session, index) => <div key={index} className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
            <div className="md:w-1/3">
              <img src={session.image} alt={session.title} className="w-full h-48 object-cover rounded-lg" />
            </div>
            <div className="md:w-2/3">
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                {session.title}
              </h4>
              <p className="text-gray-600">{session.description}</p>
            </div>
          </div>)}
      </div>
    </div>;
};
export default GroupDescription;