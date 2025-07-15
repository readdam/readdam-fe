import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupHeader from "@components/class/GroupHeader";
import GroupDescription from "@components/class/GroupDescription";
import GroupLeader from "@components/class/GroupLeader";
import GroupQnAReviews from "@components/class/GroupQnAReviews";
import { useAxios } from "@hooks/useAxios";
import { url } from "../../config/config";

const ClassDetail = () => {
  const axios = useAxios();
  const { classId } = useParams();
  console.log("classId: ", classId);
  const [classData, setClassData] = useState("");

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`${url}/classDetail/${classId}`);
        setClassData(res.data.data);
        // console.log("모임데이터: ", res.data.data);
      } catch (err) {
        console.error("모임 상세정보 불러오기 실패: ", err);
      }
    };

    fetchClassData();
  }, [classId]);

  if (!classData) return <div>로딩중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-[1200px]">
        <GroupHeader group={classData} />
        <GroupDescription group={classData} />
        <GroupLeader leader={classData} />
        {/* <GroupMembers members={groupData.members} />  */}
        <GroupQnAReviews classId={classId} classDetail={classData} />
      </main>
    </div>
  );
};
export default ClassDetail;
