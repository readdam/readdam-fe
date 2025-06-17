import React, { useState } from 'react';
import {
  SearchIcon,
  HomeIcon,
  BookOpenIcon,
  MessageSquareIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileTextIcon,
  XIcon,
  HelpCircleIcon,
} from 'lucide-react';

const AdminInquiryList = () => {
  const [statusFilter, setStatusFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answerText, setAnswerText] = useState('');

  // 예시 데이터
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      createdAt: '2024-01-15',
      type: '포인트',
      title: '포인트 적립이 되지 않아요',
      email: 'user1@example.com',
      content: '독서 모임 참여 후 포인트가 적립되지 않았습니다. 확인 부탁드립니다.',
      status: '미답변',
      answer: ''
    },
  ]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const statusMatch = statusFilter === '전체' || inquiry.status === statusFilter;
    const typeMatch = typeFilter === '전체' || inquiry.type === typeFilter;
    const searchMatch =
      searchKeyword === '' ||
      inquiry.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      inquiry.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchKeyword.toLowerCase());
    return statusMatch && typeMatch && searchMatch;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const currentItems = filteredInquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSaveAnswer = () => {
    if (!selectedInquiry || !answerText.trim()) return;
    const updatedInquiries = inquiries.map((inquiry) => {
      if (inquiry.id === selectedInquiry.id) {
        return {
          ...inquiry,
          status: '답변완료',
          answer: answerText,
        };
      }
      return inquiry;
    });
    setInquiries(updatedInquiries);
    setSelectedInquiry(null);
    setAnswerText('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex max-w-[1440px] mx-auto">
        <main className="flex-1 p-6">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>문의/피드백</span>
          </div>

          {/* 필터 영역 */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                <option value="전체">전체 유형</option>
                <option value="포인트">포인트</option>
                <option value="환불">환불</option>
                <option value="계정정보">계정정보</option>
                <option value="기타">기타</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                <option value="전체">전체 상태</option>
                <option value="미답변">미답변</option>
                <option value="답변완료">답변완료</option>
              </select>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="제목, 내용, 이메일로 검색"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['No', '작성일자', '문의유형', '제목', '작성자 이메일', '답변상태', '관리'].map((head, i) => (
                    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{inquiry.id}</td>
                    <td className="px-6 py-4 text-sm">{inquiry.createdAt}</td>
                    <td className="px-6 py-4 text-sm">{inquiry.type}</td>
                    <td className="px-6 py-4 text-sm">{inquiry.title}</td>
                    <td className="px-6 py-4 text-sm">{inquiry.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${inquiry.status === '미답변' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button onClick={() => { setSelectedInquiry(inquiry); setAnswerText(inquiry.answer || ''); }} className="text-[#006989] hover:text-[#005C78]">
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="bg-white px-6 py-4 border-t flex justify-between">
              <div className="text-sm text-gray-700">총 {filteredInquiries.length}건</div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded disabled:opacity-50">◀</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded ${currentPage === page ? 'bg-[#006989] text-white' : 'border hover:bg-gray-50'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded disabled:opacity-50">▶</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 상세 모달 */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-bold">문의 상세</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-500 hover:text-gray-700">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">제목</h4>
                <p className="mt-1">{selectedInquiry.title}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">문의유형</h4>
                  <p className="mt-1">{selectedInquiry.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">작성일자</h4>
                  <p className="mt-1">{selectedInquiry.createdAt}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">작성자 이메일</h4>
                  <p className="mt-1">{selectedInquiry.email}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">문의내용</h4>
                <p className="mt-1 p-4 bg-gray-50 rounded-lg">{selectedInquiry.content}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">답변</h4>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows="4"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  placeholder="답변을 입력하세요"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button onClick={handleSaveAnswer} className="px-4 py-2 bg-[#006989] text-white rounded hover:bg-[#005C78]">
                답변 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiryList;
