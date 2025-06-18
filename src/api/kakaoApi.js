import axios from 'axios';
import { url } from '../config/config';

// @api/kakaoApi.js 또는 @api/bookApi.js 등
export const searchBook = async ({
  query,
  sort = 'accuracy',
  page = 1,
  size = 10,
  target,
}) => {
  const res = await axios.get(`${url}/bookSearch`, {
    params: {
      query,
      ...(target && { target }),
      sort,
      page,
      size,
    },
  });
  return res.data;
};

export const toggleBookLike = async (token, bookIsbn) => {
  console.log(bookIsbn);
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

export const getLikeList = async (
  token,
  { query, target, sort = 'accuracy', page = 1, size = 10 }
) => {
  try {
    const response = await axios.get(`${url}/my/liked`, {
      headers: {
        Authorization: token.access_token,
      },
      params: {
        query,
        target,
        sort,
        page,
        size,
      },
    });
    return response.data; // liked 책 리스트 (Document 배열 또는 ISBN 리스트)
  } catch (error) {
    console.error('[getLikeList] 좋아요 목록 조회 실패:', error);
    throw error;
  }
};
