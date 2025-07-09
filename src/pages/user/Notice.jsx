import React, { useEffect, useState } from 'react';
import { useAxios } from '@hooks/useAxios';
import dayjs from 'dayjs';
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
} from 'lucide-react'

const Notice = () => {
  const axios = useAxios(); // axios 훅 사용

  //axios로 가져올 공지사항들
  const [fixedNotices, setFixedNotices] = useState([]);
  const [normalNotices, setNormalNotices] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [page, setPage] = useState(1);

  // API 호출 함수
  const fetchNotices = async (page = 1, keyword = '') => {
    try {
      const res = await axios.get('/notice', {
        params: {
          page,
          size: 10,
          keyword: keyword || undefined,
        },
      });

      console.log('공지사항 불러오기', res.data);

      // API 응답값 반영
      setFixedNotices(res.data.fixedNotices || []);
      setNormalNotices(res.data.normalNotices || []);
      setPageInfo(res.data.pageInfo || {});

    // 최근 고정 공지 펼침 설정
    const recentFixed = (res.data.fixedNotices || [])[0];
    if (recentFixed) {
      setExpandedItems([recentFixed.noticeId]);
    } else {
      setExpandedItems([]); // 고정 없으면 초기화
    }

    } catch (error) {
      console.error('공지사항 조회 실패', error);
    }
  };

  useEffect(() => {
    fetchNotices(); // 컴포넌트 로드시 공지 전체 조회
  }, []);

  // 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      fetchNotices(1, searchKeyword);
      setIsSearched(true);
    }
  };

  // 검색 초기화
  const clearSearch = () => {
    setSearchKeyword('');
    setIsSearched(false);
    fetchNotices();
  };

  // 아코디언 토글
  const toggleExpanded = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // fixed + normal 합친 전체 리스트
  const notices = [...fixedNotices, ...normalNotices];

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="w-[80%] mx-auto px-4 max-w-5xl">
        {/* 상단 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">공지사항</h1>
          <p className="text-gray-600">
            읽담 서비스의 새로운 소식과 중요한 안내사항을 확인하세요.
          </p>
        </div>

        {/* 검색 영역 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="제목, 내용 검색하세요"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchKeyword && !isSearched && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <XCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:bg-[#E88D67]/90 transition-colors"
            >
              검색
            </button>
          </form>
        </div>

        {/* 검색 결과 표시 */}
        {isSearched && searchKeyword && (
          <div className="bg-[#F3F7EC] p-4 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-[#006989] font-medium">
                공지사항 검색 결과 {notices.length}건입니다.
              </span>
            </div>
            <button
              onClick={clearSearch}
              className="text-sm text-gray-600 hover:text-[#006989] flex items-center"
            >
              <XCircleIcon className="w-4 h-4 mr-1" />
              검색 초기화
            </button>
          </div>
        )}

        {/* 공지사항 아코디언 리스트 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {notices.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              등록된 공지사항이 없습니다.
            </div>
          )}
          {notices.map((notice) => (
            <div
              key={notice.noticeId}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleExpanded(notice.noticeId)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    {notice.topFix && (
                      <span className="text-xs bg-[#006989] text-white px-3 py-1 rounded-full">
                        고정
                      </span>
                    )}
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {dayjs(notice.regDate).format('YYYY.MM.DD A h:mm')}
                  </p>
                </div>
                {expandedItems.includes(notice.noticeId) ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedItems.includes(notice.noticeId) && (
                <div className="px-6 pb-4 pt-2 bg-[#F3F7EC]/30">
                  <p className="text-gray-700 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from(
              { length: pageInfo.allPage || 1 },
              (_, i) => i + 1
            ).map((p) => (
              <button
                key={p}
                className={`px-4 py-2 rounded ${
                  p === page
                    ? 'bg-[#006989] text-white'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
                onClick={() => {
                  setPage(p);
                  fetchNotices(p, isSearched ? searchKeyword : '');
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Notice
