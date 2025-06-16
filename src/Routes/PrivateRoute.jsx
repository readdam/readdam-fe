import { Navigate, Outlet } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../atoms';

// Base64 디코딩 시 UTF-8 한글 깨짐 방지 함수
function decodeJwtPayload(token) {
  const base64 = token.split('.')[1];
  const decoded = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
  return JSON.parse(decoded);
}

export default function PrivateRoute() {
  const token = useAtomValue(tokenAtom);

  // Jotai 초기 로딩 중 상태
  if (token === undefined) return null;

  // access_token이 없으면 로그인 페이지로 이동
  if (!token || !token.access_token) {
    return <Navigate to="/login" replace />;
  }

  // access_token 파싱 시도
  try {
    const payload = decodeJwtPayload(token.access_token);
    console.log('JWT Payload:', payload);
  } catch (e) {
    console.error('JWT Decode 실패:', e);
    return <Navigate to="/login" replace />;
  }

  // 토큰 정상 -> 자식 라우트 출력
  return <Outlet />;
}
