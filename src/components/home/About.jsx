import React from 'react'
import {
  BookIcon,
  UsersIcon,
  MessageSquareIcon,
  CalendarIcon,
} from 'lucide-react'
const About = () => {
  return (
    <section className="w-full py-16 bg-[#F3F7EC]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          읽담이란?
        </h2>
        <p className="text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto">
          읽담은 책을 좋아하는 사람들의 연결을 돕습니다
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#E88D67] rounded-full flex items-center justify-center mx-auto mb-4">
              <BookIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              독후감 작성
            </h3>
            <p className="text-gray-600">
              읽은 책에 대한 생각과 감상을 자유롭게 기록해보세요.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#E88D67] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              첨삭 & 피드백
            </h3>
            <p className="text-gray-600">
              다른 독자들의 의견을 통해 새로운 시각을 발견하세요.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#E88D67] rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              글 나눔
            </h3>
            <p className="text-gray-600">
              당신의 글이 누군가에게 영감과 위로가 됩니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#E88D67] rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              모임 참여
            </h3>
            <p className="text-gray-600">
              온/오프라인 독서 모임에서 더 깊은 대화를 나누세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
export default About
