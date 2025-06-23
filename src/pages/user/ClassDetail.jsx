import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GroupHeader from '@components/class/GroupHeader'
import GroupDescription from '@components/class/GroupDescription'
import GroupLeader from '@components/class/GroupLeader'
import GroupMembers from '@components/class/GroupMembers'
import GroupQnAReviews from '@components/class/GroupQnAReviews'
import axios from 'axios';

const ClassDetail = () => {
  const {classId} = useParams();
  const [classData, setClassData] = useState('');
  const [qnaList, setQnaList] = useState([]);
  const [rewiewList, setReviewList] = useState([]);

  useEffect(()=>{
    const fetchClassData = async () => {
      try{
        const res = await axios.get(`/api/class/${classId}`);
      }
    }
  })
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-[1200px]">
        <GroupHeader group={groupData} />
        <GroupDescription group={groupData} />
        <GroupLeader leader={groupData.leader} />
        <GroupMembers members={groupData.members} />
        <GroupQnAReviews />
      </main>
    </div>
  )

export default ClassDetail;
