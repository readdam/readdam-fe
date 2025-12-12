import React from 'react';
import { url } from '../../config/config';

const GroupDescription = ({
  group
}) => {
  const sessions = [1,2,3,4]
  .filter(i => group[`round${i}Content`] || group[`round${i}Img`])
  .map(i => ({
    index: i,
    image: `${url}/image?filename=${group[`round${i}Img`]}`,  //실제 저장된 이미지 경로
    content: group[`round${i}Content`],
    date: group[`round${i}Date`],
    place: group[`round${i}PlaceName`],
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">모임 소개</h2>
      <p className="text-gray-600 whitespace-pre-line mb-8">
        {group.classIntro}
      </p>
      <h3 className="text-lg font-bold text-gray-800 mb-6">회차별 진행 내용</h3>
      <div className="space-y-6">
        {sessions.map(session => (
          <div 
            key={session.index} 
            className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
            <div className="md:w-1/3">
              <img 
                src={session.image} 
                alt={`회차 이미지 ${session.index}`} 
                className="w-full h-48 object-cover rounded-lg" />
            </div>
            <div className="md:w-2/3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {session.index}회차 | 날짜: {session.date} | 장소: {session.place}
            </p>
            <p className="text-gray-600 whitespace-pre-line">
              {session.content}
            </p>
              {/* <h4 className="text-lg font-medium text-gray-800 mb-2">
                {session.index}회차 | 
              </h4>
              <p className="text-sm text-gray-700">날짜: {session.date}</p>
              <p className="text-sm text-gray-700">장소: {session.place}</p>
              <p className="text-gray-600 whitespace-pre-line">
                {session.content}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GroupDescription;