import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';
import { Link } from 'react-router-dom';
import { url } from '../../config/config';
import PlaceCard from '@components/place/PlaceCard';

const HomePlace = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const axios = useAxios();

  

  // ✅ 최신순 불러오기
  useEffect(() => {
    const fetchLatestPlaces = async () => {
      try {
        let params = {
        limit: 4,
      };

      if (user?.lat && user?.lng) {
        params.sort = 'distance';
        params.lat = user.lat;
        params.lng = user.lng;
      } else {
        params.sort = 'latest';
      }
        const res = await axios.get('/places',  { params });
        setPlaces(res.data);
      } catch (err) {
        console.error('장소 불러오기 실패:', err);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPlaces();
  },[user?.lat, user?.lng, axios]);

  const handleCardClick = (place) => {
    if (place.type === 'PLACE') {
      navigate(`/place/${place.id}`);
    } else if (place.type === 'OTHER') {
      navigate(`/otherPlace/${place.id}`);
    }
  };

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">
            <span role="img" aria-label="map">📍 </span> 
            {user?.lat && user?.lng ? '내 근처 추천 장소를 찾아보세요' : '최근 등록된 장소를 찾아보세요!'} 
          </h2>
          <Link
            to="/place"
            className="text-sm text-gray-500 underline cursor-pointer hover:text-[#006989]"
          >
            전체 장소 보러가기
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-center">불러오는 중...</p>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.map((place) => {
              const tags = [
                place.tag1,
                place.tag2,
                place.tag3,
                place.tag4,
                place.tag5,
                place.tag6,
                place.tag7,
                place.tag8,
                place.tag9,
                place.tag10,
              ].filter(Boolean);

              return (
                <div
                  key={`${place.type === 'OTHER' ? 'other' : 'place'}-${place.id}`}
                  onClick={() => handleCardClick(place)}
                  className="cursor-pointer"
                >
                  <PlaceCard
                    place={{
                      id: place.id,
                      name: place.name,
                      address: place.basicAddress,
                      image: place.img1,
                      tags,
                      likes: place.likeCount,
                      isPromoted: place.type === 'OTHER',
                    }}
                    size="large"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            등록된 장소가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePlace;
