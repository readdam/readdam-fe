import axios from 'axios';
import { url } from '../config/config';

export const fetchPlaceList = async (
  token,
  { page = 0, size = 10, searchTerm = '', searchField = 'name' }
) => {
  const response = await axios.get(`${url}/placeList`, {
    headers: {
      Authorization: token.access_token,
    },
    params: {
      page,
      size,
      keyword: searchTerm || undefined, // 없으면 생략
      filterBy: searchField || undefined,
    },
  });
  return response.data;
};

export const getPlace = async (token, placeId) => {
  try {
    const res = await axios.get(`${url}/place/${placeId}`, {
      headers: {
        Authorization: token.access_token,
      },
    });
    return res.data;
  } catch (err) {
    console.error('장소 상세 조회 실패:', err);
    throw err; // 상위 컴포넌트에서 catch 가능하게
  }
};

//  axios
//       .get(`/place/${placeId}`)
//       .then((res) => {
//         setPlace(res.data);
//       })
//       .catch((err) => {
//         console.error('장소 상세 조회 실패:', err);
//       });
