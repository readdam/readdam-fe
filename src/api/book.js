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
