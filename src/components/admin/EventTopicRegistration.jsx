// src/components/admin/EventTopicRegistration.jsx
import React from 'react'
import { PlusIcon } from 'lucide-react'

const EventTopicRegistration = ({ eventForm, onChange, onSubmit }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">월 선택</label>
          <input
            type="month"
            name="month"
            value={eventForm.month}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
            <input
              type="date"
              name="startDate"
              value={eventForm.startDate}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
            <input
              type="date"
              name="endDate"
              value={eventForm.endDate}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">주제 제목</label>
        <input
          type="text"
          name="title"
          value={eventForm.title}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
          placeholder="이벤트 주제를 입력하세요"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          등록
        </button>
      </div>
    </form>
  </div>
)

export default EventTopicRegistration
