/* src/pages/MyPointCharge.jsx */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";

/* 금액 ↔ 포인트 매핑표 */
const pointOptions = [
    { point: 500, amount: 10_000 },
    { point: 1100, amount: 20_000 },
    { point: 1800, amount: 30_000 },
    { point: 3250, amount: 50_000 },
];

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";   // Toss 대시보드 테스트용

export default function MyPointCharge() {
    /* 상태 */
    const [selectedAmount, setSelectedAmount] = useState(10_000);
    const [user, setUser] = useState(null);          // /userInfo 결과
    const [loadingUser, setLoadingUser] = useState(true);

    /* 위젯 인스턴스 ref (타입 제네릭 제거) */
    const widgetRef = useRef(null);
    const methodsWidgetRef = useRef(null);

    const nav = useNavigate();
    const loc = useLocation();

    /* ① 로그인 사용자 정보 가져오기 */
    useEffect(() => {
        axios.get("/userInfo")
            .then(r => setUser(r.data))
            .catch(() => {
                alert("로그인이 필요합니다");
                nav("/login");
            })
            .finally(() => setLoadingUser(false));
    }, [nav]);

    /* ② Toss 결제위젯 로드 (user 준비된 뒤) */
    useEffect(() => {
        if (!user) return;

        (async () => {
            const customerKey = user.username;           // 유저 고유키
            const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
            const methodsWidget = paymentWidget.renderPaymentMethods(
                "#payment-widget",
                selectedAmount
            );

            widgetRef.current = paymentWidget;
            methodsWidgetRef.current = methodsWidget;
        })();
    }, [user, selectedAmount]);

    /* ③ 금액 바뀔 때 위젯 가격 업데이트 */
    useEffect(() => {
        const mw = methodsWidgetRef.current;
        if (!mw) return;

        mw.updateAmount(
            selectedAmount,
            mw.UPDATE_REASON?.COUPON || "COUPON"
        );
    }, [selectedAmount]);

    /* ④ 결제 완료 리다이렉트 검증 */
    useEffect(() => {
        const qs = new URLSearchParams(loc.search);
        const paymentKey = qs.get("paymentKey");
        const orderId = qs.get("orderId");
        const amount = qs.get("amount");

        if (paymentKey && orderId && amount) {
            axios.post("/myPointCharge", new URLSearchParams({ paymentKey, orderId, amount }))
                .then(() => {
                    alert("포인트 충전 완료!");
                    nav("/myPointCharge");
                })
                .catch(() => {
                    alert("검증 실패");
                    nav("/myPointCharge");
                });
        }
    }, [loc, nav]);

    /* ⑤ 결제 버튼 */
    const requestPay = async () => {
        const widget = widgetRef.current;
        if (!widget || !user) return;

        const option = pointOptions.find(o => o.amount === selectedAmount);

        try {
            await widget.requestPayment({
                orderId: nanoid(),
                orderName: `${option.point}P 충전`,
                customerName: user.name || user.username,
                customerEmail: user.email,
                customerMobilePhone: user.phone,
                amount: selectedAmount,
                successUrl: `${window.location.origin}/myPointCharge`,
                failUrl: `${window.location.origin}/myPointCharge`,
            });
        } catch (e) {
            console.error(e);
            alert("결제창 호출 실패");
        }
    };

    /* 로딩 화면 */
    if (loadingUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                사용자 정보를 불러오는 중…
            </div>
        );
    }

    const option = pointOptions.find(o => o.amount === selectedAmount);
    const curPoint = user.totalPoint ?? 0;
    const after = curPoint + option.point;

    /* 렌더 */
    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-lg font-bold mb-4">포인트 충전</h2>

            {/* 금액 선택 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {pointOptions.map(o => (
                    <button
                        key={o.amount}
                        onClick={() => setSelectedAmount(o.amount)}
                        className={`border rounded p-4 text-center ${o.amount === selectedAmount
                                ? "border-orange-500 text-orange-600 font-semibold"
                                : "border-gray-300"
                            }`}
                    >
                        <div>{o.point}P</div>
                        <div className="text-sm text-gray-500">
                            {o.amount.toLocaleString()}원
                        </div>
                    </button>
                ))}
            </div>

            {/* 결제위젯 자리 */}
            <div id="payment-widget" className="mb-6" />

            {/* 요약 */}
            <div className="border p-4 rounded mb-6 bg-gray-50">
                <p className="text-sm">
                    현재 포인트: <span className="float-right">{curPoint}P</span>
                </p>
                <p className="text-sm">
                    충전 예정 포인트: <span className="float-right">{option.point}P</span>
                </p>
                <p className="text-sm font-semibold text-orange-500">
                    충전 후 포인트: <span className="float-right">{after}P</span>
                </p>
                <p className="text-sm mt-2">
                    결제 예정 금액:
                    <span className="float-right font-bold">
                        {selectedAmount.toLocaleString()}원
                    </span>
                </p>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end">
                <button
                    onClick={requestPay}
                    disabled={!widgetRef.current}
                    className={`px-6 py-2 rounded text-white ${widgetRef.current ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    결제하기
                </button>
            </div>
        </div>
    );
}
