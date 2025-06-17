// src/pages/my/Success.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { url } from "../../config/config";
import { useAtomValue } from "jotai";
import { tokenAtom } from "../../atoms";

export default function Success() {
  const { search } = useLocation();
  const navigate   = useNavigate();
  const token      = useAtomValue(tokenAtom);

  useEffect(() => {
    const params     = new URLSearchParams(search);
    const paymentKey = params.get("paymentKey");
    const orderId    = params.get("orderId");
    const amount     = params.get("amount");
    const point      = params.get("point");

    if (!paymentKey || !orderId || !amount || !point) {
      return navigate("/myPointCharge", { replace: true });
    }
    axios.post(
      `${url}/my/myPointCharge`,
      { paymentKey, orderId, amount: Number(amount), point: Number(point), },
      {
        withCredentials: true,
        headers: {
          Authorization: token.access_token.startsWith("Bearer ")
            ? token.access_token
            : `Bearer ${token.access_token}`,
        },
      }
    )
    .then(()=> window.location.replace("/myPointList", { replace: true }))
    .catch(()=>alert("결제 검증 실패"));
  }, [search, token, navigate]);

  return <div>결제 성공! 처리 중…</div>;
}
