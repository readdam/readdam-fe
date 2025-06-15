import React from 'react'
import { MapPinIcon, ClockIcon, CreditCardIcon } from 'lucide-react'
const HomePlace = () => {
  const spaces = [
    {
      id: 1,
      name: '북카페 리드미',
      location: '서울 마포구 연남동',
      price: '시간당 5,000원',
      hours: '10:00 - 22:00',
      image:
        'https://images.unsplash.com/photo-1600431521340-491eca880813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    },
    {
      id: 2,
      name: '책방 오후',
      location: '서울 서초구 방배동',
      price: '무료 (음료 주문 필수)',
      hours: '11:00 - 20:00',
      image:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      id: 3,
      name: '스터디룸 페이지',
      location: '서울 강남구 역삼동',
      price: '시간당 10,000원',
      hours: '24시간',
      image:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    },
  ]
  return (
    <section className="w-full py-16 bg-[#F3F7EC]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          책을 나누기 좋은 공간이에요
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {space.name}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{space.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  <span>{space.price}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span>{space.hours}</span>
                </div>
                <button className="w-full px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
                  공간 예약하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default HomePlace
