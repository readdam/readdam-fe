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
