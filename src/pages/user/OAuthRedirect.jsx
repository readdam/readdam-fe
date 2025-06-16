import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom } from "../../atoms";

const OAuthRedirect = () => {
    const [_, setToken] = useAtom(tokenAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token');
        if (token) {
            setToken({ access_token: `Bearer ${token}`, refresh_token: '' }); // 필요시 refresh_token도 저장
        }
        navigate('/');
    }, []);

    return null;
};

export default OAuthRedirect;
