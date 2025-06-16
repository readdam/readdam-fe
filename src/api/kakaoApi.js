import axios from 'axios';
import { url } from '../config/config';

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

export const toggleBookLike = async (token, bookIsbn) => {
  try {
    const response = await axios.post(
      `${url}/book-like?bookIsbn=${bookIsbn}`,
      {},
      {
        headers: {
          Authorization: token.access_token,
        },
      }
    );
    console.log(response);
    return response.data; // "좋아요 완료" 또는 "좋아요 취소"
  } catch (error) {
    const message = error.response?.data || '좋아요 요청 중 오류 발생';
    console.error('[toggleBookLike]', message);
    throw new Error(message);
  }
};
