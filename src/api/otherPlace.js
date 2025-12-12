export const fetchOtherPlaceList = async (
  axios,
  { page = 0, size = 10, keyword = '', filterBy = 'name' }
) => {
  const res = await axios.get('/admin/otherPlaceList', {
    params: {
      page,
      size,
      keyword,
      filterBy,
    },
  });
  return res.data; // Page<OtherPlaceDto>
};

// @api/otherplace.js
export const getOtherPlaceReviews = async ({
  otherPlaceId,
  page,
  size,
  axios,
}) => {
  const res = await axios.get('/otherplace/reviews', {
    params: { otherPlaceId, page, size },
  });
  return res.data;
};

export const writeOtherPlaceReview = async ({
  content,
  rating,
  isHide,
  otherPlaceId,
  axios,
}) => {
  const res = await axios.post('/otherplace/reviews', {
    content,
    rating,
    isHide,
    placeId: otherPlaceId,
  });
  return res.data;
};

export const updateOtherPlaceReview = async ({
  reviewId,
  content,
  rating,
  isHide,
  axios,
}) => {
  await axios.put(`/otherplace/reviews/${reviewId}`, {
    content,
    rating,
    isHide,
  });
};

export const deleteOtherPlaceReview = async ({ reviewId, axios }) => {
  await axios.delete(`/otherplace/reviews/${reviewId}`);
};
