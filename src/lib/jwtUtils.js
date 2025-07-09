import { jwtDecode } from "jwt-decode";

export function isTokenExpiringSoon(token, bufferSeconds = 60) {
    try {
        const { exp } = jwtDecode(token);
        const now = Date.now();
        const expireTime = exp * 1000;    // ms 단위
        return now >= expireTime - bufferSeconds * 1000;
    } catch {
        return true;  // 디코딩 실패 시 갱신하도록
    }
}
