// src/hooks/RestoreSession.jsx 
// 세션스토리지 복구용 훅인데 필요한 페이지 있을지도 모르니까 일단 남겨놓을게용 - 혜민
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '../atoms';

export default function RestoreSession() {
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(JSON.parse(savedToken));
        setUser(JSON.parse(savedUser));
        console.log('🔄 세션스토리지에서 로그인 정보 복구 완료');
      } catch (e) {
        console.error('❌ 로그인 복구 실패:', e);
      }
    }
  }, []);

  return null;
}
