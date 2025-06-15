import React, { useEffect, useState } from 'react';

const pointOptions = [
  { point: 500, amount: 10000 },
  { point: 1100, amount: 20000 },
  { point: 1800, amount: 30000 },
  { point: 3250, amount: 50000 },
];

const PointCharge = () => {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [currentPoint, setCurrentPoint] = useState(300); // 예시
  const selected = pointOptions.find(opt => opt.amount === selectedAmount);
  const chargePoint = selected?.point || 0;
  const totalPoint = currentPoint + chargePoint;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!window.TossPayments) return;

    const initToss = async () => {
      const tossPayments = window.TossPayments('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'); // 테스트용 키
      const widgets = tossPayments.widgets({ customerKey: TossPayments.ANONYMOUS });

      try {
        await widgets.setAmount({ currency: 'KRW', value: selectedAmount });
        await widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' });
        await widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' });
      } catch (e) {
        console.error('위젯 초기화 실패', e);
        alert('결제 UI를 불러오는 데 실패했습니다.');
      }
    };

    initToss();
  }, [selectedAmount]);

  const handlePayment = async () => {
    const tossPayments = window.TossPayments('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm');

    try {
      await tossPayments.requestPayment({
        orderId: 'order_' + Date.now(),
        orderName: `${chargePoint}P 충전`,
        customerName: '홍길동',
        customerEmail: 'hong@example.com',
        customerMobilePhone: '01012345678',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        amount: selectedAmount,
        currency: 'KRW',
        windowTarget: 'self',
      });
    } catch (err) {
      console.error('결제 요청 실패', err);
      alert('결제 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">포인트 충전</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {pointOptions.map(opt => (
          <button
            key={opt.amount}
            onClick={() => setSelectedAmount(opt.amount)}
            className={`border rounded p-4 text-center ${opt.amount === selectedAmount
              ? 'border-orange-500 text-orange-600 font-semibold'
              : 'border-gray-300'
              }`}
          >
            <div>{opt.point}P</div>
            <div className="text-sm text-gray-500">{opt.amount.toLocaleString()}원</div>
          </button>
        ))}
      </div>

      {/* 🟦 Toss Payments 결제 수단 선택 위젯 */}
      <div id="payment-method" className="my-6" />
      {/* 🔐 약관 동의 */}
      <div id="agreement" className="mb-6" />

      <div className="border p-4 rounded mb-6 bg-gray-50">
        <p className="text-sm text-gray-600 mb-1">
          현재 포인트: <span className="float-right">{currentPoint}P</span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          충전 예정 포인트: <span className="float-right">{chargePoint}P</span>
        </p>
        <p className="text-sm text-orange-500 font-semibold">
          충전 후 포인트: <span className="float-right">{totalPoint}P</span>
        </p>
        <p className="text-sm mt-2 text-gray-600">
          결제 예정 금액: <span className="float-right font-bold">{selectedAmount.toLocaleString()}원</span>
        </p>
      </div>



      <div className="flex justify-end">
        <button onClick={handlePayment} className="bg-blue-600 text-white px-6 py-2 rounded">
          결제하기
        </button>
      </div>


      <p className="text-xs text-gray-400 mt-3">* 결제 후 7일 이내 미사용 시 취소 가능합니다.</p>
    </div>
  );
};

export default PointCharge;
