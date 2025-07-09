import axios from "axios";
import { getSessionToken, setSessionToken } from "./tokenStorage";
import { isTokenExpiringSoon } from "./jwtUtils";
import { url } from "../config/config";

const api = axios.create({
    baseURL: url,
    withCredentials: true,   // 쿠키 기반 리프레시를 쓴다면 필요
});

// 1) 요청 인터셉터: 만료 임박 시 갱신
api.interceptors.request.use(async config => {
    let { access_token, refresh_token } = getSessionToken();

    // access_token이 있고, 만료 1분 이내라면
    if (access_token && isTokenExpiringSoon(access_token, 60)) {
        try {
            // 리프레시 엔드포인트 호출
            const { data } = await axios.post(
                `${url}/refresh`,
                { refresh_token },
                { withCredentials: true }
            );
            // 새 토큰 저장
            ({ access_token, refresh_token } = setSessionToken(data));
        } catch (err) {
            console.error("토큰 갱신 실패:", err);
            // 필요하다면 로그아웃 처리
        }
    }

    // 갱신된 access_token을 헤더에 자동 추가
    if (access_token) {
        config.headers.Authorization = access_token;
    }
    return config;
});

export default api;
