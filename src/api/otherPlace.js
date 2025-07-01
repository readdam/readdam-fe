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
