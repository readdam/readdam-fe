// 읽담 한줄 라이크 전용 훅
import { useNavigate } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import { useAtom } from "jotai";
import { tokenAtom } from "../atoms";
import { url } from "../config/config";

export const useListWriteShortLike = (setList) => {
  const axios = useAxios();
  const navigate = useNavigate();
  const [token] = useAtom(tokenAtom);

  const toggleLike = async (writeShortId) => {
    if (!token?.access_token) {
      alert("로그인이 필요한 서비스입니다");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${url}/my/writeShort-like`, {
        writeshortId: writeShortId,
      });

      const isLiked = res.data;

      setList((prev) =>
        prev.map((a) =>
          a.writeshortId === writeShortId
            ? {
                ...a,
                isLiked,
                likes: a.likes + (isLiked ? 1 : -1),
              }
            : a
        )
      );
    } catch (err) {
      console.error("좋아요 토글 실패", err);
    }
  };

  return { toggleLike };
};
