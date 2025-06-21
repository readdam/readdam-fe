// src/pages/my/MyPointCharge.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { useAtomValue } from "jotai";
import { tokenAtom } from "../../atoms";
import axios from "axios";
import { url } from "../../config/config";

const clientKey    = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const originUrl    = "http://localhost:5173";
const pointOptions = [
  { point: 500,  amount: 10000 },
  { point: 1100, amount: 20000 },
  { point: 1800, amount: 30000 },
  { point: 3250, amount: 50000 },
];

export default function MyPointCharge() {
  const token    = useAtomValue(tokenAtom);
  const navigate = useNavigate();

  // axios 인스턴스 (인증 헤더 포함)
  const api = useMemo(() => {
    if (!token?.access_token) return null;
    return axios.create({
      baseURL: url,
      withCredentials: true,
      headers: {
        Authorization: token.access_token.startsWith("Bearer ")
          ? token.access_token
          : `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    });
  }, [token]);

  const [user, setUser]               = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const widgetRef  = useRef(null);
  const methodsRef = useRef(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    if (!api) return;
    setLoadingUser(true);
    api.get("/my/userInfo")
      .then(res => setUser(res.data))
      .catch(() => {
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      })
      .finally(() => setLoadingUser(false));
  }, [api, navigate]);

  // Toss 위젯 초기화
  useEffect(() => {
    if (!user || widgetRef.current || selectedAmount === null) return;

    const safeKey = `${user.username}_uid`
      .replace(/[^a-zA-Z0-9\-_.=@]/g, "")
      .slice(0, 50);

    loadPaymentWidget(clientKey, safeKey)
      .then(widget => {
        widgetRef.current  = widget;
        methodsRef.current = widget.renderPaymentMethods(
          "#payment-widget",
          selectedAmount
        );
      })
      .catch(err => {
        console.error("widget load 실패:", err);
        alert("결제 위젯 로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
      });
  }, [user, selectedAmount]);

  // 결제 금액 업데이트
  useEffect(() => {
    const methods = methodsRef.current;
    if (methods && selectedAmount !== null) {
      methods.updateAmount(selectedAmount, methods.UPDATE_REASON.COUPON);
    }
  }, [selectedAmount]);

  // 주문 생성 + 위젯 호출
  const handlePayment = async () => {
    if (selectedAmount === null) return;

    if (!widgetRef.current) {
      alert("결제 위젯이 아직 준비되지 않았습니다.\n잠시 후 다시 시도해주세요.");
      return;
    }
    if (!user) {
      alert("사용자 정보가 없습니다.");
      return;
    }

    const opt = pointOptions.find(o => o.amount === selectedAmount);
    if (!opt) return;

    try {
      const { data } = await api.post("/my/myPointBefore", {
        point: opt.point,
        price: selectedAmount,
      });
      const orderUuid = data.orderUuid;

      await widgetRef.current.requestPayment({
        orderId:    orderUuid,
        orderName:  `${opt.point}P 충전`,
        amount:     selectedAmount,
        //point:      opt.point,
        successUrl: `${originUrl}/success?point=${opt.point}`,
        failUrl:    `${originUrl}/fail?point=${opt.point}`,
      });
    } catch (err) {
      console.error("주문 생성 또는 위젯 호출 중 오류:", err);
      alert("주문 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!api) return <div className="text-center mt-20">로딩 중…</div>;
  if (loadingUser) return <div className="text-center mt-20">사용자 정보를 불러오는 중…</div>;
  if (!user) return null;

  const currentPoint = user.totalPoint || 0;
  const opt = pointOptions.find(o => o.amount === selectedAmount);
  const chargePoint = opt ? opt.point : 0;
  const afterCharge = currentPoint + chargePoint;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">포인트 충전</h2>

      {/* 포인트 옵션 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {pointOptions.map(opt => (
          <button
            key={opt.amount}
            onClick={() => {
              setSelectedAmount(opt.amount);
              widgetRef.current = null;
              methodsRef.current = null;
            }}
            className={`border rounded-lg p-4 text-center transition
              ${selectedAmount === opt.amount
                ? "border-orange-500 text-orange-600 font-semibold"
                : "border-gray-200 text-gray-700"}`}
          >
            <div className="text-lg">{opt.point}P</div>
            <div className="text-sm">{opt.amount.toLocaleString()}원</div>
          </button>
        ))}
      </div>

      {/* 선택 안내 */}
      {selectedAmount === null && (
        <p className="text-center text-gray-500 mb-6">충전할 포인트를 선택해주세요.</p>
      )}

      {/* 결제 위젯 */}
      <div
        id="payment-widget"
        className={`mb-6 min-h-[200px] rounded-lg border
          ${selectedAmount !== null ? "border-gray-200" : "border-dashed border-gray-300"}`}
      />

      {/* 포인트 요약 */}
      <div className="border border-gray-200 p-4 rounded-lg mb-6 bg-gray-50 text-sm">
        <p className="flex justify-between"><span>현재 포인트:</span><span>{currentPoint}P</span></p>
        <p className="flex justify-between"><span>충전 예정 포인트:</span><span>{chargePoint}P</span></p>
        <p className="flex justify-between font-semibold text-orange-600">
          <span>충전 후 포인트:</span><span>{afterCharge}P</span>
        </p>
        <p className="flex justify-between mt-2">
          <span>결제 금액:</span><span className="font-bold">{selectedAmount ? selectedAmount.toLocaleString() : 0}원</span>
        </p>
      </div>

      {/* 결제하기 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handlePayment}
          disabled={selectedAmount === null}
          className={`px-6 py-2 rounded-lg text-white font-medium
            ${selectedAmount !== null
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-orange-300 opacity-50 cursor-not-allowed"}`}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
