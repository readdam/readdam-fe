import axios from 'axios';

export const searchBook = async ({
  query,
  sort = 'accuracy', // 기본값: 정확도순
  page = 1,
  size = 10,
  target, // 옵션: title, isbn, publisher, person
}) => {
  const res = await axios.get('https://dapi.kakao.com/v3/search/book', {
    params: {
      query,
      sort,
      page,
      size,
      ...(target && { target }), // target이 있을 때만 추가
    },
    headers: {
      Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
    },
  });
  return res.data;
};
