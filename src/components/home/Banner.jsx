import React from 'react';
// 임시 베너 데이터 추가
const Banner = () => {
  return (
    <section className="w-full py-20 bg-[#F3F7EC]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              읽고, 담고, 나누는 이야기
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              당신의 기록이 누군가의 공감이 됩니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-[#006989] text-white rounded-xl hover:bg-[#005C78] transition-colors">
                글 쓰러 가기
              </button>
              <button className="px-6 py-3 bg-[#E88D67] text-white rounded-xl hover:opacity-90 transition-opacity">
                모임 참여하기
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
              alt="독서하는 사람"
              className="rounded-xl max-w-full h-auto shadow-lg"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
