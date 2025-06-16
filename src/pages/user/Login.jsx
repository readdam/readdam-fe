import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaComment, FaLeaf } from 'react-icons/fa';
import { useSetAtom } from 'jotai';
import { userAtom, tokenAtom } from '../../atoms';
import axios from 'axios';
import { url } from '../../config/config';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 1. OAuth 로그인 후 access_token 쿠키에서 꺼내 처리
  useEffect(() => {
    if (location.pathname === '/oauth-redirect') {
      const access_token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

      if (access_token) {
        setToken({ access_token, refresh_token: '' });
        setUser({ username: '' }); // 필요 시 /me API 호출해서 사용자 정보 가져와도 됨
        navigate('/');
      } else {
        alert('access_token이 없습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    }
  }, [location.pathname]);

  // ✅ 2. 일반 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${url}/loginProc`,
        {
          username: userId,
          password: password,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const access_token = response.headers['authorization'];

      if (access_token) {
        setToken({ access_token, refresh_token: '' });
        setUser({ username: userId });
        window.location.href = '/';
      } else {
        alert('로그인 응답이 올바르지 않습니다.');
      }
    } catch (err) {
      alert('로그인에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-28 items-center bg-white text-gray-800 px-4">
      <main className="w-full max-w-md text-center space-y-6">
        <div>
          <p className="text-sm font-bold">안녕하세요,</p>
          <h1 className="text-xl font-semibold mt-1">
            읽담에 로그인하여 당신의 이야기를 들려주세요
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl text-base w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl text-base w-full"
          />
          <div className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              id="saveId"
              checked={saveId}
              onChange={() => setSaveId(!saveId)}
              className="mr-2 w-4 h-4"
            />
            <label htmlFor="saveId">로그인 상태 유지</label>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-800 text-white py-3 rounded-xl font-bold text-base"
          >
            로그인
          </button>
        </form>

        <div className="text-center text-sm mt-1">
          <a href="/join" className="text-black hover:underline font-medium">
            회원가입 하러가기
          </a>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">또는</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => (window.location.href = `${url}/oauth2/authorization/kakao`)}
            className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <FaComment className="text-xl" />
            카카오로 쉽게 이용하기
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = `${url}/oauth2/authorization/naver`)}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <FaLeaf className="text-xl" />
            네이버로 쉽게 이용하기
          </button>
        </div>

        <div className="text-sm text-gray-500 mt-4 space-x-3">
          <a href="/findId" className="hover:underline">아이디 찾기</a>
          <span>|</span>
          <a href="/findPassword" className="hover:underline">비밀번호 찾기</a>
        </div>
      </main>
    </div>
  );
};

export default Login;
