import React, { useState } from 'react'
import GroupHeader from '@components/class/GroupHeader'
import GroupDescription from '@components/class/GroupDescription'
import GroupLeader from '@components/class/GroupLeader'
import GroupMembers from '@components/class/GroupMembers'
import GroupQnAReviews from '@components/class/GroupQnAReviews'
const ClassDetail = () => {
  // Dummy data for the group details
  const groupData = {
    id: 1,
    title: '물혹의 도전! 칼 세이건 <코스모스> 함께읽기',
    shortDescription:
      '우주와 인간 존재에 대한 깊은 통찰을 나누는 시간을 가져보아요.',
    tags: ['과학', '우주', '철학'],
    minParticipants: 3,
    maxParticipants: 8,
    currentParticipants: 5,
    venue: '읽담 강남센터 4층',
    schedule: '매주 화요일 19:30~21:00',
    dates: ['2024.2.6', '2024.2.13', '2024.2.20'],
    image:
      'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3',
    description: `우주의 신비를 함께 탐험하며 인간의 위치와 의미를 고찰해보는 시간을 가져보려 합니다.
    칼 세이건의 '코스모스'는 단순한 과학 교양서가 아닌, 인류의 지적 모험을 담은 걸작입니다.
    이 책을 통해 우주의 탄생부터 현재까지의 과학사를 살펴보고, 우리의 존재 의미를 함께 고민해보려 합니다.`,
    sessions: [
      {
        title: '1회차 - 우주의 해안에서',
        description: '우주의 크기와 인류의 위치에 대해 이야기를 나눕니다.',
        image:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3',
      },
      {
        title: '2회차 - 생명의 방정식',
        description: '지구 생명의 기원과 외계 생명체의 가능성을 토론합니다.',
        image:
          'https://images.unsplash.com/photo-1581593201096-4b744d6489ef?ixlib=rb-4.0.3',
      },
      {
        title: '3회차 - 시간 여행자의 세계',
        description: '상대성 이론과 시간의 본질에 대해 탐구합니다.',
        image:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3',
      },
    ],
    leader: {
      nickname: 'minhyejuju',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3',
      description:
        '안녕하세요! 천체물리학을 전공하고 있는 과학덕후입니다. 어려울 것 같은 과학 이야기를 쉽고 재밌게 나누고 싶어요. 저와 함께 우주의 신비를 탐험해보실래요? 궁금한 거 있으시다면, 언제든 자유롭게 물어보세요!',
    },
    members: [
      {
        id: 1,
        nickname: '하늘별',
        image:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3',
      },
      {
        id: 2,
        nickname: '우주인',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
      },
      {
        id: 3,
        nickname: '별덕후',
        image:
          'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3',
      },
      {
        id: 4,
        nickname: '은하수',
        image:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3',
      },
      {
        id: 5,
        nickname: '별빛',
        image:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3',
      },
    ],
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
}
export default ClassDetail;
