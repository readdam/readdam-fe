import React, { useState } from 'react'
import GroupHero from '../components/groups/GroupHero'
import GroupList from '../components/groups/GroupList'
const ClassList = () => {
  const [activeTab, setActiveTab] = useState<'short' | 'ongoing'>('ongoing')
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <GroupHero />
        <GroupList type={activeTab} />
      </main>
    </div>
  )
}
export default ClassList;
