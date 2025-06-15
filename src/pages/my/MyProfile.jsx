import { PencilIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import WithdrawalModal from './WithdrawalModal'; // 경로 맞게 수정

const ProfileEdit = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // 🔹 상태 선언

    return (
        <div className="max-w-6xl mx-auto px-8 py-12">
            <h2 className="text-xl font-semibold mb-8">내 프로필</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* 왼쪽 - 프로필 이미지 및 자기소개 */}
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <UserIcon className="w-10 h-10 text-gray-500" />
                        <button className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <label className="w-full text-sm font-medium mb-1 text-left">자기소개</label>
                    <textarea
                        className="w-full h-32 border rounded-md p-2 resize-none"
                        placeholder="자기소개를 입력하세요."
                    />
                </div>

                {/* 오른쪽 - 입력 폼 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">이름</label>
                        <input type="text" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">닉네임</label>
                        <input type="text" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">비밀번호</label>
                        <input type="password" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
                        <input type="password" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">전화번호</label>
                        <input type="tel" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">이메일</label>
                        <input type="email" className="w-full border rounded-md p-2" />
                    </div>
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-10 flex flex-col items-center">
                <button className="border border-blue-400 text-blue-500 px-8 py-2 rounded-md hover:bg-blue-50">
                    수정하기
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 text-sm text-gray-500 hover:underline"
                >
                    회원 탈퇴
                </button>
            </div>

            {/* 탈퇴 모달 */}
            <WithdrawalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ProfileEdit;
