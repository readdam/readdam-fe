import { useAxios } from "../hooks/useAxios";

export const useAllSearch = () => {
  const axios = useAxios();

  const allSearch = async (keyword) => {
    const res = await axios.get(`/allSearch`, {
      params: {
        keyword
      },
    });
    return res.data;
  };

  return { allSearch };
};
