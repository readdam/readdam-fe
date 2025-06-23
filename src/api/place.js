import axios from 'axios';
import { url } from '../config/config';

export const fetchPlaceList = async (token, { page = 0, size = 10 }) => {
  const response = await axios.get(`${url}/placeList`, {
    headers: {
      Authorization: token.access_token,
    },
    params: { page, size },
  });
  return response.data;
};
