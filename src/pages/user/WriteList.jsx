import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchIcon,PenIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';
import WriteCard from '@components/write/WriteCard';

const WriteList = () => {
  const navigate = useNavigate();
  const [token] = useAtom(tokenAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  const [writeList, setWriteList] = useState([]);
  const [hasNext, setHasNext] = useState(false);

  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  const [searchInput, setSearchInput] = useState(keyword);
  const [isSearchActive, setIsSearchActive] = useState(!!keyword);

  const normalize = (v) => (v === '' ? null : v);

  const typeMap = {
    bookreview: '독후감',
    essay: '수필',
    personal: '자기소개서',
    assignment: '과제',
    other: '기타',
  };

  const statusMap = {
    active: '첨삭 가능',
    closed: '첨삭 종료',
    none: '첨삭 제외',
  };

  const sortMap = {
    recent: '최신 순',
    views: '조회 순',
  };

  const getReviewStatus = (endDate) => {
    if (!endDate) return '첨삭 제외';
    const now = new Date();
    return new Date(endDate) > now ? '첨삭 가능' : '첨삭 종료';
  };

  const fetchWrites = async (reset = false) => {
    try {
      const res = await axios.post(`${url}/writeList`, {
        page: reset ? 1 : page,
        type: normalize(type),
        status: normalize(status),
        sort,
        keyword: normalize(keyword),
      });
      const newList = res.data.writeList;
      setWriteList(reset ? newList : (prev) => [...prev, ...newList]);
      setHasNext(res.data.pageInfo.hasNext);
    } catch (err) {
      console.error('[❌ 목록 로드 실패]', err);
    }
  };

  const handleSearch = () => {
    setSearchParams({
      type,
      status,
      sort,
      keyword: searchInput,
      page: 1,
    });
    setKeyword(searchInput);
    setPage(1);
    setIsSearchActive(!!searchInput);
  };

  const handleResetSearch = () => {
    setSearchParams({});
    setType('');
    setStatus('');
    setSort('recent');
    setKeyword('');
    setSearchInput('');
    setPage(1);
    setIsSearchActive(false);
  };

  useEffect(() => {
      // searchParams 바뀌면 page를 초기화 (1로)
    //   const p = parseInt(searchParams.get("page")) || 1;
    //   setPage(p);
    // }, [searchParams]);
      const urlParams = new URLSearchParams(searchParams);
      const currentPage = urlParams.get('page');

      if (currentPage !== '1') {
        urlParams.set('page', '1');
        setSearchParams(urlParams);  // 검색조건은 그대로, page만 1로 변경
        setPage(1);
      } else {
        fetchWrites(true); // page=1인 경우만 초기 데이터 로드
      }
    }, []);


      // page 상태 바뀌면 fetch 실행
    useEffect(() => {
      fetchWrites(page === 1); // 초기화 필요시 1로 변경
    }, [page]);

  return (
    <div className="w-full min-h-screen bg-[#F9F9F7] py-8">
      <div className="container mx-auto px-4">
        {/* 탭 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-6">
            <button className="text-xl font-bold text-[#006989]">전체 글</button>
            <button
              onClick={() => navigate('/writeShortList')}
              className="text-xl font-bold text-gray-400"
            >
              읽담한줄
            </button>
          </div>
          <button
            onClick={() => {
              if (!token?.access_token) {
                alert("로그인이 필요한 서비스입니다.");
                navigate("/login");
                return;
              }
              navigate('/writeCreate');
            }}
            className="px-6 py-2.5 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors flex items-center"
          >
            <PenIcon className="w-5 h-5 mr-2" />
            글쓰기
          </button>
        </div>

        {/* 필터/검색 */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]">
            <option value="">전체 카테고리</option>
            {Object.entries(typeMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]">
            <option value="">전체 상태</option>
            {Object.entries(statusMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]">
            {Object.entries(sortMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="글 제목, 키워드로 검색"
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E88D67] focus:border-[#E88D67]"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button onClick={handleSearch} className="px-6 py-2 bg-[#E88D67] text-white rounded-lg hover:opacity-90">검색</button>
          </div>
        </div>

        {/* 검색 안내 */}
        {isSearchActive && keyword && (
          <div className="flex justify-between items-center bg-white px-4 py-2 rounded text-sm text-gray-700 mb-6">
            <div>
              ‘<span className="text-[#E88D67] font-semibold">{keyword}</span>’ 검색 결과입니다.
              <span className="ml-2 text-gray-400">({writeList.length}건)</span>
            </div>
            <button onClick={handleResetSearch} className="text-gray-400 text-xs underline hover:text-[#006989]">
              검색 초기화
            </button>
          </div>
        )}

        {/* 글 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {writeList.map((post) => (
            <WriteCard
              key={post.writeId}
              post={post}
              onClick={() => navigate(`/writeDetail/${post.writeId}`)}
            />
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="flex justify-center mt-8">
          {hasNext && (
            <button
              onClick={() => {
                const nextPage = page + 1;
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.set('page', nextPage);
                  return params;
                });
                setPage(nextPage);
              }}
              className="px-4 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50"
            >
              더보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteList;
