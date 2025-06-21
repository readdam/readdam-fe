import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  HeartIcon,
  MessageSquareIcon,
  EyeIcon,
  SearchIcon,
  PenIcon,
  BookOpenIcon,
  ClockIcon,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

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
    recent: '최신순',
    views: '조회순',
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
    fetchWrites(true);
  }, [searchParams]);

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
            <div key={post.writeId} className="bg-white rounded-lg p-4 flex gap-4 hover:shadow-sm transition-shadow">
              {post.img ? (
                <img src={`${url}/image?filename=${post.img}`} alt="" className="w-48 h-48 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-48 h-48 bg-[#F3D5C9] rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="w-12 h-12 text-[#E88D67]" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 text-sm rounded-full bg-[#F3F7EC] text-[#006989]">{typeMap[post.type]}</span>
                  <span className="px-3 py-1 text-sm rounded-full bg-[#FDF3F0] text-[#E88D67]">{getReviewStatus(post.endDate)}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium text-[#006989]">{post.username}</span>
                  <span className="mx-2">•</span>
                  <span>{post.regDate?.split('T')[0]}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1"><HeartIcon className="w-4 h-4 text-[#E88D67]" />{post.likes}</div>
                  <div className="flex items-center gap-1"><MessageSquareIcon className="w-4 h-4 text-[#006989]" />{post.commentCnt}</div>
                  <div className="flex items-center gap-1"><EyeIcon className="w-4 h-4" />{post.viewCnt}</div>
                  <div className="flex items-center gap-1 ml-auto"><ClockIcon className="w-4 h-4" /><span>{post.timeAgo}</span></div>
                </div>
              </div>
            </div>
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
