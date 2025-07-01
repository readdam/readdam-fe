import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, MapPinIcon } from 'lucide-react';
import { useAxios } from '../../hooks/useAxios';
import { Link } from 'react-router-dom';

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
        const res = await axios.get('/places', {
          params: {
            sort: 'latest',
            limit: 4,
          },
        });
        setPlaces(res.data);
      } catch (err) {
        console.error('장소 불러오기 실패:', err);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPlaces();
  }, [axios]);

  /*
  // ✅ 거리순 불러오기 (추후 구현 예정)
  useEffect(() => {
    const isLocationValid = user?.lat !== 0 && user?.lng !== 0;
    if (!isLocationValid) return;

    const fetchLocationBasedPlaces = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/places', {
          params: {
            sort: 'location',
            lat: user.lat,
            lng: user.lng,
            limit: 4,
          },
        });
        setPlaces(res.data);
      } catch (err) {
        console.error('위치 기반 장소 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationBasedPlaces();
  }, [user.lat, user.lng, axios]);
  */

  const handleCardClick = (place) => {
    if (place.type === 'PLACE') {
      navigate(`/place/${place.id}`);
    } else if (place.type === 'OTHER_PLACE') {
      navigate(`/otherPlace/${place.id}`);
    }
  };

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">
            <span role="img" aria-label="map">📍</span> 
            최근 등록된 장소를 찾아보세요!
            {/* 
            추후 거리순 적용 시 사용
            {user?.lat && user?.lng ? '내 근처 추천 장소를 찾아보세요' : '최근 등록된 장소를 찾아보세요!'} 
            */}
          </h2>
          <Link
            to="/placeList"
            className="text-sm text-gray-500 underline cursor-pointer hover:text-[#006989]"
          >
            전체 장소 보러가기
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500">불러오는 중...</p>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.map((place) => (
              <div
                key={`${place.type}-${place.id}`}
                onClick={() => handleCardClick(place)}
                className={`
                  cursor-pointer
                  border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow
                  ${place.isPromoted ? 'border-[#E88D67] shadow-md' : ''}
                `}
              >
                <div className="relative h-48 bg-gray-200">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-400 text-sm">이미지가 없습니다</p>
                    </div>
                  )}
                  {place.isPromoted && (
                    <div className="absolute top-2 left-2 bg-[#E88D67] text-white text-xs px-2 py-1 rounded">
                      추천
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 flex items-center">
                    <HeartIcon className="w-3 h-3 text-[#E88D67] mr-1" />
                    <span className="text-xs font-medium">
                      {place.likes}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                    {place.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPinIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{place.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {place.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-[#F3F7EC] text-[#006989] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
