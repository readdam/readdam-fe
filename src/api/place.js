import axios from 'axios';
import { url } from '../config/config';

export const fetchPlaceList = async (
  token,
  { page = 0, size = 10, searchTerm = '', searchField = 'name' }
) => {
  const response = await axios.get(`${url}/admin/placeList`, {
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
    const res = await axios.get(`${url}/admin/place/${placeId}`, {
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

// 장소 수정 API
export const updatePlace = async (token, placeId, formData) => {
  const response = await axios.post(
    `${url}/admin/placeEdit/${placeId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token.access_token,
      },
    }
  );
  return response.data;
};

export async function fetchPlaces(
  axios,
  {
    page = 0,
    size = 12,
    tag,
    keyword,
    placeType = 'ALL',
    lat,
    lng,
    radiusKm,
    sortBy = 'latest',
  }
) {
  const params = {
    page,
    size,
    placeType,
    sortBy,
  };

  if (tag) params.tag = tag;
  if (keyword) params.keyword = keyword;
  if (lat && lng) {
    params.lat = lat;
    params.lng = lng;
  }
  if (radiusKm) params.radiusKm = radiusKm;

  const response = await axios.get('/place/search', { params });
  return response.data;
}

export const writePlaceReview = async ({
  content,
  rating,
  isHide,
  placeId,
  axios,
}) => {
  const res = await axios.post(`/place/reviews`, {
    content,
    rating,
    isHide,
    placeId,
  });
  return res.data;
};

export const getPlaceReviews = async ({ placeId, page, size, axios }) => {
  const res = await axios.get(`/place/reviews`, {
    params: {
      placeId,
      page,
      size,
    },
  });
  return res.data;
  // { content: [...], pageInfo: {...} }
};

export const updatePlaceReview = async ({
  reviewId,
  content,
  rating,
  isHide,
  axios,
}) => {
  const res = await axios.put(`/place/reviews/${reviewId}`, {
    content,
    rating,
    isHide,
  });
  return res.data; // 수정된 리뷰 DTO 반환
};

export const deletePlaceReview = async ({ reviewId, axios }) => {
  const res = await axios.delete(`/place/reviews/${reviewId}`);
  return res.data;
};

// 좋아요 여부 조회
export const getPlaceLikeStatus = async ({ placeId, axios }) => {
  const res = await axios.get(`/place/likes/${placeId}`);
  return res.data; // true or false
};

// 좋아요 토글
export const togglePlaceLike = async ({ placeId, axios }) => {
  const res = await axios.post(`/place/likes/${placeId}`);
  return res.data; // "liked" or "unliked"
};

// 좋아요 수 조회
export const getPlaceLikeCount = async ({ placeId, axios }) => {
  const res = await axios.get(`/place/likes/${placeId}/count`);
  return res.data; // number
};
