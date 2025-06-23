import React, { Fragment } from 'react';
import { HeartIcon, ShareIcon, MapPinIcon, CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';

const GroupHeader = ({
  group
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img src={group.image} alt={group.title} className="w-full h-[400px] object-cover rounded-lg" />
        </div>
        <div className="md:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{group.title}</h1>
          </div>
          <p className="text-gray-600 mb-6">{group.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {group.tags.map((tag, index) => <span key={index} className="px-3 py-1 bg-[#F3F7EC] text-[#006989] text-sm rounded-full">
                {tag}
              </span>)}
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-600">
              <UsersIcon className="w-5 h-5 mr-2" />
              <span>
                현재 {group.currentParticipants}명 / 최소{' '}
                {group.minParticipants}명 ~ 최대 {group.maxParticipants}명
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span>{group.venue}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ClockIcon className="w-5 h-5 mr-2" />
              <span>{group.schedule}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <div className="flex gap-2">
                {group.dates.map((date, index) => <Fragment key={date}>
                    <span>{date}</span>
                    {index < group.dates.length - 1 && <span>|</span>}
                  </Fragment>)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex justify-between px-6 py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
              참여하기
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <HeartIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ShareIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupHeader;