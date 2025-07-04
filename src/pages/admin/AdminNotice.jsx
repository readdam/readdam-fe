import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import axios from "axios";
import { url } from "@config/config";
import {
  HomeIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
const AdminNotice = () => {
  const [token] = useAtom(tokenAtom);
  const [activePage, setActivePage] = useState("공지사항");

  // 공지사항 관련 상태
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    topFix: false,
  });

  // 공지사항 목록 상태
  const [notices, setNotices] = useState([]);

  // 공지사항 목록 가져오기
  const fetchNotices = async () => {
    try{
      const response = await axios.get(`${url}/admin/notices`, {
        headers: {
            Authorization: token.access_token,
          },
      });
      console.log("공지사항 목록 가져오기 성공: ", response.data);
      setNotices(response.data);  // 공지사항 리스트 저장
    }catch(error) {
      console.error("공지사항 목록 가져오기 실패: ", error);
    }
  };

  useEffect(()=>{
    fetchNotices(); // 페이지 처음 로드 시 목록 불러오기
  }, []);

  // 공지사항 등록
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", noticeForm.title);
    submitData.append("content", noticeForm.content);
    submitData.append("topFix", noticeForm.topFix);

    console.log("공지사항 등록:", {...noticeForm,});

    try{
      const res = await axios.post(`${url}/admin/createNotice`, submitData,{
          headers: {
            Authorization: token.access_token,
            "Content-Type": "multipart/form-data",
          },
      });
      console.log("공지사항 등록 성공: ", res.data);
      fetchNotices(); // 목록 새로고침
      setNoticeForm({ // Form 초기화
        title: "",
        content: "",
        topFix: false,
      });
    }catch(error){
      console.error("공지사항 등록 실패: ", error.response || error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace("-", ".");
  };
  
  const renderNoticePage = () => (
    <div className="space-y-8">
      {/* 공지사항 등록 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">공지사항 등록</h3>
        <form onSubmit={handleNoticeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={noticeForm.title}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  title: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
              placeholder="공지사항 제목을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={noticeForm.content}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  content: e.target.value,
                })
              }
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C5F5F]"
              placeholder="공지사항 내용을 입력하세요"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="topFix"
              checked={noticeForm.topFix}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  topFix: e.target.checked,
                })
              }
              className="w-4 h-4 text-[#2C5F5F] border-gray-300 rounded focus:ring-[#2C5F5F]"
            />
            <label htmlFor="topFix" className="text-sm text-gray-700">
              상단 고정
            </label>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#E88D67] flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            등록
          </button>
        </form>
      </div>

      {/* 공지사항 목록 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">공지사항 목록</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                글번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                고정여부
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notices.map((notice) => (
              <tr key={notice.noticeId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notice.noticeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notice.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(notice.regDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {notice.topFix && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      고정
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex max-w-[1440px] mx-auto">
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>〉&nbsp;공지사항</span>
          </div>
          {/* 페이지 제목 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{activePage}</h2>
          </div>
          {/* 페이지별 콘텐츠 */}
          {activePage === "공지사항" && renderNoticePage()}
        </main>
      </div>
    </div>
  );
};
export default AdminNotice;
