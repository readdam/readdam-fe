import { PencilIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import WithdrawalModal from './MyWithdrawal';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import axios from 'axios';

const ProfileEdit = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = useAtomValue(tokenAtom);
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    useEffect(() => {
        if (!token?.access_token || token.access_token.trim() === '') return;

        axios.post(`${url}/my/myProfile`, null, {
            headers: { Authorization: token.access_token },
            withCredentials: true,
        })
            .then((res) => setUser(res.data))
            .catch((err) => console.error('프로필 정보 가져오기 실패', err));
    }, [token?.access_token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (password && password !== passwordConfirm) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }
    
        try {
            const payload = {
                ...user,
                password: password !== '' ? password : null,
            };
    
            await axios.post(`${url}/my/myProfileEdit`, payload, {
                headers: { Authorization: token.access_token },
                withCredentials: true,
            });
    
            alert('프로필이 수정되었습니다.');
            window.location.reload(); // ✅ 새로고침 추가
    
        } catch (err) {
            console.error('프로필 수정 실패', err);
        }
    };
    


    const handlePhotoClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
    
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
    
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                const res = await axios.post(`${url}/my/uploadImage`, formData, {
                    headers: {
                        Authorization: token.access_token,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
    
                const filename = res.data;
                setUser((prev) => ({ ...prev, profileImg: filename }));
            } catch (err) {
                console.error('프로필 이미지 업로드 실패', err);
                alert('이미지 업로드에 실패했습니다.');
            }
        };
    
        input.click();
    };
    

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto px-8 py-12">
            <h2 className="text-xl font-semibold mb-8">내 프로필</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* 왼쪽 - 프로필 이미지 및 자기소개 */}
                <div className="flex flex-col items-center">
                    <div
                        className="relative w-24 h-24 rounded-full mb-4 cursor-pointer group"
                        onClick={handlePhotoClick}
                    >
                        {/* 이미지 레이어 */}
                        {user.profileImg ? (
                            <img
                                src={`${url}/image?filename=${user.profileImg}`}
                                alt="프로필"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                <UserIcon className="w-10 h-10 text-gray-500" />
                            </div>
                        )}

                        {/* 아이콘 레이어 - 항상 맨 위 */}
                        <div className="absolute bottom-0 right-0 z-50">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePhotoClick();
                                }}
                                className="bg-white border rounded-full p-1 shadow"
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>


                    <label className="w-full text-sm font-medium mb-1 text-left">자기소개</label>
                    <textarea
                        name="introduce"
                        className="w-full h-32 border rounded-md p-2 resize-none"
                        placeholder="자기소개를 입력하세요."
                        value={user.introduce || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* 오른쪽 - 입력 폼 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">이름</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full border rounded-md p-2 bg-gray-100"
                            value={user.name || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            className="w-full border rounded-md p-2"
                            value={user.nickname || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">비밀번호</label>
                        <input
                            type="password"
                            className="w-full border rounded-md p-2"
                            placeholder="변경할 비밀번호를 입력하세요 (선택)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
                        <input
                            type="password"
                            className="w-full border rounded-md p-2"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">전화번호</label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full border rounded-md p-2 bg-gray-100"
                            value={user.phone || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">이메일</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border rounded-md p-2"
                            value={user.email || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-10 flex flex-col items-center">
                <button
                    onClick={handleSubmit}
                    className="border border-blue-400 text-blue-500 px-8 py-2 rounded-md hover:bg-blue-50"
                >
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
