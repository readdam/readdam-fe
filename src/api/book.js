// 책 리뷰 조회
export const getReviews = async ({
  isbn,
  username,
  page = 0,
  size = 5,
  axios,
}) => {
  const params = {
    bookIsbn: isbn,
    page,
    size,
  };
  if (username) {
    params.username = username;
  }

  const { data } = await axios.get('/book/reviews', { params });
  return data;
};

// 책 리뷰 작성
export const writeReview = async ({
  comment,
  rating,
  isHide,
  bookIsbn,
  axios,
}) => {
  const { data } = await axios.post('/book/reviews', {
    comment,
    rating,
    isHide,
    bookIsbn,
  });
  return data;
};

// 책 리뷰 수정
export const updateReview = async ({
  reviewId,
  comment,
  rating,
  isHide,
  axios,
}) => {
  const { data } = await axios.put(`/book/reviews/${reviewId}`, {
    comment,
    rating,
    isHide,
  });
  return data;
};

// 책 리뷰 삭제
export const deleteReview = async ({ reviewId, axios }) => {
  const { data } = await axios.delete(`/book/reviews/${reviewId}`);
  return data;
};

// 좋아요 상태 조회
export const checkBookLike = ({ isbn, axios }) =>
  axios.get(`/book-like/check?bookIsbn=${isbn}`);

// 좋아요 토글
export const toggleBookLike = async ({ isbn, axios }) =>
  await axios.post(`/book-like?bookIsbn=${isbn}`);

export const fetchLifeBookUsers = async ({ isbn, axios }) => {
  const response = await axios.get(`/library/lifeBook/users`, {
    params: { isbn },
  });
  return response.data; // User[] - nickname, profileImg 포함
};
