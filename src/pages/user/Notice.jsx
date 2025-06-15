import React, { useState } from 'react'
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
} from 'lucide-react'
const Notice = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearched, setIsSearched] = useState(false)
  const [expandedItems, setExpandedItems] = useState([1]) // 첫 번째 항목만 기본 펼침
  // 더미 공지사항 데이터
  const notices = [
    {
      id: 1,
      title: '시스템 점검 안내',
      date: '2025-01-15',
      content:
        '안녕하세요. 읽담 서비스 이용에 감사드립니다. 더 나은 서비스 제공을 위한 시스템 점검을 실시할 예정입니다. 점검 시간 동안 일시적으로 서비스 이용이 제한될 수 있으니, 이용에 참고 부탁드립니다.',
    },
    {
      id: 2,
      title: '개인정보 처리방침 변경 안내',
      date: '2025-01-10',
      content:
        '개인정보보호법 개정에 따라 읽담의 개인정보 처리방침이 일부 변경됩니다. 주요 변경사항은 개인정보 수집 항목 및 이용 목적에 관한 내용이며, 변경된 방침은 2025년 2월 1일부터 적용됩니다.',
    },
    {
      id: 3,
      title: '2025년 4월 이벤트 당첨자 발표',
      date: '2025-01-08',
      content:
        '2025년 4월 "봄맞이 독서 챌린지" 이벤트에 참여해주신 모든 분들께 감사드립니다. 당첨자 분들께는 개별 연락을 드릴 예정이며, 상품은 순차적으로 발송됩니다.',
    },
    {
      id: 4,
      title: '2025년 3월 이벤트 당첨자 발표',
      date: '2025-01-05',
      content:
        '3월 "책과 함께하는 힐링 타임" 이벤트 당첨자를 발표합니다. 많은 관심과 참여 감사드리며, 당첨되신 분들께는 이메일로 안내를 드렸습니다.',
    },
    {
      id: 5,
      title: '새로운 첨삭 서비스 오픈',
      date: '2025-01-03',
      content:
        '독서 감상문뿐만 아니라 자기소개서, 수필 등 다양한 글에 대한 전문 첨삭 서비스를 새롭게 오픈했습니다. 전문 첨삭자들의 세심한 피드백으로 더 나은 글쓰기를 경험해보세요.',
    },
    {
      id: 6,
      title: '모바일 앱 업데이트 안내',
      date: '2024-12-28',
      content:
        '읽담 모바일 앱이 새롭게 업데이트되었습니다. 새로운 기능으로는 오프라인 글 작성, 푸시 알림 설정, 다크 모드 등이 추가되었습니다. 앱스토어에서 업데이트해주세요.',
    },
    {
      id: 7,
      title: '연말연시 고객센터 운영 안내',
      date: '2024-12-25',
      content:
        '연말연시 기간 동안 고객센터 운영시간이 단축됩니다. 12월 30일부터 1월 2일까지는 오전 10시부터 오후 5시까지 운영하며, 긴급한 문의는 온라인으로 접수 부탁드립니다.',
    },
    {
      id: 8,
      title: '독서모임 매칭 서비스 런칭',
      date: '2024-12-20',
      content:
        'AI 기반 독서모임 매칭 서비스가 정식 런칭되었습니다. 취향과 관심사가 비슷한 독자들과 자동으로 매칭되어 더욱 즐거운 독서 경험을 만들어보세요.',
    },
    {
      id: 9,
      title: '겨울 독서 챌린지 이벤트',
      date: '2024-12-15',
      content:
        '12월부터 2월까지 진행되는 겨울 독서 챌린지에 참여하세요. 매주 책을 읽고 감상문을 작성하면 포인트를 적립할 수 있으며, 누적 포인트에 따라 다양한 상품을 받을 수 있습니다.',
    },
    {
      id: 10,
      title: '서비스 이용약관 개정 안내',
      date: '2024-12-10',
      content:
        '서비스 품질 향상을 위해 이용약관을 일부 개정합니다. 주요 개정 내용은 커뮤니티 이용 규칙 및 콘텐츠 저작권 관련 사항입니다. 개정된 약관은 12월 20일부터 적용됩니다.',
    },
    {
      id: 11,
      title: '새로운 장르 카테고리 추가',
      date: '2024-12-05',
      content:
        '사용자 요청에 따라 새로운 도서 장르 카테고리를 추가했습니다. 웹툰, 만화, 그래픽 노블 등의 카테고리가 새롭게 추가되어 더욱 다양한 콘텐츠를 즐기실 수 있습니다.',
    },
    {
      id: 12,
      title: '포인트 적립 혜택 확대',
      date: '2024-11-30',
      content:
        '독후감 작성, 첨삭 참여, 모임 참가 등 다양한 활동에 대한 포인트 적립 혜택을 확대했습니다. 적립된 포인트는 도서 구매, 프리미엄 서비스 이용 등에 사용하실 수 있습니다.',
    },
    {
      id: 13,
      title: '작가와의 만남 이벤트 개최',
      date: '2024-11-25',
      content:
        '매월 셋째 주 토요일마다 인기 작가와의 온라인 만남 이벤트를 개최합니다. 작가의 창작 과정과 독서에 대한 이야기를 들을 수 있는 소중한 기회입니다.',
    },
    {
      id: 14,
      title: '독서 통계 기능 추가',
      date: '2024-11-20',
      content:
        '개인 독서 통계 기능이 새롭게 추가되었습니다. 월별, 연도별 독서량, 선호 장르 분석, 독서 목표 달성률 등을 한눈에 확인할 수 있습니다.',
    },
    {
      id: 15,
      title: '읽담 서비스 정식 오픈',
      date: '2024-11-15',
      content:
        '드디어 읽담 서비스가 정식으로 오픈되었습니다! 독서를 사랑하는 모든 분들과 함께 책을 읽고, 생각을 나누며, 성장하는 공간이 되겠습니다. 많은 관심과 참여 부탁드립니다.',
    },
  ]
  // 검색 기능
  const filteredNotices =
    isSearched && searchKeyword
      ? notices.filter(
          (notice) =>
            notice.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchKeyword.toLowerCase()),
        )
      : notices
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      setIsSearched(true)
    }
  }
  const clearSearch = () => {
    setSearchKeyword('')
    setIsSearched(false)
  }
  // 아코디언 토글
  const toggleExpanded = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }
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
              {searchKeyword && (
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
                공지사항 검색 결과 {filteredNotices.length}건입니다.
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
          {filteredNotices.map((notice, index) => (
            <div key={notice.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleExpanded(notice.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-500">{notice.date}</p>
                </div>
                {expandedItems.includes(notice.id) ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedItems.includes(notice.id) && (
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
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
              이전
            </button>
            <button className="px-4 py-2 bg-[#006989] text-white rounded">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Notice
