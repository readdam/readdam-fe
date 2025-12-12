import { useEffect, useState } from 'react';

export const useKakaoLoader = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const scriptId = 'kakao-map-script';
        if (document.getElementById(scriptId)) {
            setLoaded(true);
            return;
        }
        const appKey = import.meta.env.VITE_KAKAO_APP_KEY; 
        console.log(import.meta.env.VITE_KAKAO_APP_KEY);

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
            setLoaded(true);
        });
        };

        document.head.appendChild(script);
  }, []);
  return loaded;
};
