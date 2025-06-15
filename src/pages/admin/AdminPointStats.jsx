import React, { useState } from "react";
import {
  Search,
  Calendar,
  Wallet,
  CreditCard,
  RefreshCcw,
  DollarSign,
  CoinsIcon,
  ChevronDown,
} from "lucide-react";
const AdminPointStats = () => {
  const [dateRange, setDateRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const transactions = [
    {
      date: "2024-03-15",
      member: {
        name: "김철수",
        email: "kim@example.com",
      },
      type: "충전",
      points: 1000,
      amount: 10000,
      paymentMethod: "신용카드",
      status: "완료",
      refundReason: "-",
    },
    {
      date: "2024-03-14",
      member: {
        name: "이영희",
        email: "lee@example.com",
      },
      type: "환불",
      points: -500,
      amount: -5000,
      paymentMethod: "계좌이체",
      status: "처리중",
      refundReason: "서비스 불만족",
    },
    {
      date: "2024-03-13",
      member: {
        name: "박지민",
        email: "park@example.com",
      },
      type: "충전",
      points: 2000,
      amount: 20000,
      paymentMethod: "카카오페이",
      status: "완료",
      refundReason: "-",
    },
    {
      date: "2024-03-12",
      member: {
        name: "최민수",
        email: "choi@example.com",
      },
      type: "충전",
      points: 3000,
      amount: 30000,
      paymentMethod: "신용카드",
      status: "실패",
      refundReason: "결제 오류",
    },
    {
      date: "2024-03-11",
      member: {
        name: "정다운",
        email: "jung@example.com",
      },
      type: "환불",
      points: -1000,
      amount: -10000,
      paymentMethod: "계좌이체",
      status: "완료",
      refundReason: "중복 결제",
    },
    {
      date: "2024-03-10",
      member: {
        name: "한소희",
        email: "han@example.com",
      },
      type: "충전",
      points: 5000,
      amount: 50000,
      paymentMethod: "네이버페이",
      status: "완료",
      refundReason: "-",
    },
    {
      date: "2024-03-09",
      member: {
        name: "송민호",
        email: "song@example.com",
      },
      type: "충전",
      points: 10000,
      amount: 100000,
      paymentMethod: "카카오페이",
      status: "완료",
      refundReason: "-",
    },
    {
      date: "2024-03-08",
      member: {
        name: "강하늘",
        email: "kang@example.com",
      },
      type: "환불",
      points: -2000,
      amount: -20000,
      paymentMethod: "계좌이체",
      status: "처리중",
      refundReason: "서비스 이용 불가",
    },
    {
      date: "2024-03-07",
      member: {
        name: "윤세리",
        email: "yoon@example.com",
      },
      type: "충전",
      points: 3000,
      amount: 30000,
      paymentMethod: "신용카드",
      status: "완료",
      refundReason: "-",
    },
    {
      date: "2024-03-06",
      member: {
        name: "배수지",
        email: "bae@example.com",
      },
      type: "충전",
      points: 5000,
      amount: 50000,
      paymentMethod: "카카오페이",
      status: "완료",
      refundReason: "-",
    },
  ];
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#006989] text-white p-6">
        <div className="text-xl font-bold mb-8">읽담 관리자</div>
        <nav className="space-y-2">
          <a
            href="#"
            className="flex items-center px-4 py-2 bg-[#005C78] rounded-lg"
          >
            <CoinsIcon className="w-5 h-5 mr-3" />
            포인트/매출
          </a>
          {/* Other menu items */}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              포인트/매출 통계
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">관리자A</span>
              <button className="text-gray-500 hover:text-gray-700">
                로그아웃
              </button>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main
          className="p-8 overflow-auto"
          style={{
            height: "calc(100vh - 64px)",
          }}
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">총 충전금액</span>
                <Wallet className="w-5 h-5 text-[#006989]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                5,100,000원
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">총 충전포인트</span>
                <CoinsIcon className="w-5 h-5 text-[#006989]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">510,000P</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">환불금액</span>
                <RefreshCcw className="w-5 h-5 text-[#006989]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">600,000원</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">실매출합계</span>
                <DollarSign className="w-5 h-5 text-[#006989]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                4,500,000원
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="회원 닉네임, 이메일 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {/* Date Range */}
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] appearance-none"
                >
                  <option value="all">전체 기간</option>
                  <option value="7">최근 7일</option>
                  <option value="30">최근 1개월</option>
                  <option value="90">최근 3개월</option>
                </select>
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {/* Payment Status */}
              <div className="relative">
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] appearance-none"
                >
                  <option value="all">전체 상태</option>
                  <option value="success">성공</option>
                  <option value="failed">실패</option>
                  <option value="refund">환불요청</option>
                  <option value="completed">완료</option>
                </select>
                <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    날짜
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    회원
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    구분
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    포인트
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    금액(원)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    결제수단
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    환불사유
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    처리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {transaction.member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.member.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "충전"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span
                        className={
                          transaction.points >= 0
                            ? "text-blue-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.points >= 0 ? "+" : ""}
                        {transaction.points.toLocaleString()}P
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span
                        className={
                          transaction.amount >= 0
                            ? "text-blue-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.amount >= 0 ? "+" : ""}
                        {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === "완료"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "처리중"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction.refundReason}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {transaction.status === "처리중" && (
                        <button className="text-[#006989] hover:text-[#005C78] font-medium">
                          처리하기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminPointStats;
