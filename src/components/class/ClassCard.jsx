import React from "react";
import { url } from "@config/config";
import { useNavigate } from "react-router";
import {
  HeartIcon,
  CalendarIcon,
  CompassIcon,
  BookOpenIcon,
  UsersIcon,
} from "lucide-react";

const ClassCard = ({ group }) => {
  const tagArray = [group.tag1, group.tag2, group.tag3].filter(Boolean);
  const navigate = useNavigate();

  return (
    <div
      key={group.classId}
      className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
      onClick={()=>{
        navigate(`/classDetail/${group.classId}`)
      }}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={`${url}/image?filename=${group.mainImg}`}
          alt={group.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
          <button className="flex items-center gap-1 text-gray-500">
            <HeartIcon className="w-5 h-5 text-red-500" />
            <span>{group.likeCnt ?? group.likeCount ?? 0}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {tagArray.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#F3F7EC] text-[#006989] text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <BookOpenIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{group.shortIntro}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">시작일: &nbsp;</span>
          <span className="text-sm">{group.round1Date}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <CompassIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">장소: &nbsp;</span>
          <span className="text-sm">{group.round1PlaceName}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <UsersIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{group.currentParticipants ?? 0} / {group.maxPerson}명</span>
        </div>
      </div>
    </div>
  );
};
export default ClassCard;
