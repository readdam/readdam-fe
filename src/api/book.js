import axios from 'axios';
import { url } from '../config/config';

export const getReviews = async ({ isbn, username, page = 0, size = 5 }) => {
  const res = await axios.get(`${url}/book/reviews`, {
    params: {
      bookIsbn: isbn,
      username,
      page,
      size,
    },
  });
  return res.data; // Page<BookReviewDto>
};

export const writeReview = async ({
  comment,
  rating,
  isHide,
  bookIsbn,
  token,
}) => {
  const res = await axios.post(
    `${url}/book/reviews`,
    {
      comment,
      rating,
      isHide,
      bookIsbn,
    },
    {
      headers: {
        Authorization: token.access_token,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
};
