// src/components/class/ClassCard.jsx
import React from "react";
import { url } from "@config/config";
import { useNavigate } from "react-router";
import {
    CalendarIcon,
    CompassIcon,
    UsersIcon,
} from "lucide-react";

const ClassCard = ({ group }) => {
    const data = group.classDto ?? group;
    const tagArray = [data.tag1, data.tag2, data.tag3].filter(Boolean);
    const navigate = useNavigate();

    return (
        <div
            className="relative bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/classDetail/${data.classId}`)}
        >
            {/* 카드 이미지 높이 h-40, MyLikeClass와 동일 */}
            <div className="w-full h-40 overflow-hidden">
                {data.mainImg ? (
                    <img
                        src={`${url}/image?filename=${data.mainImg}`}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        {/* 없을 때 플레이스홀더 */}
                    </div>
                )}
            </div>

            {/* 카드 내용 */}
            <div className="p-4 space-y-1">
                {/* 제목 */}
                <div className="font-semibold text-base line-clamp-1">
                    {data.title}
                </div>

                {/* 태그 */}
                {tagArray.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {tagArray.map((tag, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-[#F3F7EC] text-[#005C78] px-2 py-0.5 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* 일정 */}
                {data.round1Date && (
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                        <CalendarIcon className="w-5 h-5 mr-1" />
                        {data.round1Date.split("T")[0]}
                    </div>
                )}

                {/* 장소 */}
                {data.round1PlaceLoc && (
                    <div className="flex items-center text-sm text-gray-500">
                        <CompassIcon className="w-5 h-5 mr-1" />
                        {data.round1PlaceLoc}
                    </div>
                )}

                {/* 참여 인원수 */}
                <div className="flex items-center text-sm text-gray-500">
                    <UsersIcon className="w-5 h-5 mr-1" />
                    {data.currentParticipants ?? 0}/{data.maxPerson ?? "-"}명
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
