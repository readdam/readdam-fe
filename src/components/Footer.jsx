import { Link, useNavigate } from "react-router-dom";
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../atoms';

const Footer = () => {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);

  const handleOneToOne = () => {
    if (!token?.access_token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    navigate("/myInquiry"); 
  };

  return (
    <footer className="w-full bg-gray-50 py-10 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="md:w-3/4">
            <div className="text-sm text-gray-600 mb-6">
              <p className="mb-2">
                (주)읽담 | 대표이사 : 김이박 | 개인정보관리책임자 : 김이박
              </p>
              <p className="mb-2">
                사업자등록번호 : 221-81-00000 | 통신판매업 신고번호 : 제
                2025-서울금천-2025 호
              </p>
              <p className="mb-2">
                주소 : 서울특별시 금천구 가산디지털1로 70, 호서대벤처타워 9층
              </p>
              <p className="mb-2">
                Tel : 02-0000-0000 | Fax : 02-0000-0000 | 일반/제휴 문의 :
                readandtalk@kosta.com
              </p>
              <p className="mt-4 text-gray-500">
                읽담은 통신판매중개자이며 이벤트의 당사자 또는 주최자가
                아닙니다.
                <br />
                따라서 읽담은 등록된 이벤트에 대하여 어떠한 책임도 지지
                않습니다.
              </p>
            </div>
          </div>
          <div className="md:w-1/4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/notice"
                className="text-[#006989] hover:text-[#005C78]"
              >
                공지사항
              </Link>
              <button
                type="button"
                onClick={handleOneToOne}
                className="text-[#006989] hover:text-[#005C78]"
              >
                1:1 문의
              </button>
              <a href="#" className="text-[#006989] hover:text-[#005C78]">
                이용약관
              </a>
              <a href="#" className="text-[#006989] hover:text-[#005C78]">
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          © READANDTALK.COM, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
