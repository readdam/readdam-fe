import React, { useState } from 'react';
import { UserIcon } from 'lucide-react';
import axios from 'axios';
import { url } from '../../config/config';
import { useNavigate } from 'react-router-dom'

const Join = () => {
  const [step, setStep] = useState(1);
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    terms: false,
    privacy: false,
  });
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    email: '',
    birth: '',
    introduction: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: formData.username, // ✅ 직접 받은 아이디
        name: formData.name,
        nickname: formData.nickname,
        password: formData.password,
        phone: formData.phone,
        email: formData.email,
        birth: formData.birthdate,
        introduce: formData.introduction,
      };

      const res = await axios.post(`${url}/join`, payload);
      if (res.status === 200) {
        alert('회원가입이 완료되었습니다.');
        navigate('/login'); // ✅ 회원가입 후 로그인 페이지로 이동
      }
    } catch (err) {
      console.error('회원가입 실패', err);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };



  const handleAllAgreements = (checked) => {
    setAgreements({
      all: checked,
      age: checked,
      terms: checked,
      privacy: checked,
    });
  };

  const handleSingleAgreement = (name, checked) => {
    const newAgreements = {
      ...agreements,
      [name]: checked,
    };
    setAgreements({
      ...newAgreements,
      all: newAgreements.age && newAgreements.terms && newAgreements.privacy,
    });
  };

  const handleNext = () => {
    if (agreements.age && agreements.terms && agreements.privacy) {
      setStep(2);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
          {step === 1 ? (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">환영합니다!</h1>
                <p className="text-gray-600">읽담 서비스 이용을 위해 약관에 동의해 주세요.</p>
              </div>
              <div className="mb-8">
                <div className="border rounded-lg p-4 mb-4 h-48 overflow-y-auto bg-gray-50">
                  <h3 className="font-semibold mb-2">이용약관</h3>
                  <p className="text-sm text-gray-600">제1조 (목적) 이 약관은 읽담(이하 \"회사\")이 제공하는 서비스의 이용조건 및 절차...</p>
                </div>
                <div className="border rounded-lg p-4 h-48 overflow-y-auto bg-gray-50">
                  <h3 className="font-semibold mb-2">개인정보 취급방침</h3>
                  <p className="text-sm text-gray-600">1. 개인정보의 수집 및 이용목적 회사는 다음의 목적을 위하여 개인정보를 처리합니다...</p>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreements.all}
                    onChange={(e) => handleAllAgreements(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#006989] focus:ring-[#006989]"
                  />
                  <span className="font-semibold">전체 약관에 동의합니다</span>
                </label>
                <div className="space-y-3 pl-4">
                  {['age', 'terms', 'privacy'].map((key) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreements[key]}
                        onChange={(e) => handleSingleAgreement(key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#006989] focus:ring-[#006989]"
                      />
                      <span>
                        {key === 'age'
                          ? '만 14세 이상입니다 (필수)'
                          : key === 'terms'
                            ? '이용약관에 동의합니다 (필수)'
                            : '개인정보 수집 및 이용에 동의합니다 (필수)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!agreements.age || !agreements.terms || !agreements.privacy}
                className="w-full py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">회원 기본정보를 입력해 주세요</h1>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {[
                    ['username', '아이디'], // ✅ 아이디 추가
                    ['name', '이름'],
                    ['email', '이메일'],
                    ['nickname', '닉네임'],
                    ['password', '비밀번호'],
                    ['passwordConfirm', '비밀번호 확인'],
                    ['phone', '전화번호'],
                  ].map(([name, label]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={
                          name.includes('password')
                            ? 'password'
                            : name === 'email'
                              ? 'email'
                              : 'text'
                        }
                        name={name}
                        value={formData[name]}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {formData.nickname ? `'${formData.nickname}'님이 어떤 사람인지 알려주세요.` : '추가 정보'}
                    <p className="text-sm text-gray-500 mt-1">입력하지 않으셔도 마이페이지에서 추가 및 수정이 가능합니다.</p>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                      <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">프로필 이미지</label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        >
                          이미지 업로드
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
                      <textarea
                        name="introduction"
                        value={formData.introduction}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                        placeholder="자신을 소개해주세요"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors"
                >
                  가입 완료하기
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Join;
