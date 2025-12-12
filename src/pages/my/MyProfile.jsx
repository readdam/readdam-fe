// src/components/MyProfile.jsx
import React, { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import WithdrawalModal from './MyWithdrawal';
import { PencilIcon } from 'lucide-react';
import { url } from '../../config/config';

const MyProfile = () => {
  const axios = useAxios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    axios
      .post('/my/myProfile', null, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.error('프로필 정보 가져오기 실패', err));
  }, [axios]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (password && password !== passwordConfirm) {
      alert('비밀번호와 확인이 일치하지 않습니다.');
      return;
    }
    try {
      await axios.post(
        '/my/myProfileEdit',
        { ...user, password: password || null },
        { withCredentials: true }
      );
      alert('프로필이 수정되었습니다.');
      window.location.reload();
    } catch (err) {
      console.error('프로필 수정 실패', err);
    }
  };

  const handlePhotoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post(
          '/my/uploadImage',
          formData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        setUser(prev => ({ ...prev, profileImg: res.data }));
      } catch (err) {
        console.error('이미지 업로드 실패', err);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
    input.click();
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-8 py-12 bg-[#F3F7EC]">
      {/* 제목을 flex 위로 */}
      <h2 className="text-2xl font-bold text-[#006989] mb-8 pl-16">
        프로필 편집
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* 왼쪽: 사진 + 자기소개 */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div
            className="relative w-36 h-36 rounded-full mb-6 cursor-pointer"
            onClick={handlePhotoClick}
          >
            <img
              src={`${url}/image?filename=${user.profileImg || 'defaultProfile.jpg'}`}
              alt="프로필"
              className="w-full h-full object-cover rounded-full"
            />
            <button
              className="absolute bottom-1 right-1 bg-[#006989] text-white p-2 rounded-full hover:bg-[#005C78] transition-colors"
              onClick={e => {
                e.stopPropagation();
                handlePhotoClick();
              }}
            >
              <PencilIcon size={16} />
            </button>
          </div>
          <div className="w-3/4">
            <label className="block text-[#006989] font-medium mb-2">자기소개</label>
            <textarea
              name="introduce"
              className="w-full h-40 p-3 border border-gray-300 rounded-lg bg-white resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006989] mb-4"
              placeholder="자기소개를 입력하세요."
              value={user.introduce || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 오른쪽: 폼 */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          {[
            { label: '이름', name: 'name', type: 'text', value: user.name },
            { label: '닉네임', name: 'nickname', type: 'text', value: user.nickname },
            {
              label: '비밀번호',
              name: 'password',
              type: 'password',
              value: password,
              placeholder: '변경할 비밀번호를 입력하세요 (선택)',
              onChange: e => setPassword(e.target.value),
            },
            {
              label: '비밀번호 확인',
              name: 'passwordConfirm',
              type: 'password',
              value: passwordConfirm,
              placeholder: '비밀번호를 다시 입력하세요',
              onChange: e => setPasswordConfirm(e.target.value),
            },
            { label: '전화번호', name: 'phone', type: 'tel', value: user.phone },
            { label: '이메일', name: 'email', type: 'email', value: user.email },
          ].map(({ label, name, type, value, placeholder, onChange }) => (
            <div key={name}>
              <label className="block text-[#006989] font-medium mb-2">{label}</label>
              <input
                type={type}
                name={name}
                value={value || ''}
                placeholder={placeholder}
                onChange={onChange || handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006989]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="mt-20 flex flex-col items-center">
        <button
          onClick={handleSubmit}
          className="bg-[#E88D67] text-white px-8 py-2 rounded-md hover:opacity-90"
        >
          저장하기
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          회원 탈퇴
        </button>
      </div>

      <WithdrawalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MyProfile;
