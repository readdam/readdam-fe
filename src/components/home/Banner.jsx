import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAxios } from '@hooks/useAxios';
import { url } from '../../config/config';

const Banner = () => {
  const axios = useAxios();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/banner')
      .then((res) => {
        setBanner(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axios]);

  if (loading) {
    return null;
  }

  if (!banner) {
    return <div>배너 정보를 불러올 수 없습니다.</div>;
  }

  const imgUrl = banner.img
  ? `${url}/image?filename=${encodeURIComponent(banner.img)}`
  : `${url}/image?filename=homeDefaultBanner.png`;

  return (
    <section className="w-full py-20 bg-[#F3F7EC]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              {banner.titleText}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              {banner.content}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={banner.button1.link}
                className="px-6 py-3 bg-[#006989] text-white rounded-xl hover:bg-[#005C78] transition-colors"
              >
                {banner.button1.text}
              </Link>
              {banner.button2?.show && (
                <Link
                  to={banner.button2.link}
                  className="px-6 py-3 bg-[#E88D67] text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {banner.button2.text}
                </Link>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-end pr-4"> {/* 오른쪽 여백 맞춤 */}
            <img
              src={imgUrl}
              alt={banner.title}
              className="rounded-xl max-w-full h-auto shadow-lg"
              style={{ maxHeight: '400px', width: '90%' }}  // 좌측 여백과 균형 맞춤
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
